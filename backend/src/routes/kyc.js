// routes/kyc.js
const express = require('express');
const router = express.Router();
const kyc = require('../controllers/kyc'); 

// Skip the auth middleware temporarily to test if that's the issue
router.post('/generate-otp', (req, res, next) => {
    console.log('Generate OTP route hit');
    kyc.generateOtp(req, res, next);
});

router.post('/verify-otp', (req, res, next) => {
    console.log('Verify OTP route hit');
    kyc.verifyOtp(req, res, next);
});

module.exports = router;