const express = require('express');
const Turf = require('../models/Turf');
const router = express.Router();

// Get all turfs
router.get('/', async (req, res) => {
  try {
    const turfs = await Turf.find();
    res.json(turfs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single turf by ID
router.get('/:id', async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ error: 'Turf not found' });
    }
    res.json(turf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new turf
router.post('/', async (req, res) => {
  try {
    const { name, location, price, availableSlots } = req.body;
    const newTurf = new Turf({ name, location, price, availableSlots });
    await newTurf.save();
    res.status(201).json(newTurf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update turf (NEW)
router.put('/:id', async (req, res) => {
  try {
    const { name, location, price, availableSlots } = req.body;
    
    const updatedTurf = await Turf.findByIdAndUpdate(
      req.params.id,
      { name, location, price, availableSlots },
      { new: true, runValidators: true }
    );
    
    if (!updatedTurf) {
      return res.status(404).json({ error: 'Turf not found' });
    }
    
    res.json(updatedTurf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete turf (NEW)
router.delete('/:id', async (req, res) => {
  try {
    const deletedTurf = await Turf.findByIdAndDelete(req.params.id);
    
    if (!deletedTurf) {
      return res.status(404).json({ error: 'Turf not found' });
    }
    
    res.json({ message: 'Turf deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;