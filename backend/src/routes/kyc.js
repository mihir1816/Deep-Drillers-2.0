// routes/kycRoutes.js
const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kycController');

// KYC routes
router.post('/generate-otp', kycController.requestAadhaarOtp);
router.post('/verify-otp', kycController.verifyAadhaarOtp);

module.exports = router;