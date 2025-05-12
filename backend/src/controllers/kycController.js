const axios = require('axios');

const API_KEY = process.env.SANDBOX_API_KEY || 'key_live_xCNyaaRfHvW8pt3MpcAzdMIezVqW2Y13';
const API_SECRET = process.env.SANDBOX_API_SECRET || 'secret_live_JMWQFAMkY8hWvz0lBTscd4IHmJ6rZITn';
const BASE_URL = 'https://api.sandbox.co.in';
const API_VERSION = '2.0';

const getAccessToken = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/authenticate`, {}, {
      headers: {
        accept: 'application/json',
        'x-api-key': API_KEY,
        'x-api-secret': API_SECRET,
        'x-api-version': API_VERSION
      }
    });
    return res.data.access_token;
  } catch (err) {
    console.error('Access Token Error:', err);
    throw new Error('Failed to get access token');
  }
};

const getHeaders = (token) => ({
  accept: 'application/json',
  authorization: token,
  'x-api-key': API_KEY,
  'x-api-version': API_VERSION,
  'content-type': 'application/json'
});

const requestAadhaarOtp = async (req, res) => {
  const { aadhaar_number } = req.body;
  if (!/^\d{12}$/.test(aadhaar_number)) {
    return res.status(400).json({ error: 'Invalid Aadhaar number' });
  }

  try {
    const token = await getAccessToken();
    const { data } = await axios.post(`${BASE_URL}/kyc/aadhaar/okyc/otp`, {
      '@entity': 'in.co.sandbox.kyc.aadhaar.okyc.otp.request',
      aadhaar_number,
      consent: 'y',
      reason: 'For KYC Verification'
    }, {
      headers: getHeaders(token)
    });

    res.status(200).json({
      message: 'OTP sent successfully',
      reference_id: data.reference_id
    });
  } catch (err) {
    console.error('OTP Request Error:', err);
    res.status(500).json({
      error: 'Failed to request Aadhaar OTP',
      details: err.response?.data || err.message
    });
  }
};

const verifyAadhaarOtp = async (req, res) => {
  const { reference_id, otp } = req.body;
  if (!reference_id || !otp) {
    return res.status(400).json({ error: 'Reference ID and OTP are required' });
  }

  try {
    const token = await getAccessToken();
    const { data } = await axios.post(`${BASE_URL}/kyc/aadhaar/okyc/otp/verify`, {
      '@entity': 'in.co.sandbox.kyc.aadhaar.okyc.request',
      reference_id,
      otp
    }, {
      headers: getHeaders(token)
    });

    const success = data.status === 'success';
    res.status(success ? 200 : 400).json({
      message: success ? 'Aadhaar verification successful' : 'Verification failed',
      details: data
    });
  } catch (err) {
    console.error('OTP Verification Error:', err);
    res.status(500).json({
      error: 'Failed to verify Aadhaar OTP',
      details: err.response?.data || err.message
    });
  }
};

module.exports = {
  requestAadhaarOtp,
  verifyAadhaarOtp
};