const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  actualEndTime: Date,
  package: {
    hours: Number,
    price: Number
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  pickupQR: String,
  returnQR: String,
  qrExpiry: Date,
  pickupImages: [String],
  returnImages: [String],
  damages: [{
    description: String,
    images: [String],
    charges: Number
  }],
  extraCharges: [{
    type: {
      type: String,
      enum: ['OVERTIME', 'DAMAGE', 'TRAFFIC_VIOLATION']
    },
    amount: Number,
    description: String
  }],
  totalAmount: Number,
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  }
});

module.exports = mongoose.model('Contract', contractSchema); 