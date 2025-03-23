const express = require("express");
const router = express.Router();
const {
    submitKYC,
    verifyKYC,
    generateOTP,
    verifyOTP,
    uploadDocuments,
    getKYCStatus,
} = require("../controllers/kycController");

// KYC Submission
router.post("/submit", submitKYC);

// KYC Verification
router.post("/verify", verifyKYC);

// Generate OTP for Aadhaar
router.post("/generate-otp", generateOTP);

// Verify OTP
router.post("/verify-otp", verifyOTP);

// Upload Documents
router.post("/upload-documents", uploadDocuments);

// Get KYC Status
router.get("/status", getKYCStatus);

module.exports = router;
