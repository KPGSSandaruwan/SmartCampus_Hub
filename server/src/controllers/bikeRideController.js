const bikeRideService = require('../services/bikeRideService');

class BikeRideController {
  async registerRider(req, res) {
    try {
      const { bikeNumber, bikeModel, licenseNumber } = req.body;
      if (!bikeNumber || !bikeModel || !licenseNumber) {
        return res.status(400).json({ message: 'Bike number, bike model, and license number are required' });
      }

      const rider = await bikeRideService.registerRider(
        req.user._id.toString(),
        bikeNumber,
        bikeModel,
        licenseNumber
      );
      res.status(201).json(rider);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createRide(req, res) {
    try {
      const { startLocation, endLocation, distanceKm } = req.body;
      if (!startLocation || !endLocation || distanceKm === undefined) {
        return res.status(400).json({ message: 'Start location, end location, and distance are required' });
      }

      const ride = await bikeRideService.createRide(
        req.user._id.toString(),
        startLocation,
        endLocation,
        parseFloat(distanceKm)
      );
      res.status(201).json(ride);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getRides(req, res) {
    try {
      const User = require('../models/User');
      const rides = await bikeRideService.getActiveRides();
      const ridesJson = JSON.parse(JSON.stringify(rides));
      for (const ride of ridesJson) {
        if (ride.riderDetails) {
          const riderUser = await User.findByPk(ride.riderDetails.userId, { attributes: ['name', 'email', 'phone', 'avatar'] });
          if (riderUser) {
            ride.riderDetails.userProfile = riderUser;
          }
        }
      }
      res.json(ridesJson);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getRideById(req, res) {
    try {
      const User = require('../models/User');
      const ride = await bikeRideService.getRideById(parseInt(req.params.id));
      if (!ride) {
        return res.status(404).json({ message: 'Ride not found' });
      }
      const rideJson = ride.toJSON();
      if (rideJson.riderDetails) {
        const riderUser = await User.findByPk(rideJson.riderDetails.userId, { attributes: ['name', 'email', 'phone', 'avatar'] });
        if (riderUser) {
          rideJson.riderDetails.userProfile = riderUser;
        }
      }
      if (rideJson.requests && rideJson.requests.length > 0) {
        for (let i = 0; i < rideJson.requests.length; i++) {
          const reqUser = await User.findByPk(rideJson.requests[i].userId, { attributes: ['name', 'email', 'phone', 'avatar'] });
          if (reqUser) {
            rideJson.requests[i].userProfile = reqUser;
          }
        }
      }
      res.json(rideJson);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async requestRide(req, res) {
    try {
      const { rideId } = req.body;
      if (!rideId) {
        return res.status(400).json({ message: 'Ride ID is required' });
      }

      const request = await bikeRideService.requestRide(
        parseInt(rideId),
        req.user._id.toString()
      );
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async acceptRequest(req, res) {
    try {
      const { requestId } = req.body;
      if (!requestId) {
        return res.status(400).json({ message: 'Request ID is required' });
      }

      const request = await bikeRideService.acceptRideRequest(
        parseInt(requestId),
        req.user._id.toString()
      );
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async completeRide(req, res) {
    try {
      const { rideId } = req.body;
      if (!rideId) {
        return res.status(400).json({ message: 'Ride ID is required' });
      }

      const ride = await bikeRideService.completeRide(
        parseInt(rideId),
        req.user._id.toString()
      );
      res.json(ride);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getRiderProfile(req, res) {
    try {
      const rider = await bikeRideService.getRiderByUserId(req.user._id.toString());
      res.json(rider);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async rateRide(req, res) {
    try {
      const { rideId, rating, comment } = req.body;
      if (!rideId || rating === undefined) {
        return res.status(400).json({ message: 'Ride ID and rating are required' });
      }

      const numRating = parseInt(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
      }

      const rideRating = await bikeRideService.rateRide(
        parseInt(rideId),
        req.user._id.toString(),
        numRating,
        comment
      );
      res.status(201).json(rideRating);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new BikeRideController();
