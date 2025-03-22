const Booking = require("../models/booking");
const Vehicle = require("../models/Vehicle");
const { validationResult } = require("express-validator");

// Handle vehicle pickup
exports.handleVehiclePickup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { bookingId, vehicleImages, notes } = req.body;

        // Find booking
        const booking = await Booking.findById(bookingId)
            .populate("vehicle")
            .populate("user");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({ message: "Invalid booking status" });
        }

        // Update booking status
        booking.status = "active";
        booking.pickupTime = new Date();
        booking.vehicleImages = vehicleImages;
        booking.pickupNotes = notes;
        await booking.save();

        // Update vehicle status
        const vehicle = booking.vehicle;
        vehicle.currentBooking = bookingId;
        await vehicle.save();

        res.json({
            message: "Vehicle pickup processed successfully",
            booking,
        });
    } catch (error) {
        console.error("Error processing vehicle pickup:", error);
        res.status(500).json({ message: "Error processing vehicle pickup" });
    }
};

// Handle vehicle return
exports.handleVehicleReturn = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { bookingId, returnImages, damageReport, notes } = req.body;

        // Find booking
        const booking = await Booking.findById(bookingId)
            .populate("vehicle")
            .populate("user");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.status !== "active") {
            return res.status(400).json({ message: "Invalid booking status" });
        }

        // Update booking status
        booking.status = "completed";
        booking.returnTime = new Date();
        booking.returnImages = returnImages;
        booking.damageReport = damageReport;
        booking.returnNotes = notes;
        await booking.save();

        // Update vehicle status
        const vehicle = booking.vehicle;
        vehicle.isAvailable = true;
        vehicle.currentBooking = null;
        if (damageReport && damageReport.hasDamages) {
            vehicle.status = "maintenance";
            vehicle.damageNotes = damageReport.notes;
        }
        await vehicle.save();

        res.json({
            message: "Vehicle return processed successfully",
            booking,
        });
    } catch (error) {
        console.error("Error processing vehicle return:", error);
        res.status(500).json({ message: "Error processing vehicle return" });
    }
};

// Get active bookings for a station
exports.getStationActiveBookings = async (req, res) => {
    try {
        const { stationId } = req.params;
        const bookings = await Booking.find({
            station: stationId,
            status: "active",
        })
            .populate("user", "name email phone drivingLicense")
            .populate("vehicle")
            .sort({ pickupTime: -1 });

        res.json(bookings);
    } catch (error) {
        console.error("Error fetching active bookings:", error);
        res.status(500).json({ message: "Error fetching active bookings" });
    }
};

// Get booking history for a station
exports.getStationBookingHistory = async (req, res) => {
    try {
        const { stationId } = req.params;
        const { startDate, endDate, status } = req.query;

        const query = { station: stationId };
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }
        if (status) {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate("user", "name email phone drivingLicense")
            .populate("vehicle")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        console.error("Error fetching booking history:", error);
        res.status(500).json({ message: "Error fetching booking history" });
    }
};

exports.findBookingByUserDetails = async (req, res) => {
    try {
        const { name, phoneNumber } = req.body;

        // Find active booking by user details
        const booking = await Booking.findOne({
            status: "active",
            "user.name": { $regex: new RegExp(name, "i") },
            "user.phone": phoneNumber,
        })
            .populate("user", "name email phone drivingLicense")
            .populate("vehicle", "make model numberPlate")
            .populate("station", "name location");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "No active booking found for the given user details",
            });
        }

        res.json({
            success: true,
            booking,
            pickupImages: booking.vehicleImages || [],
        });
    } catch (error) {
        console.error("Error finding booking by user details:", error);
        res.status(500).json({
            success: false,
            message: "Error finding booking",
        });
    }
};

// Verify QR code and get booking details
exports.verifyQRCode = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { qrCode } = req.body;

        // Find booking by QR code
        const booking = await Booking.findOne({
            qrCode,
            status: { $in: ["pending", "active"] },
        })
            .populate("user", "name email phone drivingLicense")
            .populate("vehicle", "make model numberPlate")
            .populate("station", "name location");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Invalid QR code or booking not found",
            });
        }

        res.json({
            success: true,
            booking,
            pickupImages: booking.vehicleImages || [],
        });
    } catch (error) {
        console.error("Error verifying QR code:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying QR code",
        });
    }
};

// Get booking details for return
exports.getBookingForReturn = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId)
            .populate("user", "name email phone drivingLicense")
            .populate("vehicle", "make model numberPlate")
            .populate("station", "name location");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        if (booking.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Booking is not active",
            });
        }

        res.json({
            success: true,
            booking,
            pickupImages: booking.vehicleImages || [],
        });
    } catch (error) {
        console.error("Error getting booking for return:", error);
        res.status(500).json({
            success: false,
            message: "Error getting booking details",
        });
    }
};
