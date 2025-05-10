const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Station = require('../models/Station');
const { uploadOnCloudinary } = require('../utils/cloudinary.js'); // Changed to match auth
const User = require('../models/User');

exports.adminDropoffConfirm = async (req, res) => {
  try {
    console.log('Admin dropoff confirm request received:', req.body);
    console.log("Request files:", req.files);
    
    const { bookingId, damageAssessment, overtimeCharges } = req.body;
    const files = req.files?.abc; // Changed to match the field name in route

    // Parse damageAssessment if it's a string
    const parsedDamageAssessment = typeof damageAssessment === 'string' 
      ? JSON.parse(damageAssessment) 
      : damageAssessment;

    console.log("Parsed damage assessment:", parsedDamageAssessment);

    // Simple validation
    if (!bookingId) {
      console.log('Booking ID missing in confirm request');
      return res.status(400).json({ success: false, message: 'Booking ID is missing' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const user = await User.findById(booking.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Ensure wallet exists and is properly initialized
    if (!user.wallet) {
      user.wallet = {
        balance: 0,
        transactions: []
      };
    }

    // Calculate total deduction with proper parsing
    const damageCost = parseFloat(parsedDamageAssessment.totalCost) || 0;
    const overtimeCost = parseFloat(overtimeCharges) || 0;
    const totalDeduction = damageCost + overtimeCost;

    console.log("Damage cost:", damageCost);
    console.log("Overtime cost:", overtimeCost);
    console.log("Total deduction:", totalDeduction);

    // Ensure balance is a valid number
    if (typeof user.wallet.balance !== 'number' || isNaN(user.wallet.balance)) {
      user.wallet.balance = 0;
    }

    // Deduct from wallet
    user.wallet.balance -= totalDeduction;
    console.log("User wallet balance after deduction:", user.wallet.balance);

    if(totalDeduction > 0 ) {
      user.wallet?.transactions?.push({   
        type: "DEBIT",
        amount: totalDeduction,
        description: `Dropoff charges for vehicle ${booking.vehicle}`,
      });
    }

    await user.save();

    // Update booking with charges
    booking.overtimeCharges = overtimeCost;
    booking.totalCharges = totalDeduction;

    booking.damageReport = {
      hasDamages: parsedDamageAssessment.hasDamage,
      notes: parsedDamageAssessment.damageNotes,
      estimatedRepairCost: damageCost
    };
    await booking.save();

    // Handle photo uploads if files are present
    let uploadedUrls = [];
    if (files && files.length > 0) {
      uploadedUrls = await Promise.all(
        files.map(async (file) => {
          try {
            console.log("About to upload to cloudinary with path:", file.path);
            const result = await uploadOnCloudinary(file.path);
            console.log("Cloudinary response:", result);
            return result?.url || ""; // Match auth controller's pattern
          } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
          }
        })
      );

      // Update booking with dropoff photos
      booking.returnImages = uploadedUrls;
      booking.returnTime = new Date();
    }

    const vehicle = await Vehicle.findById(booking.vehicle);
    if (vehicle) {
      if (parsedDamageAssessment.hasDamage) {
        vehicle.status = "MAINTENANCE";
        vehicle.damageNotes = parsedDamageAssessment.damageNotes || "";
      } else {
        vehicle.status = "AVAILABLE";
        console.log("vehical status updated to avaialable"); 
      }
      await vehicle.save();
    }

    // Update station's available vehicles
    const station = await Station.findById(booking.station);
    if (station) {
      station.availableVehicles.push(booking.vehicle);
      await station.save();
      console.log( "VEHICAL IS PUSHED AGAIN IN STATION ARRAY" ); 
    }

    booking.status = "completed";
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Dropoff confirmed successfully with photos'
    });
    
  } catch (error) {
    console.error('Error confirming dropoff:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message // Added error message like auth controller
    });
  }
};