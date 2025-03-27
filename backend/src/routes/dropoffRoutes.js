const express = require('express');
const router = express.Router();
const { adminDropoff, adminDropoffConfirm, getLicenseImage } = require('../controllers/dropoffController');
const { upload } = require('../middleware/multer.middleware');

// Admin dropoff route
router.post('/admin-dropoff', adminDropoff);

// Admin dropoff confirm route with file upload   
router.post('/admin-dropoff-confirm', upload.fields([
    { name: 'file1', maxCount: 5 },
    { name: 'bookingId' }
  ]) , adminDropoffConfirm);

// License image endpoint
// router.get('/licenses/:licenseNumber', getLicenseImage);

module.exports = router; 

