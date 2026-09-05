const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const { protect } = require('../middleware/auth');

// Items routes
router.get('/items', rentalController.getItems);
router.get('/items/:id', rentalController.getItemById);
router.post('/items', protect, rentalController.createItem);

// Bookings routes
router.post('/bookings', protect, rentalController.createBooking);
router.get('/bookings/my-requests', protect, rentalController.getMyBookings);
router.get('/bookings/my-incoming', protect, rentalController.getIncomingBookings);
router.patch('/bookings/:id/status', protect, rentalController.updateBookingStatus);

module.exports = router;
