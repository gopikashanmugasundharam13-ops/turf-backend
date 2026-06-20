const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  availableSlots: {
    type: [String],
    required: true
  }
}, {
  timestamps: true,
  collection: 'turfs'  // FORCE use of 'turfs' collection
});

// Safe export
module.exports = mongoose.models.Turf || mongoose.model('Turf', turfSchema);