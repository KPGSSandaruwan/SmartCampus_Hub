const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Listing = require('../models/Listing');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create a new order / booking request
router.post('/', protect, async (req, res) => {
  try {
    const { listingId, notes, totalPrice } = req.body;

    const listing = await Listing.findByPk(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.ownerId === req.user.id) {
      return res.status(400).json({ message: 'You cannot request your own listing' });
    }

    const order = await Order.create({
      listingId,
      requesterId: req.user.id,
      providerId: listing.ownerId,
      totalPrice: totalPrice || listing.price,
      notes: notes || ''
    });

    const populated = await Order.findByPk(order.id, {
      include: [
        { model: Listing, as: 'listing' },
        { model: User, as: 'requester', attributes: ['name', 'email', 'avatar', 'phone', 'universityId'] },
        { model: User, as: 'provider', attributes: ['name', 'email', 'avatar', 'phone', 'universityId'] }
      ]
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/orders/my-requests
// @desc    Get requests placed by current logged-in user
router.get('/my-requests', protect, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { requesterId: req.user.id },
      include: [
        { model: Listing, as: 'listing' },
        { model: User, as: 'provider', attributes: ['name', 'email', 'avatar', 'phone', 'rating'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/my-incoming
// @desc    Get incoming requests received for current user's listings
router.get('/my-incoming', protect, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { providerId: req.user.id },
      include: [
        { model: Listing, as: 'listing' },
        { model: User, as: 'requester', attributes: ['name', 'email', 'avatar', 'phone', 'rating', 'universityId'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH /api/orders/:id/status
// @desc    Update status of an order (accept/reject/completed)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order request not found' });
    }

    const isProvider = order.providerId === req.user.id;
    const isRequester = order.requesterId === req.user.id;

    if (!isProvider && !isRequester && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    order.status = status;
    await order.save();

    const updated = await Order.findByPk(order.id, {
      include: [
        { model: Listing, as: 'listing' },
        { model: User, as: 'requester', attributes: ['name', 'email', 'avatar', 'phone'] },
        { model: User, as: 'provider', attributes: ['name', 'email', 'avatar', 'phone'] }
      ]
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
