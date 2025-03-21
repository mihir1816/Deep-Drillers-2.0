const Station = require('../models/Station');

// Helper function to calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Get nearby stations
exports.getNearbyStations = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.body; // radius in km, default 10km

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    // Convert string parameters to numbers
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Find stations within the approximate radius using MongoDB geospatial query
    const stations = await Station.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lon, lat], radius / 6371] // radius / Earth's radius
        }
      }
    }).populate('availableVehicles');

    // Calculate exact distances and sort
    const stationsWithDistance = stations.map(station => {
      const distance = calculateDistance(
        lat,
        lon,
        station.location.coordinates[1],
        station.location.coordinates[0]
      );

      return {
        ...station.toObject(),
        distance: parseFloat(distance.toFixed(2))
      };
    });

    // Sort by distance
    const sortedStations = stationsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      count: sortedStations.length,
      data: sortedStations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby stations',
      error: error.message
    });
  }
};

// Get station details
exports.getStationDetails = async (req, res) => {
  try {
    const station = await Station.findById(req.body.id)
      .populate('availableVehicles')
      .populate('reviews.user', 'name');

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    res.status(200).json({
      success: true,
      data: station
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching station details',
      error: error.message
    });
  }
};

// Search stations by name or address
exports.searchStations = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search name'
      });
    }

    const stations = await Station.find({
      $or: [
        { name: { $regex: name, $options: 'i' } },
        { address: { $regex: name, $options: 'i' } }
      ]
    }).populate('availableVehicles');

    res.status(200).json({
      success: true,
      count: stations.length,
      data: stations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching stations',
      error: error.message
    });
  }
}; 