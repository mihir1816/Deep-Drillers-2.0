const express = require('express');
const {
  getNearbyStations,
  getStationDetails,
  searchStations
} = require('../controllers/location');
const { protect } = require('../middleware/auth');

const router = express.Router();

// router.get('/nearby', protect, getNearbyStations);
// router.get('/search', protect, searchStations);
// router.get('/:id', protect, getStationDetails);

router.get('/nearby' , getNearbyStations);
router.get('/search', searchStations);
router.get('/:id', getStationDetails);

module.exports = router; 