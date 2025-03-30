const express = require('express');
const router = express.Router();
const { adminPickup, adminPickupConfirm } = require('../controllers/pickupController');
const { upload } = require('../middleware/multer.middleware');

// Route for admin pickup

router.post('/admin-pickup', adminPickup);

// Route for admin pickup confirmation with file upload
router.post(
  '/admin-pickup-confirm',
  upload.fields([{ name: 'abc', maxCount: 5 }]), // Ensure the correct field name
  (req, res, next) => {
    console.log("Headers:", req.headers);
    console.log("Content-Type:", req.headers['content-type']);
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    next();
  },
  adminPickupConfirm
);

module.exports = router;


