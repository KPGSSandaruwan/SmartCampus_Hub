const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Listing = require('../models/Listing');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/listings
// @desc    Get all listings with optional category & search filter
router.get('/', async (req, res) => {
  try {
    const { category, search, status } = req.query;
    let whereClause = {};

    if (category && category !== 'all') {
      whereClause.category = category;
    }

    if (status) {
      whereClause.status = status;
    } else {
      whereClause.status = 'active';
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    const listings = await Listing.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['name', 'email', 'avatar', 'rating', 'phone', 'universityId']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/listings/:id
// @desc    Get listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['name', 'email', 'avatar', 'rating', 'phone', 'universityId']
        }
      ]
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/listings
// @desc    Create a new listing
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, price, location, images, details } = req.body;

    const listing = await Listing.create({
      title,
      description,
      category,
      price,
      location,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600'],
      details: details || {},
      ownerId: req.user.id
    });

    const populated = await Listing.findByPk(listing.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['name', 'email', 'avatar', 'rating']
        }
      ]
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/listings/:id
// @desc    Update listing
router.put('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this listing' });
    }

    await listing.update(req.body);

    const updatedListing = await Listing.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['name', 'email', 'avatar', 'rating']
        }
      ]
    });

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/listings/:id
// @desc    Delete a listing
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await listing.destroy();
    res.json({ message: 'Listing removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
