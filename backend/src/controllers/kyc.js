// controllers/kyc.js
const axios = require('axios');
const User = require('../models/User'); // Assuming you have a User model

// Store OTP reference IDs temporarily (in production, use Redis or database)
const otpReferenceMap = new Map();

exports.generateOtp = async (req, res) => {
    try {
        const { aadharNumber } = req.body;
        
        // Validate Aadhaar number format
        if (!aadharNumber || aadharNumber.length !== 12 || !/^\d+$/.test(aadharNumber)) {
            return res.status(400).json({ message: 'Invalid Aadhaar number format' });
        }

        // Get user ID from authenticated request
        // If auth middleware isn't active yet, use a temporary ID for testing
        const userId = req.user ? req.user.id : 'temp-user-id';

        console.log('Attempting to generate OTP for Aadhaar:', aadharNumber);
        
        // Call Sandbox API to generate OTP
        // For testing, let's simulate a successful response
        // In production, uncomment the actual API call
        /*
        const response = await axios.post(
            'https://sandbox-api.com/aadhaar/okyc/generate-otp',
            {
                '@entity': 'in.co.sandbox.kyc.aadhaar.okyc.otp.request',
                aadhaar_number: aadharNumber,
                consent: 'y',
                reason: 'For KYC'
            },
            {
                headers: {
                    'x-api-version': '2.0',
                    'Content-Type': 'application/json'
                }
            }
        );
        */
        
        // Mock response for testing
        const mockResponse = {
            data: {
                reference_id: 'REF' + Math.floor(Math.random() * 1000000)
            }
        };

        // Store reference ID mapped to user
        const referenceId = mockResponse.data.reference_id;
        otpReferenceMap.set(userId, {
            referenceId,
            aadharNumber,
            timestamp: Date.now()
        });

        console.log('OTP generated, reference ID:', referenceId);

        return res.status(200).json({ 
            success: true, 
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Error generating OTP:', error);
        
        // Handle specific API errors
        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data.message || 'Failed to generate OTP'
            });
        }
        
        return res.status(500).json({ message: 'Server error while generating OTP' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        // If auth middleware isn't active yet, use a temporary ID for testing
        const userId = req.user ? req.user.id : 'temp-user-id';
        
        // Validate OTP format
        if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
            return res.status(400).json({ message: 'Invalid OTP format' });
        }

        // Get reference ID for this user
        const userOtpData = otpReferenceMap.get(userId);
        
        if (!userOtpData) {
            return res.status(400).json({ message: 'Please generate OTP first' });
        }

        // Check if OTP has expired (15 minutes validity)
        if (Date.now() - userOtpData.timestamp > 15 * 60 * 1000) {
            otpReferenceMap.delete(userId); // Clean up expired entry
            return res.status(400).json({ message: 'OTP has expired. Please generate a new one.' });
        }

        console.log('Verifying OTP:', otp, 'for reference ID:', userOtpData.referenceId);

        // Call Sandbox API to verify OTP
        // For testing, let's simulate a successful response
        // In production, uncomment the actual API call
        /*
        const response = await axios.post(
            'https://sandbox-api.com/aadhaar/okyc/verify-otp',
            {
                '@entity': 'in.co.sandbox.kyc.aadhaar.okyc.request',
                reference_id: userOtpData.referenceId,
                otp: otp
            },
            {
                headers: {
                    'x-api-version': '2.0',
                    'Content-Type': 'application/json'
                }
            }
        );
        */

        // For testing, consider any OTP as valid if it's 6 digits
        // In production, use actual API validation

        // Only update user in database if we have a real user ID (not our temp ID)
        if (req.user && req.user.id !== 'temp-user-id') {
            // Update user's KYC status in database
            await User.findByIdAndUpdate(userId, {
                isKycVerified: true,
                aadharNumber: userOtpData.aadharNumber,
                kycVerifiedAt: new Date()
            });
        }

        // Clean up after successful verification
        otpReferenceMap.delete(userId);

        console.log('OTP verified successfully');

        return res.status(200).json({
            success: true,
            message: 'Aadhaar verified successfully',
            data: {
                isKycVerified: true
            }
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);

        // Handle specific API errors
        if (error.response) {
            return res.status(error.response.status).json({
                message: error.response.data.message || 'Failed to verify OTP'
            });
        }
        
        return res.status(500).json({ message: 'Server error while verifying OTP' });
    }
};