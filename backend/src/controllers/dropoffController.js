// Simplified dropoff controller that doesn't rely on database models that might not exist
// Mock data to ensure the frontend works correctly

const Booking = require('../models/Booking');
const Station = require('../models/Station');
const Vehicle = require('../models/Vehicle');
const { uploadCloudinary } = require('../utils/cloudinary.js');

// Admin Dropoff Controller - just returns mock data for now
exports.adminDropoff = async (req, res) => {
  try {
    console.log('Admin dropoff request received:', req.body);
    const { dropOffString } = req.body;

    // Simple validation
    if (!dropOffString) {
      console.log('Booking ID missing in request');
      return res.status(400).json({ success: false, message: 'Booking ID is missing' });
    }

    const booking = await Booking.findById(dropOffString).populate('vehicle user');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    console.log('Responding with booking data');
    
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error in dropoff:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Admin Dropoff Confirm - just logs data and returns success
exports.adminDropoffConfirm = async (req, res) => {
  try {
    console.log('Admin dropoff confirm request received:', req.body);
    const { bookingId, damageAssessment } = req.body;
    const files = req.files;

    // Simple validation
    if (!bookingId) {
      console.log('Booking ID missing in confirm request');
      return res.status(400).json({ success: false, message: 'Booking ID is missing' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Handle photo uploads if files are present
    if (files && files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        try {
          const result = await uploadCloudinary(file.path, 'dropoff-photos');
          return result.secure_url;
        } catch (error) {
          console.error('Error uploading to Cloudinary:', error);
          throw error;
        }
      });

      // Wait for all uploads to complete
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Update booking with dropoff photos
      booking.returnImages = uploadedUrls;
      booking.returnTime = new Date();
    }

   // Update vehicle status based on damage assessment
    const vehicle = await Vehicle.findById(booking.vehicle);
    if (vehicle) {
      if (damageAssessment && damageAssessment.hasDamage) {
        vehicle.status = "MAINTENANCE";
        vehicle.damageNotes = damageAssessment.damageNotes || "";
      } else {
        vehicle.status = "AVAILABLE";
      }
      await vehicle.save();
    }

    // Update station's available vehicles
    const station = await Station.findById(booking.station);
    if (station) {
      station.availableVehicles.push(booking.vehicle);
      await station.save();
    }

    booking.status = "completed";
    await booking.save();

    // Log data for debugging
    console.log('Dropoff confirmed for booking:', bookingId);
    console.log('Damage assessment:', damageAssessment);

    res.status(200).json({ 
      success: true, 
      data: booking,
      message: damageAssessment && damageAssessment.hasDamage 
        ? "Vehicle marked for maintenance due to reported damage" 
        : "Vehicle returned successfully and marked as available"
    });
  } catch (error) {
    console.error('Error confirming dropoff:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// // Mock license image endpoint
// exports.getLicenseImage = async (req, res) => {
//   try {
//     console.log('License image request received for:', req.params.licenseNumber);
//     const { licenseNumber } = req.params;
    
//     // Return a mock response for any license number
//     res.status(200).json({
//       success: true,
//       imageUrl: "https://via.placeholder.com/400x250?text=Driving+License"
//     });
//   } catch (error) {
//     console.error('Error fetching license image:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// }; 