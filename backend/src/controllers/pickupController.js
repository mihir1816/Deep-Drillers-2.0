const Booking = require('../models/Booking'); // Import your Booking model
const Station = require('../models/Station'); // Import Station model
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

exports.adminPickup = async (req, res) => {
  try {
    const { pickupString } = req.body;

    console.log("pickupString", pickupString);

    const bookingId = pickupString ; 

    if (!bookingId) { 
      return res.status(400).json({ success: false, message: 'Booking ID is missing' });
    } 

    const booking = await Booking.findById(bookingId) ; 

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
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
    const files = req.files?.abc; 

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
            console.log("About to upload to cloudinary with path:", file.path);
            const result = await uploadOnCloudinary(file.path);
            console.log("Cloudinary response:", result);
            return result?.url || "";
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

    const station = await Station.findById(booking.station);
    console.log("got station data to remove vehical from array");
    if (station) {
      // Remove the vehicle ID from availableVehicles array
      station.availableVehicles = station.availableVehicles.filter(
        vehicleId => vehicleId.toString() !== booking.vehicle.toString()
      );
      await station.save();
      console.log("vehical has been removed from array for this station"); 
    }

    booking.status = "active";
    console.log("boooking status to avtive"); 
    await booking.save();

    res.status(200).json({ 
      success: true, 
      data: booking,
      message: 'Pickup confirmed successfully with photos'
    });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message
    });
  }
};


