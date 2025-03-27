// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Create the Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Import routers
const kycRouter = require('./src/controllers/kyc');
const paymentRouter = require('./src/controllers/payment');

// Mount routers
app.use('/api/kyc', kycRouter);
app.use('/api/payments', paymentRouter);

// Add other routers as needed

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 