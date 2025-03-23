// controllers/kycController.js
const axios = require('axios');

// Hardcoded credentials for Sandbox API
const API_KEY = 'key_live_hoI6ZA6xd4IJPXbsZthhnGoxECCMlym5';
const API_SECRET = 'secret_live_BL5H2kxZLKSa9yJ0vd9Np7u8aEMgaU4A';
const API_VERSION = '2.0';
const SANDBOX_API_URL = 'https://api.sandbox.co.in';

// Token management
let authToken = null;
let tokenExpiryTime = null;

// Store reference IDs temporarily (in production, you should store these in a database)
const referenceIdMap = new Map();

// Function to refresh the authentication token
const refreshAuthToken = async () => {
    try {
        const response = await axios.post(
            `${SANDBOX_API_URL}/api/v2/authenticate`,
            {},
            {
                headers: {
                    'x-api-key': API_KEY,
                    'x-api-secret': API_SECRET,
                    'x-api-version': API_VERSION
                }
            }
        );

        if (response.data && response.data.data && response.data.data.access_token) {
            authToken = response.data.data.access_token;
            
            // Calculate token expiry time (convert from seconds to milliseconds)
            // Subtract 5 minutes (300000 ms) to refresh before expiry
            const expiresIn = response.data.data.expires_in * 1000 - 300000;
            tokenExpiryTime = Date.now() + expiresIn;
            
            console.log('Authentication token refreshed successfully');
            return authToken;
        } else {
            throw new Error('Failed to obtain auth token from response');
        }
    } catch (error) {
        console.error('Error refreshing authentication token:', error);
        throw error;
    }
};

// Function to get a valid authentication token
const getAuthToken = async () => {
    // If token doesn't exist or is about to expire, refresh it
    if (!authToken || !tokenExpiryTime || Date.now() >= tokenExpiryTime) {
        return await refreshAuthToken();
    }
    return authToken;
};

exports.generateOTP = async (req, res) => {
    try {
        const { aadharNumber } = req.body;
        
        // Validate Aadhaar number
        if (!aadharNumber || aadharNumber.length !== 12 || !/^\d+$/.test(aadharNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Aadhaar number. Must be 12 digits.'
            });
        }

        // Get a valid authentication token
        const token = await getAuthToken();

        // Prepare request to Sandbox API
        const response = await axios.post(
            `${SANDBOX_API_URL}/api/v2/kyc/aadhaar/okyc/otp`, 
            {
                '@entity': 'in.co.sandbox.kyc.aadhaar.okyc.otp.request',
                aadhaar_number: aadharNumber,
                consent: 'y',
                reason: 'For KYC'
            },
            {
                headers: {
                    'Authorization': token,
                    'x-api-key': API_KEY,
                    'x-api-version': API_VERSION,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Store reference ID against user ID (in this case, we'll use a Map, but in production use a database)
        // Extract user ID from JWT token (in a real app)
        const userId = req.userId || 'default-user';
        
        // Save the reference ID for later verification
        if (response.data && response.data.data && response.data.data.reference_id) {
            referenceIdMap.set(userId, response.data.data.reference_id.toString());
        } else {
            throw new Error('Reference ID not found in API response');
        }

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            transactionId: response.data.transaction_id
        });
    } catch (error) {
        console.error('Error generating OTP:', error);
        
        // Handle authentication errors specifically
        if (error.response?.status === 401 || error.response?.data?.message?.includes('token')) {
            try {
                await refreshAuthToken();
                return res.status(503).json({
                    success: false,
                    message: 'Authentication refreshed, please try again',
                    error: 'temporary_auth_error'
                });
            } catch (authError) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to authenticate with Sandbox API',
                    error: authError.message
                });
            }
        }
        
        return res.status(error.response?.status || 500).json({
            success: false,
            message: error.response?.data?.message || 'Failed to generate OTP',
            error: error.message
        });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        
        // Validate OTP
        if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP. Must be 6 digits.'
            });
        }

        // Get user ID and retrieve reference ID
        const userId = req.userId || 'default-user';
        const referenceId = referenceIdMap.get(userId);
        
        if (!referenceId) {
            return res.status(400).json({
                success: false,
                message: 'No active OTP request found. Please generate OTP first.'
            });
        }

        // Get a valid authentication token
        const token = await getAuthToken();

        // Prepare request to Sandbox API
        const response = await axios.post(
            `${SANDBOX_API_URL}/api/v2/kyc/aadhaar/okyc/verify`, 
            {
                '@entity': 'in.co.sandbox.kyc.aadhaar.okyc.request',
                reference_id: referenceId,
                otp: otp
            },
            {
                headers: {
                    'Authorization': token,
                    'x-api-key': API_KEY,
                    'x-api-version': API_VERSION,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Check the verification status
        if (response.data && response.data.data && response.data.data.status === 'valid') {
            // Clear the reference ID after successful verification
            referenceIdMap.delete(userId);
            
            // Extract profile details if available
            const profileData = response.data.data.profile_data || {};
            
            return res.status(200).json({
                success: true,
                message: 'Aadhaar verification successful',
                data: {
                    status: 'verified',
                    aadhaarNumber: response.data.data.aadhaar_number || 'XXXX-XXXX-XXXX',
                    name: profileData.name || '',
                    dob: profileData.dob || '',
                    gender: profileData.gender || '',
                    address: profileData.address || ''
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'OTP verification failed',
                data: {
                    status: 'failed'
                }
            });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        
        // Handle authentication errors specifically
        if (error.response?.status === 401 || error.response?.data?.message?.includes('token')) {
            try {
                await refreshAuthToken();
                return res.status(503).json({
                    success: false,
                    message: 'Authentication refreshed, please try again',
                    error: 'temporary_auth_error'
                });
            } catch (authError) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to authenticate with Sandbox API',
                    error: authError.message
                });
            }
        }
        
        return res.status(error.response?.status || 500).json({
            success: false,
            message: error.response?.data?.message || 'Failed to verify OTP',
            error: error.message
        });
    }
};

// Directly expose the token refresh function for manual use if needed
exports.refreshAuthToken = refreshAuthToken;

// Add a health check endpoint to test if the auth is working
exports.checkAuthStatus = async (req, res) => {
    try {
        const token = await getAuthToken();
        return res.status(200).json({
            success: true,
            message: 'Authentication token is valid',
            tokenExpiresIn: Math.floor((tokenExpiryTime - Date.now()) / 1000) // seconds remaining
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to authenticate with Sandbox API',
            error: error.message
        });
    }
};