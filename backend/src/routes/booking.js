const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const {
    createBooking,
    getUserBookings,
    getBookingDetails,
    cancelBooking,
    verifyQRCode,
} = require("../controllers/booking");

// All routes are protected and require authentication
router.use(isAuthenticated);

// Create a new booking
router.post("/", createBooking);

// Get user's bookings
router.get("/my-bookings", getUserBookings);

// Get booking details by ID
router.get("/:id", getBookingDetails);

// Cancel booking
router.post("/:id/cancel", cancelBooking);

// Verify QR code for pickup/return
router.post("/verify-qr", verifyQRCode);

module.exports = router;
