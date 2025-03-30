const express = require('express');
const router = express.Router();
const { 
  // adminDropoff, 
  adminDropoffConfirm } = require('../controllers/dropoffController');
const { upload } = require('../middleware/multer.middleware');

// Admin dropoff route
// router.post('/admin-dropoff', adminDropoff);

// Admin dropoff confirm route with file upload   
router.post('/admin-dropoff-confirm',
  upload.fields([{ name: 'abc', maxCount: 5 }]), // Changed to match pickup route
  adminDropoffConfirm
);
// License image endpoint
// router.get('/licenses/:licenseNumber', getLicenseImage);

module.exports = router; 

