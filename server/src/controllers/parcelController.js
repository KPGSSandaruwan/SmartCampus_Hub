const parcelService = require('../services/parcelService');

class ParcelController {
  async createParcel(req, res) {
    try {
      const { pickupLocation, dropLocation, weightKg } = req.body;
      if (!pickupLocation || !dropLocation || weightKg === undefined) {
        return res.status(400).json({ message: 'Pickup location, drop location, and weight are required' });
      }

      const parcel = await parcelService.createParcelRequest(
        req.user._id.toString(),
        pickupLocation,
        dropLocation,
        parseFloat(weightKg)
      );
      res.status(201).json(parcel);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getParcels(req, res) {
    try {
      const User = require('../models/User');
      const parcels = await parcelService.getParcels();
      const parcelsJson = JSON.parse(JSON.stringify(parcels));
      for (const parcel of parcelsJson) {
        const senderUser = await User.findByPk(parcel.senderId, { attributes: ['name', 'email', 'phone', 'avatar'] });
        if (senderUser) {
          parcel.senderProfile = senderUser;
        }
        if (parcel.assignment && parcel.assignment.riderDetails) {
          const riderUser = await User.findByPk(parcel.assignment.riderDetails.userId, { attributes: ['name', 'email', 'phone', 'avatar'] });
          if (riderUser) {
            parcel.assignment.riderDetails.userProfile = riderUser;
          }
        }
      }
      res.json(parcelsJson);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getParcelById(req, res) {
    try {
      const User = require('../models/User');
      const parcel = await parcelService.getParcelById(parseInt(req.params.id));
      if (!parcel) {
        return res.status(404).json({ message: 'Parcel not found' });
      }
      const parcelJson = parcel.toJSON();

      const senderUser = await User.findByPk(parcelJson.senderId, { attributes: ['name', 'email', 'phone', 'avatar'] });
      if (senderUser) {
        parcelJson.senderProfile = senderUser;
      }

      if (parcelJson.assignment && parcelJson.assignment.riderDetails) {
        const riderUser = await User.findByPk(parcelJson.assignment.riderDetails.userId, { attributes: ['name', 'email', 'phone', 'avatar'] });
        if (riderUser) {
          parcelJson.assignment.riderDetails.userProfile = riderUser;
        }
      }

      res.json(parcelJson);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async assignParcel(req, res) {
    try {
      const { parcelId, riderId } = req.body;
      if (!parcelId || !riderId) {
        return res.status(400).json({ message: 'Parcel ID and Rider ID are required' });
      }

      const assignment = await parcelService.assignParcel(
        parseInt(parcelId),
        parseInt(riderId)
      );
      res.status(200).json(assignment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async completeDelivery(req, res) {
    try {
      const { parcelId } = req.body;
      if (!parcelId) {
        return res.status(400).json({ message: 'Parcel ID is required' });
      }

      const parcel = await parcelService.completeDelivery(
        parseInt(parcelId),
        req.user._id.toString()
      );
      res.json(parcel);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async trackParcel(req, res) {
    try {
      const User = require('../models/User');
      const { trackingCode } = req.params;
      if (!trackingCode) {
        return res.status(400).json({ message: 'Tracking code is required' });
      }

      const parcel = await parcelService.trackParcelByCode(trackingCode);
      if (!parcel) {
        return res.status(404).json({ message: 'Parcel tracking code not found' });
      }

      const parcelJson = parcel.toJSON();
      const senderUser = await User.findByPk(parcelJson.senderId, { attributes: ['name', 'email', 'phone', 'avatar'] });
      if (senderUser) {
        parcelJson.senderProfile = senderUser;
      }

      if (parcelJson.assignment && parcelJson.assignment.riderDetails) {
        const riderUser = await User.findByPk(parcelJson.assignment.riderDetails.userId, { attributes: ['name', 'email', 'phone', 'avatar'] });
        if (riderUser) {
          parcelJson.assignment.riderDetails.userProfile = riderUser;
        }
      }

      res.json(parcelJson);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const parcelId = parseInt(req.params.id);
      if (!parcelId || !status) {
        return res.status(400).json({ message: 'Parcel ID and status are required' });
      }

      const parcel = await parcelService.updateParcelStatus(
        parcelId,
        status,
        req.user._id.toString()
      );
      res.json(parcel);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new ParcelController();
