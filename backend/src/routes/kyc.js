const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth.js');
const { submitKYC, verifyKYC } = require('../controllers/kyc.js');

router.post('/submit', submitKYC);
router.post('/verify' , verifyKYC);

// authorize('ADMIN') is not avialable 
// protect is not avialable

module.exports = router; 

