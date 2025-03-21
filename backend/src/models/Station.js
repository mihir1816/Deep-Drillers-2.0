const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  capacity: {
    total: Number,
    available: Number
  },
  vehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['ACTIVE', 'MAINTENANCE', 'CLOSED'],
    default: 'ACTIVE'
  },
  operatingHours: {
    open: String,
    close: String
  }
});

// Create geospatial index
stationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Station', stationSchema); 