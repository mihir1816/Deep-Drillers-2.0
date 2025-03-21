const express = require('express');
const {
  getNearbyStations,
  getStationDetails,
  searchStations
} = require('../controllers/location');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/nearby', protect, getNearbyStations);
router.get('/search', protect, searchStations);
router.get('/station/:id', protect, getStationDetails);

module.exports = router; 