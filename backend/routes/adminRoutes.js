const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  loginAdmin,
  getAdminProfile,
  getDashboardStats,
  getPendingRegistrations,
  updateRegistrationStatus,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubscriptions,
  suspendVendorProfile,
  getTickets,
  getTicketById,
  replyToTicket,
  updateTicketStatus,
  getReviews,
  deleteReview,
} = require('../controllers/adminController');

// Public route
router.post('/login', loginAdmin);

// Customer Management & Support (Unprotected for testing)
const {
  getAllCustomers,
  getAllCustomerTickets,
  replyToCustomerTicket,
  deleteCustomerTicket,
} = require('../controllers/adminCustomerController');

router.get('/customers', getAllCustomers);
router.get('/customer-tickets', getAllCustomerTickets);
router.post('/customer-tickets/:id/reply', replyToCustomerTicket);
router.delete('/customer-tickets/:id', deleteCustomerTicket);

// Private Admin routes (All protected by protect and admin middleware)
router.use(protect, admin);

router.get('/profile', getAdminProfile);
router.get('/dashboard/stats', getDashboardStats);

// Registrations
router.get('/registrations', getPendingRegistrations);
router.put('/registrations/:type/:id', updateRegistrationStatus);

// Categories
router.route('/categories')
  .get(getCategories)
  .post(createCategory);
router.route('/categories/:id')
  .put(updateCategory)
  .delete(deleteCategory);

// Subscriptions & Suspension
router.get('/subscriptions', getSubscriptions);
router.put('/subscriptions/suspend/:type/:id', suspendVendorProfile);

// Support tickets
router.get('/tickets', getTickets);
router.route('/tickets/:id')
  .get(getTicketById)
  .post(replyToTicket);
router.put('/tickets/:id/status', updateTicketStatus);

// Reviews
router.get('/reviews', getReviews);
router.delete('/reviews/:id', deleteReview);

module.exports = router;
