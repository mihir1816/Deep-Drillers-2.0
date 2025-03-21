const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  numberPlate: {
    type: String,
    required: true,
    unique: true
  },
  model: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['CAR', 'BIKE', 'SCOOTER']
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'BOOKED', 'MAINTENANCE', 'CHARGING'],
    default: 'AVAILABLE'
  },
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: true
  },
  chargingStatus: {
    level: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    lastCharged: Date
  },
  damages: [{
    description: String,
    images: [String],
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  pricePerHour: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema); 