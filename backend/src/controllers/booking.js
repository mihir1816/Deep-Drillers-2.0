const Contract = require("../models/Contract");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const {
    generateQRCode,
    generateUniqueQRString,
} = require("../utils/qrGenerator");
const QRCode = require("qrcode");
const { validationResult } = require("express-validator");

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { vehicleId, stationId, startTime, endTime, package } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!vehicleId || !stationId || !startTime || !endTime || !package) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Check if vehicle exists and is available
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        if (vehicle.status !== "AVAILABLE") {
            return res.status(400).json({
                success: false,
                message: "Vehicle is not available for booking",
            });
        }

        // Check if user has sufficient wallet balance
        const user = await User.findById(userId);
        if (user.wallet.balance < package.price) {
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance",
            });
        }

        // Generate QR code for the booking
        const qrString = generateUniqueQRString(user);
        const qrCode = await generateQRCode(qrString);

        // Update user's QR code
        user.qrCode = qrString;
        await user.save();

        // Create the contract
        const contract = await Contract.create({
            user: userId,
            vehicle: vehicleId,
            station: stationId,
            startTime,
            endTime,
            package,
            pickupQR: qrCode,
            returnQR: qrCode,
            qrExpiry: new Date(Date.now() + 20 * 60 * 1000), // 20 mins expiry
            totalAmount: package.price,
        });

        // Update vehicle status
        vehicle.status = "UNAVAILABLE";
        await vehicle.save();

        // Deduct amount from user's wallet
        user.wallet.balance -= package.price;
        user.wallet.transactions.push({
            type: "DEBIT",
            amount: package.price,
            description: `Booking payment for vehicle ${vehicle.numberPlate}`,
        });
        await user.save();

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: {
                contract,
                qrCode,
            },
        });
    } catch (error) {
        console.error("Booking creation error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating booking",
            error: error.message,
        });
    }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
    try {
        const contracts = await Contract.find({ user: req.user._id })
            .populate("vehicle", "numberPlate")
            .populate("station", "name location")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: contracts,
        });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching bookings",
            error: error.message,
        });
    }
};

// Get booking details by ID
exports.getBookingDetails = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id)
            .populate("vehicle", "numberPlate")
            .populate("station", "name location")
            .populate("user", "name email phone");

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Check if the user is authorized to view this booking
        if (
            contract.user._id.toString() !== req.user._id.toString() &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this booking",
            });
        }

        res.status(200).json({
            success: true,
            data: contract,
        });
    } catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching booking details",
            error: error.message,
        });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.id);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Check if the user is authorized to cancel this booking
        if (
            contract.user.toString() !== req.user._id.toString() &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this booking",
            });
        }

        // Check if booking can be cancelled
        if (contract.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Booking cannot be cancelled at this stage",
            });
        }

        // Refund the amount to user's wallet
        const user = await User.findById(contract.user);
        user.wallet.balance += contract.totalAmount;
        user.wallet.transactions.push({
            type: "CREDIT",
            amount: contract.totalAmount,
            description: `Refund for cancelled booking ${contract._id}`,
        });
        await user.save();

        // Update vehicle status
        const vehicle = await Vehicle.findById(contract.vehicle);
        vehicle.status = "AVAILABLE";
        await vehicle.save();

        // Update contract status
        contract.status = "CANCELLED";
        await contract.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            data: contract,
        });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({
            success: false,
            message: "Error cancelling booking",
            error: error.message,
        });
    }
};

// Verify QR code for pickup/return
exports.verifyQRCode = async (req, res) => {
    try {
        const { qrCode, type } = req.body; // type can be 'pickup' or 'return'
        const contract = await Contract.findOne({
            [type === "pickup" ? "pickupQR" : "returnQR"]: qrCode,
            qrExpiry: { $gt: new Date() },
        });

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: "Invalid or expired QR code",
            });
        }

        // Update contract status based on verification type
        if (type === "pickup") {
            contract.status = "ACTIVE";
        } else if (type === "return") {
            contract.status = "COMPLETED";
            contract.actualEndTime = new Date();
        }

        await contract.save();

        res.status(200).json({
            success: true,
            message: `QR code verified successfully for ${type}`,
            data: contract,
        });
    } catch (error) {
        console.error("Error verifying QR code:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying QR code",
            error: error.message,
        });
    }
};
