const User = require("../models/User");
const {
    generateAadhaarOTP,
    verifyAadhaarOTP,
} = require("../utils/sandbox");

exports.submitKYC = async (req, res) => {
    try {
        const { drivingLicense } = req.body;
        const user = await User.findById(req.user.id);

        user.drivingLicense = {
            ...user.drivingLicense,
            ...drivingLicense,
            verified: false,
        };
        user.kycStatus = "PENDING";

        await user.save();

        res.json({
            success: true,
            message: "KYC submitted successfully",
            kycStatus: user.kycStatus,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.verifyKYC = async (req, res) => {
    try {
        const { userId, status } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.kycStatus = status;
        user.drivingLicense.verified = status === "VERIFIED";
        await user.save();

        res.json({
            success: true,
            message: "KYC status updated successfully",
            kycStatus: user.kycStatus,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Generate OTP for Aadhaar verification
exports.generateOTP = async (req, res) => {
    try {
        const { aadharNumber } = req.body;
        const userId = req.user.id;

        // Validate Aadhaar number
        if (!/^\d{12}$/.test(aadharNumber)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Aadhaar number. Must be 12 digits.",
            });
        }

        // Generate OTP using Sandbox API
        const response = await generateAadhaarOTP(aadharNumber);

        // Update user with reference ID
        const user = await User.findById(userId);
        user.kycData = {
            ...user.kycData,
            aadharNumber,
            referenceId: response.reference_id,
            kycStatus: "OTP_SENT",
        };
        await user.save();

        res.json({
            success: true,
            message: "OTP sent successfully",
            referenceId: response.reference_id,
        });
    } catch (error) {
        console.error("KYC Generate OTP Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to generate OTP",
        });
    }
};

// Verify OTP and complete KYC
exports.verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user.kycData?.referenceId) {
            return res.status(400).json({
                success: false,
                message: "No pending KYC verification found",
            });
        }

        // Verify OTP using Sandbox API
        const response = await verifyAadhaarOTP(user.kycData.referenceId, otp);

        // Update user KYC status based on verification result
        user.kycData = {
            ...user.kycData,
            kycStatus: response.status === "success" ? "VERIFIED" : "FAILED",
            verificationData: response,
            verifiedAt: response.status === "success" ? new Date() : null,
        };
        await user.save();

        res.json({
            success: true,
            message:
                response.status === "success"
                    ? "KYC verified successfully"
                    : "KYC verification failed",
            kycStatus: user.kycData.kycStatus,
        });
    } catch (error) {
        console.error("KYC Verify OTP Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to verify OTP",
        });
    }
};

// Upload KYC documents
exports.uploadDocuments = async (req, res) => {
    try {
        const userId = req.user.id;
        const { aadharImage, panImage, selfieImage } = req.files;

        if (!aadharImage || !panImage || !selfieImage) {
            return res.status(400).json({
                success: false,
                message: "All documents are required",
            });
        }

        const user = await User.findById(userId);
        if (user.kycData?.kycStatus !== "VERIFIED") {
            return res.status(400).json({
                success: false,
                message: "Aadhaar verification must be completed first",
            });
        }

        // Update user with document paths
        user.kycData = {
            ...user.kycData,
            documents: {
                aadharImage: aadharImage.path,
                panImage: panImage.path,
                selfieImage: selfieImage.path,
            },
            kycStatus: "DOCUMENTS_UPLOADED",
        };
        await user.save();

        res.json({
            success: true,
            message: "Documents uploaded successfully",
            kycStatus: user.kycData.kycStatus,
        });
    } catch (error) {
        console.error("KYC Upload Documents Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to upload documents",
        });
    }
};

// Get KYC status
exports.getKYCStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        res.json({
            success: true,
            kycStatus: user.kycData?.kycStatus || "NOT_STARTED",
            kycData: user.kycData,
        });
    } catch (error) {
        console.error("KYC Get Status Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get KYC status",
        });
    }
};