const Review = require('../models/review');
const Beautician = require('../models/beautician');

// @desc    Get all reviews for a specific beautician
// @route   GET /api/reviews/beautician/:id
// @access  Public
const getBeauticianReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ vendorType: 'beautician', vendorId: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// @desc    Submit a new review for a beautician
// @route   POST /api/reviews/beautician/:id
// @access  Private (Customer)
const submitBeauticianReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const vendorId = req.params.id;

    // Validate beautician exists
    const beautician = await Beautician.findById(vendorId);
    if (!beautician) {
      return res.status(404).json({ message: 'Beautician not found' });
    }

    const review = await Review.create({
      user: req.user._id,
      userName: req.user.name || `${req.user.firstName} ${req.user.secondName}`.trim(),
      vendorType: 'beautician',
      vendorId,
      vendorName: beautician.name,
      rating: Number(rating),
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error submitting review' });
  }
};

module.exports = {
  getBeauticianReviews,
  submitBeauticianReview,
};
