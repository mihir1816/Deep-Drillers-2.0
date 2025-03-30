const express = require('express');
const router = express.Router();
const { getUserById } = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

// Route to get user by ID
router.get('/:id', getUserById);

module.exports = router; 