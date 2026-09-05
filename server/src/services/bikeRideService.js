const { Op } = require('sequelize');
const Rider = require('../models/Rider');
const Ride = require('../models/Ride');
const RideRequest = require('../models/RideRequest');
const RideRating = require('../models/RideRating');

class BikeRideService {
  calculatePrice(distanceKm) {
    const dist = parseFloat(distanceKm);
    if (isNaN(dist) || dist <= 0) return 0;
    if (dist <= 1) {
      return 40;
    }
    return 40 + Math.ceil(dist - 1) * 20;
  }

  async registerRider(userId, bikeNumber, bikeModel, licenseNumber) {
    const existing = await Rider.findOne({ where: { userId } });
    if (existing) {
      throw new Error('User is already registered as a rider');
    }
    return await Rider.create({ userId, bikeNumber, bikeModel, licenseNumber });
  }

  async getRiderByUserId(userId) {
    return await Rider.findOne({ where: { userId } });
  }

  async createRide(userId, startLocation, endLocation, distanceKm) {
    const rider = await Rider.findOne({ where: { userId } });
    if (!rider) {
      throw new Error('User is not registered as a rider. Please register first.');
    }

    const activeRide = await Ride.findOne({
      where: {
        riderId: rider.id,
        status: ['active', 'accepted']
      }
    });
    if (activeRide) {
      throw new Error('You already have an active or ongoing ride');
    }

    const price = this.calculatePrice(distanceKm);

    return await Ride.create({
      riderId: rider.id,
      startLocation,
      endLocation,
      distanceKm: parseFloat(distanceKm),
      price,
      status: 'active'
    });
  }

  async getActiveRides() {
    return await Ride.findAll({
      where: { status: 'active' },
      include: [{
        model: Rider,
        as: 'riderDetails'
      }],
      order: [['created_at', 'DESC']]
    });
  }

  async getRideById(id) {
    return await Ride.findByPk(id, {
      include: [
        { model: Rider, as: 'riderDetails' },
        { model: RideRequest, as: 'requests' }
      ]
    });
  }

  async requestRide(rideId, userId) {
    const ride = await Ride.findByPk(rideId, {
      include: [{ model: Rider, as: 'riderDetails' }]
    });

    if (!ride) {
      throw new Error('Ride not found');
    }

    if (ride.status !== 'active') {
      throw new Error('Ride is no longer active or available');
    }

    if (ride.riderDetails.userId === userId) {
      throw new Error('You cannot request your own ride');
    }

    const existingRequest = await RideRequest.findOne({
      where: { rideId, userId }
    });
    if (existingRequest) {
      throw new Error('You have already requested this ride');
    }

    return await RideRequest.create({
      rideId,
      userId,
      status: 'pending'
    });
  }

  async acceptRideRequest(requestId, riderUserId) {
    const request = await RideRequest.findByPk(requestId, {
      include: [{
        model: Ride,
        as: 'rideDetails',
        include: [{ model: Rider, as: 'riderDetails' }]
      }]
    });

    if (!request) {
      throw new Error('Ride request not found');
    }

    const ride = request.rideDetails;
    if (!ride) {
      throw new Error('Associated ride not found');
    }

    if (ride.riderDetails.userId !== riderUserId) {
      throw new Error('Not authorized to accept requests for this ride');
    }

    if (ride.status !== 'active') {
      throw new Error('Ride is no longer active');
    }

    request.status = 'accepted';
    await request.save();

    await RideRequest.update(
      { status: 'rejected' },
      {
        where: {
          rideId: ride.id,
          id: { [Op.ne]: requestId },
          status: 'pending'
        }
      }
    );

    ride.status = 'accepted';
    await ride.save();

    return request;
  }

  async completeRide(rideId, riderUserId) {
    const ride = await Ride.findByPk(rideId, {
      include: [{ model: Rider, as: 'riderDetails' }]
    });

    if (!ride) {
      throw new Error('Ride not found');
    }

    if (ride.riderDetails.userId !== riderUserId) {
      throw new Error('Not authorized to complete this ride');
    }

    if (ride.status !== 'accepted') {
      throw new Error('Only accepted/ongoing rides can be completed');
    }

    ride.status = 'completed';
    await ride.save();

    return ride;
  }

  async rateRide(rideId, userId, rating, comment) {
    const ride = await Ride.findByPk(rideId);
    if (!ride) {
      throw new Error('Ride not found');
    }

    if (ride.status !== 'completed') {
      throw new Error('Only completed rides can be rated');
    }

    const acceptedRequest = await RideRequest.findOne({
      where: { rideId, userId, status: 'accepted' }
    });

    if (!acceptedRequest) {
      throw new Error('You are not authorized to rate this ride');
    }

    const existingRating = await RideRating.findOne({
      where: { rideId, userId }
    });
    if (existingRating) {
      throw new Error('You have already rated this ride');
    }

    return await RideRating.create({
      rideId,
      userId,
      rating,
      comment
    });
  }
}

module.exports = new BikeRideService();
