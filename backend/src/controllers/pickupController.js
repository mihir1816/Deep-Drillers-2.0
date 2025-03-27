const Booking = require('../models/Booking'); // Import your Booking model
const Station = require('../models/Station'); // Import Station model
const { uploadCloudinary } = require('../utils/cloudinary.js');

exports.adminPickup = async (req, res) => {
  try {
    const { pickupString } = req.body;

    console.log("pickupString", pickupString);

    const bookingId = pickupString

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is missing' });
    } 

    const booking = await Booking.findById(bookingId) ; 

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const station = await Station.findById(booking.station);
    if (station) {
      // Remove the vehicle ID from availableVehicles array
      station.availableVehicles = station.availableVehicles.filter(
        vehicleId => vehicleId.toString() !== booking.vehicle.toString()
      );
      await station.save();
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

exports.adminPickupConfirm = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const { bookingId } = req.body;
    const files = req.files?.abc; // Use 'abc' since multer uses this field name

    console.log("Extracted bookingId:", bookingId);

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is missing' });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Handle photo uploads if files are present
    let uploadedUrls = [];
    if (files && files.length > 0) {
      uploadedUrls = await Promise.all(
        files.map(async (file) => {
          try {
            const result = await uploadCloudinary(file.path, 'pickup-photos');
            return result.secure_url;
          } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
          }
        })
      );

      // Update booking with pickup photos
      booking.vehicleImages = uploadedUrls;
      booking.pickupTime = new Date();
    }

    booking.status = "active";
    await booking.save();

    res.status(200).json({ 
      success: true, 
      data: booking,
      message: 'Pickup confirmed successfully with photos'
    });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


