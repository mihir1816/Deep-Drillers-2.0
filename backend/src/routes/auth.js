const express = require("express");
const router = express.Router();
const { register, login, getMe, verifyToken } = require("../controllers/auth");
const { isAuthenticated } = require("../middleware/auth.js");
const { check } = require("express-validator");
const { upload } = require("../middleware/multer.middleware.js");
const {
    sendVerificationEmail,
    verifyEmailCode
} = require("../controllers/emailService.js");

// Email verification routes
router.post("/send-email-verification", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        const result = await sendVerificationEmail(email);
        res.json(result);
    } catch (error) {
        console.error('Send verification error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to send verification email'
        });
    }
});

router.post("/verify-email", (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: 'Email and verification code are required'
            });
        }

        if (!/^\d{6}$/.test(code)) {
            return res.status(400).json({
                success: false,
                message: 'Verification code must be 6 digits'
            });
        }

        const result = verifyEmailCode(email, code);
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({
            success: false,
            message: 'Email verification failed'
        });
    }
});

router.post(
    "/register",
    upload.fields([{ name: 'drivingLicense', maxCount: 1 }]),
    register
);

router.post(
    "/login",
    [
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password is required").exists(),
    ],
    login
);

router.get("/currentuser", isAuthenticated, getMe);
router.get("/verify-token", verifyToken);

module.exports = router;
