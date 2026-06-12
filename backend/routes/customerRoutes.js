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

const {
  upload,
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket,
} = require('../controllers/customerTicketController');

// Public routes
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);

// Protected routes (Profile)
router.get('/profile', protectCustomer, getProfile);
router.put('/profile', protectCustomer, updateProfile);
router.delete('/profile', protectCustomer, deleteProfile);

// Protected routes (Tickets)
router.route('/tickets')
  .post(protectCustomer, upload.single('attachment'), createTicket)
  .get(protectCustomer, getTickets);

router.route('/tickets/:id')
  .put(protectCustomer, upload.single('attachment'), updateTicket)
  .delete(protectCustomer, deleteTicket);

module.exports = router;
