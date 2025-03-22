const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const adminController = require("../controllers/admin");
const { isAuthenticated } = require("../middleware/auth");
const { isAdmin } = require("../middleware/adminAuth");

// Verify QR code and get booking details
router.post(
    "/verify-qr",
    [
        isAuthenticated,
        isAdmin,
        check("qrCode", "QR code is required").notEmpty(),
    ],
    adminController.verifyQRCode
);

// Handle vehicle pickup
router.post(
    "/pickup",
    [
        isAuthenticated,
        isAdmin,
        check("bookingId", "Booking ID is required").notEmpty(),
        check("vehicleImages", "Vehicle images are required").isArray(),
        check("notes", "Notes are required").notEmpty(),
    ],
    adminController.handleVehiclePickup
);

// Get booking details for return
router.get(
    "/booking/:bookingId/return",
    [isAuthenticated, isAdmin],
    adminController.getBookingForReturn
);

// Handle vehicle return
router.post(
    "/return",
    [
        isAuthenticated,
        isAdmin,
        check("bookingId", "Booking ID is required").notEmpty(),
        check("returnImages", "Return images are required").isArray(),
        check("damageReport", "Damage report is required").isObject(),
        check("notes", "Notes are required").notEmpty(),
    ],
    adminController.handleVehicleReturn
);

// Get active bookings for a station
router.get(
    "/station/:stationId/active",
    [isAuthenticated, isAdmin],
    adminController.getStationActiveBookings
);

// Get booking history for a station
router.get(
    "/station/:stationId/history",
    [isAuthenticated, isAdmin],
    adminController.getStationBookingHistory
);

// Find booking by user details
router.post(
    "/find-booking",
    [isAuthenticated, isAdmin],
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("phoneNumber").notEmpty().withMessage("Phone number is required"),
    ],
    adminController.findBookingByUserDetails
);

module.exports = router;
