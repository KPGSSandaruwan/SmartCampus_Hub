const { Op } = require('sequelize');
const RentalItem = require('../models/RentalItem');
const RentalBooking = require('../models/RentalBooking');

class RentalService {
  async getAllItems(category, search) {
    const where = { status: 'active' };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { ownerName: { [Op.like]: `%${search}%` } }
      ];
    }

    return await RentalItem.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
  }

  async getItemById(id) {
    return await RentalItem.findByPk(id);
  }

  async createItem(itemData) {
    return await RentalItem.create(itemData);
  }

  async createBooking(bookingData) {
    return await RentalBooking.create(bookingData);
  }

  async getMyRequests(requesterId) {
    return await RentalBooking.findAll({
      where: { requesterId },
      order: [['created_at', 'DESC']]
    });
  }

  async getMyIncoming(providerId) {
    return await RentalBooking.findAll({
      where: { providerId },
      order: [['created_at', 'DESC']]
    });
  }

  async getBookingById(id) {
    return await RentalBooking.findByPk(id);
  }

  async updateBookingStatus(bookingId, status, userId) {
    const booking = await RentalBooking.findByPk(bookingId);
    if (!booking) {
      throw new Error('Booking request not found');
    }

    const isProvider = booking.providerId === userId;
    const isRequester = booking.requesterId === userId;

    if (!isProvider && !isRequester) {
      throw new Error('Not authorized to update this booking request');
    }

    if (status === 'accepted' || status === 'rejected') {
      if (!isProvider) {
        throw new Error('Only the provider can accept or reject bookings');
      }
    }

    booking.status = status;
    await booking.save();
    return booking;
  }
}

module.exports = new RentalService();
