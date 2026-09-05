const Parcel = require('../models/Parcel');
const ParcelAssignment = require('../models/ParcelAssignment');
const Rider = require('../models/Rider');

class ParcelService {
  calculatePrice(pickup, drop, weightKg) {
    const weight = parseFloat(weightKg);
    if (isNaN(weight) || weight <= 0) return 0;

    const route = `${pickup} -> ${drop}`.toLowerCase();
    const isIntercity = route.includes('matara') || route.includes('weligama');

    if (isIntercity) {
      if (weight <= 1) {
        return 200;
      }
      return 200 + Math.ceil(weight - 1) * 100;
    } else {
      if (weight <= 1) {
        return 100;
      }
      return Math.ceil(weight) * 200;
    }
  }

  generateTrackingCode() {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `TRK-${randomDigits}`;
  }

  async createParcelRequest(senderId, pickupLocation, dropLocation, weightKg) {
    const weight = parseFloat(weightKg);
    if (isNaN(weight) || weight <= 0) {
      throw new Error('Weight must be a positive number');
    }

    const price = this.calculatePrice(pickupLocation, dropLocation, weight);
    const trackingCode = this.generateTrackingCode();

    return await Parcel.create({
      senderId,
      pickupLocation,
      dropLocation,
      weightKg: weight,
      price,
      trackingCode,
      status: 'pending'
    });
  }

  async getParcels() {
    return await Parcel.findAll({
      include: [{
        model: ParcelAssignment,
        as: 'assignment',
        include: [{
          model: Rider,
          as: 'riderDetails'
        }]
      }],
      order: [['created_at', 'DESC']]
    });
  }

  async getParcelById(id) {
    return await Parcel.findByPk(id, {
      include: [{
        model: ParcelAssignment,
        as: 'assignment',
        include: [{
          model: Rider,
          as: 'riderDetails'
        }]
      }]
    });
  }

  async trackParcelByCode(trackingCode) {
    const cleanCode = trackingCode ? trackingCode.trim().toUpperCase() : '';
    let parcel = await Parcel.findOne({
      where: { trackingCode: cleanCode },
      include: [{
        model: ParcelAssignment,
        as: 'assignment',
        include: [{
          model: Rider,
          as: 'riderDetails'
        }]
      }]
    });

    if (!parcel && !isNaN(parseInt(cleanCode))) {
      parcel = await Parcel.findByPk(parseInt(cleanCode), {
        include: [{
          model: ParcelAssignment,
          as: 'assignment',
          include: [{
            model: Rider,
            as: 'riderDetails'
          }]
        }]
      });
    }

    return parcel;
  }

  async assignParcel(parcelId, riderId) {
    const parcel = await Parcel.findByPk(parcelId);
    if (!parcel) {
      throw new Error('Parcel not found');
    }

    if (parcel.status !== 'pending') {
      throw new Error('Parcel is already assigned or completed');
    }

    const rider = await Rider.findByPk(riderId);
    if (!rider) {
      throw new Error('Rider not found');
    }

    const assignment = await ParcelAssignment.create({
      parcelId,
      riderId
    });

    parcel.status = 'assigned';
    await parcel.save();

    return assignment;
  }

  async updateParcelStatus(parcelId, status, riderUserId) {
    const parcel = await Parcel.findByPk(parcelId, {
      include: [{
        model: ParcelAssignment,
        as: 'assignment',
        include: [{
          model: Rider,
          as: 'riderDetails'
        }]
      }]
    });

    if (!parcel) {
      throw new Error('Parcel not found');
    }

    const rider = parcel.assignment?.riderDetails;
    if (!rider || rider.userId !== riderUserId) {
      throw new Error('Not authorized to update status for this parcel');
    }

    const validStatuses = ['assigned', 'in_transit', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid parcel status update');
    }

    parcel.status = status;
    if (status === 'in_transit' && !parcel.pickedUpAt) {
      parcel.pickedUpAt = new Date();
    } else if (status === 'completed') {
      parcel.deliveredAt = new Date();
      if (!parcel.pickedUpAt) parcel.pickedUpAt = new Date();
    }

    await parcel.save();
    return parcel;
  }

  async completeDelivery(parcelId, riderUserId) {
    return await this.updateParcelStatus(parcelId, 'completed', riderUserId);
  }
}

module.exports = new ParcelService();
