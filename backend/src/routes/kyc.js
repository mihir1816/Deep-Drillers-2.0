const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { submitKYC, verifyKYC } = require('../controllers/kyc');

router.post('/submit', protect, submitKYC);
router.post('/verify', protect, authorize('ADMIN'), verifyKYC);

module.exports = router; 