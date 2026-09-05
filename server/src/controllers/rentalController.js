const rentalService = require('../services/rentalService');

class RentalController {
  async getItems(req, res) {
    try {
      const { category, search } = req.query;
      const items = await rentalService.getAllItems(category, search);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getItemById(req, res) {
    try {
      const item = await rentalService.getItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Rental item not found' });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createItem(req, res) {
    try {
      const { category, title, dailyPrice, specs, description, image, deposit } = req.body;

      if (!category || !title || !dailyPrice || !description || !image || deposit === undefined) {
        return res.status(400).json({ message: 'Please fill in all required fields' });
      }

      const id = `${category.substring(0, 3)}-${Date.now()}`;

      const newItem = await rentalService.createItem({
        id,
        category,
        title,
        dailyPrice: Number(dailyPrice),
        specs: specs || [],
        description,
        image,
        ownerId: req.user._id.toString(),
        ownerName: req.user.name,
        ownerEmail: req.user.email,
        ownerPhone: req.user.phone || '+94 77 123 4567',
        deposit: Number(deposit),
        status: 'active'
      });

      res.status(201).json(newItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async createBooking(req, res) {
    try {
      const { itemId, startDate, duration } = req.body;

      if (!itemId || !startDate || !duration) {
        return res.status(400).json({ message: 'Please specify item, start date, and duration' });
      }

      const item = await rentalService.getItemById(itemId);
      if (!item) {
        return res.status(404).json({ message: 'Rental item not found' });
      }

      if (item.ownerId === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot rent your own item' });
      }

      const total = item.dailyPrice * Number(duration);

      const booking = await rentalService.createBooking({
        itemId,
        itemTitle: item.title,
        itemImage: item.image,
        itemDailyPrice: item.dailyPrice,
        itemDeposit: item.deposit,
        requesterId: req.user._id.toString(),
        requesterName: req.user.name,
        requesterEmail: req.user.email,
        requesterPhone: req.user.phone || '',
        providerId: item.ownerId,
        providerName: item.ownerName,
        providerEmail: item.ownerEmail,
        providerPhone: item.ownerPhone,
        startDate,
        duration: Number(duration),
        totalPrice: total,
        status: 'pending'
      });

      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getMyBookings(req, res) {
    try {
      const bookings = await rentalService.getMyRequests(req.user._id.toString());
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getIncomingBookings(req, res) {
    try {
      const bookings = await rentalService.getMyIncoming(req.user._id.toString());
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateBookingStatus(req, res) {
    try {
      const { status } = req.body;
      const validStatuses = ['accepted', 'rejected', 'completed'];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      const updated = await rentalService.updateBookingStatus(
        req.params.id,
        status,
        req.user._id.toString()
      );

      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new RentalController();
