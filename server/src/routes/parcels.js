const express = require('express');
const router = express.Router();
const parcelController = require('../controllers/parcelController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, parcelController.createParcel);
router.get('/', protect, parcelController.getParcels);
router.get('/track/:trackingCode', parcelController.trackParcel);
router.get('/:id', protect, parcelController.getParcelById);
router.post('/assign', protect, parcelController.assignParcel);
router.patch('/:id/status', protect, parcelController.updateStatus);
router.post('/complete', protect, parcelController.completeDelivery);

module.exports = router;
