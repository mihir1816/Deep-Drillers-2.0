const express = require('express');
const router = express.Router();
const { register, login , getMe } = require('../controllers/auth');
const { isAuthenticated } = require('../middleware/auth.js');

router.post('/register', register);
router.post('/login', login);
router.get('/currentuser', isAuthenticated, getMe);

module.exports = router; 