const express = require('express');
const router = express.Router();
const { getBeauticianReviews, submitBeauticianReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Get reviews for a beautician
router.get('/beautician/:id', getBeauticianReviews);

// Submit a review for a beautician (Protected)
router.post('/beautician/:id', protect, submitBeauticianReview);

module.exports = router;
