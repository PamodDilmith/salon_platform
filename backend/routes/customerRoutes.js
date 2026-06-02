const express = require('express');
const router = express.Router();
const {
  registerCustomer,
  loginCustomer,
  protectCustomer,
  getProfile,
  updateProfile,
  deleteProfile,
} = require('../controllers/customerAuthController');

// Public routes
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);

// Protected routes
router.get('/profile', protectCustomer, getProfile);
router.put('/profile', protectCustomer, updateProfile);
router.delete('/profile', protectCustomer, deleteProfile);

module.exports = router;
