const express = require("express");
const router = express.Router();
const { register, login, getMe, verifyToken } = require("../controllers/auth");
const { isAuthenticated } = require("../middleware/auth.js");
const { check } = require("express-validator");
const multer = require("multer");
const path = require("path");

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/licenses");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb("Error: Images Only!");
        }
    },
});

// Register route with file upload
router.post(
    "/register",
    upload.single("licenseImage"),
    [
        check("name", "Name is required").notEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("phone", "Phone number is required").notEmpty(),
        check("password", "Password must be at least 6 characters").isLength({
            min: 6,
        }),
        check(
            "drivingLicenseNumber",
            "Driving license number is required"
        ).notEmpty(),
    ],
    register
);

// Login route
router.post(
    "/login",
    [
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password is required").exists(),
    ],
    login
);

router.get("/currentuser", isAuthenticated, getMe);

// Verify token route
router.get("/verify-token", verifyToken);

module.exports = router;
