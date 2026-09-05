const express = require('express');
const router = express.Router();
const bikeRideController = require('../controllers/bikeRideController');
const { protect } = require('../middleware/auth');

// Rider registration
router.post('/register-rider', protect, bikeRideController.registerRider);
router.get('/rider/profile', protect, bikeRideController.getRiderProfile);

// Ride posting & listing
router.post('/create', protect, bikeRideController.createRide);
router.get('/', bikeRideController.getRides);
router.get('/:id', protect, bikeRideController.getRideById);

// Ride booking transactions
router.post('/request', protect, bikeRideController.requestRide);
router.post('/accept-request', protect, bikeRideController.acceptRequest);
router.post('/complete', protect, bikeRideController.completeRide);
router.post('/rate', protect, bikeRideController.rateRide);

module.exports = router;
