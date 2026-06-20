const express = require('express');
const Booking = require('../models/Booking');
const Turf = require('../models/Turf');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Create a new booking
router.post('/', verifyToken, async (req, res) => {
  try {
    const { turfId, date, timeSlot } = req.body;
    const userId = req.userId;

    if (!turfId || !date || !timeSlot) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ error: 'Turf not found' });
    }

    const existingBooking = await Booking.findOne({
      turfId,
      date,
      timeSlot,
      status: { $ne: 'Cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'Time slot already booked' });
    }

    const booking = new Booking({
      userId,
      turfId,
      date,
      timeSlot,
      status: 'Confirmed'
    });

    await booking.save();
    res.status(201).json({ message: 'Booking successful', booking });
  } catch (err) {
    console.error('Booking Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings for the logged-in user
router.get('/my-bookings', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .populate('turfId', 'name location price')
      .sort({ date: -1, createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all bookings (Admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('turfId', 'name location price')
      .sort({ date: -1, createdAt: -1 });
    
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching all bookings:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a booking (Admin can delete any, user can delete their own)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user is admin OR if they own the booking
    if (req.role === 'admin' || booking.userId.toString() === req.userId) {
      await Booking.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Booking deleted successfully' });
    }

    return res.status(403).json({ error: 'Not authorized to delete this booking' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;