const express = require('express');
const router = express.Router();
const path = require('path');
// Import paypal service with an absolute path to avoid path issues
const paypal = require(path.join(__dirname, '../../../frontend/paypal/services/paypal'));

// Create a new PayPal order
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required"
      });
    }

    console.log(`Payment controller: Creating order for amount ${amount}`);
    
    // Create PayPal order
    const approvalUrl = await paypal.createOrder(amount);
    
    if (!approvalUrl) {
      throw new Error('Failed to get PayPal approval URL');
    }
    
    return res.status(200).json({
      success: true,
      data: { approvalUrl }
    });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    // Include more details in the error response
    return res.status(500).json({
      success: false,
      message: "Failed to create PayPal order",
      error: error.message || 'Unknown error'
    });
  }
});

// Capture a payment after approval
router.post('/capture-payment', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required"
      });
    }
    
    console.log(`Payment controller: Capturing payment for order ${orderId}`);
    
    const captureData = await paypal.capturePayment(orderId);
    
    if (!captureData) {
      throw new Error('Failed to capture PayPal payment');
    }
    
    return res.status(200).json({
      success: true,
      data: captureData
    });
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to capture PayPal payment",
      error: error.message || 'Unknown error'
    });
  }
});

module.exports = router; 