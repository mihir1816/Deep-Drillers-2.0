// routes/kycRoutes.js
const express = require('express');
const router = express.Router();
const kyc = require('../controllers/kyc');
const authMiddleware = require('../middleware/auth'); // Assuming you have an auth middleware

// Apply authentication middleware to all KYC routes
router.use(authMiddleware);

// Route for generating OTP
router.post('/generate-otp', kyc.generateOtp);

// Route for verifying OTP
router.post('/verify-otp', kyc.verifyOtp);

module.exports = router;