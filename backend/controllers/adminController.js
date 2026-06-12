const User = require('../models/user');
const Salon = require('../models/salon');
const Beautician = require('../models/beautician');
const Category = require('../models/category');
const SupportTicket = require('../models/supportTicket');
const CustomerTicket = require('../models/CustomerTicket');
const Subscription = require('../models/subscription');
const Review = require('../models/review');
const jwt = require('jsonwebtoken');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Auth admin & get token
 * @route   POST /api/admin/login
 * @access  Public
 */
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && user.role === 'admin' && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get admin profile
 * @route   GET /api/admin/profile
 * @access  Private/Admin
 */
const getAdminProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get dashboard metrics
 * @route   GET /api/admin/dashboard/stats
 * @access  Private/Admin
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalSalons = await Salon.countDocuments();
    const totalBeauticians = await Beautician.countDocuments();
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
    const openSupportTickets = await SupportTicket.countDocuments({ status: { $ne: 'resolved' } });
    const openCustomerTickets = await CustomerTicket.countDocuments({ status: 'Pending' });
    const openTickets = openSupportTickets + openCustomerTickets;
    const totalReviews = await Review.countDocuments();

    const pendingSalons = await Salon.countDocuments({ status: 'pending' });
    const pendingBeauticians = await Beautician.countDocuments({ status: 'pending' });

    res.json({
      metrics: {
        totalUsers,
        totalSalons,
        totalBeauticians,
        activeSubscriptions,
        openTickets,
        totalReviews,
      },
      pendingRequests: pendingSalons + pendingBeauticians,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get pending registrations (Salons and Beauticians)
 * @route   GET /api/admin/registrations
 * @access  Private/Admin
 */
const getPendingRegistrations = async (req, res) => {
  try {
    const salons = await Salon.find({ status: 'pending' }).populate('owner', 'name email');
    const beauticians = await Beautician.find({ status: 'pending' }).populate('user', 'name email');

    res.json({ salons, beauticians });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Approve/Reject Salon or Beautician registration
 * @route   PUT /api/admin/registrations/:type/:id
 * @access  Private/Admin
 */
const updateRegistrationStatus = async (req, res) => {
  const { type, id } = req.params; // type: 'salon' or 'beautician'
  const { status, rejectionReason } = req.body; // status: 'approved' or 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status update' });
  }

  try {
    if (type === 'salon') {
      const salon = await Salon.findById(id);
      if (!salon) return res.status(404).json({ message: 'Salon not found' });

      salon.status = status;
      if (status === 'rejected' && rejectionReason) {
        salon.rejectionReason = rejectionReason;
      }
      await salon.save();
      return res.json({ message: `Salon registration ${status}`, data: salon });
    } else if (type === 'beautician') {
      const beautician = await Beautician.findById(id);
      if (!beautician) return res.status(404).json({ message: 'Beautician not found' });

      beautician.status = status;
      if (status === 'rejected' && rejectionReason) {
        beautician.rejectionReason = rejectionReason;
      }
      await beautician.save();
      return res.json({ message: `Beautician registration ${status}`, data: beautician });
    } else {
      return res.status(400).json({ message: 'Invalid registration type' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all categories and locations
 * @route   GET /api/admin/categories
 * @access  Private/Admin
 */
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create a category or location
 * @route   POST /api/admin/categories
 * @access  Private/Admin
 */
const createCategory = async (req, res) => {
  const { name, type, description } = req.body;

  if (!name || !type) {
    return res.status(400).json({ message: 'Please provide name and type' });
  }

  try {
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category or Location already exists' });
    }

    const category = await Category.create({ name, type, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update category or location
 * @route   PUT /api/admin/categories/:id
 * @access  Private/Admin
 */
const updateCategory = async (req, res) => {
  const { name, type, description } = req.body;

  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category/Location not found' });
    }

    category.name = name || category.name;
    category.type = type || category.type;
    category.description = description || category.description;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete category or location
 * @route   DELETE /api/admin/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category/Location not found' });
    }

    await category.deleteOne();
    res.json({ message: 'Category or Location removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get subscriptions
 * @route   GET /api/admin/subscriptions
 * @access  Private/Admin
 */
const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate('owner', 'name email');
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Suspend vendor profile due to payment status
 * @route   PUT /api/admin/subscriptions/suspend/:type/:id
 * @access  Private/Admin
 */
const suspendVendorProfile = async (req, res) => {
  const { type, id } = req.params; // type: 'salon' or 'beautician', id: vendorId

  try {
    let vendor;
    if (type === 'salon') {
      vendor = await Salon.findById(id);
      if (!vendor) return res.status(404).json({ message: 'Salon profile not found' });

      vendor.subscriptionStatus = 'suspended';
      await vendor.save();

      // Suspend all matching subscriptions for safety
      await Subscription.updateMany({ vendorId: id }, { status: 'suspended' });

      return res.json({ message: 'Salon profile suspended successfully', data: vendor });
    } else if (type === 'beautician') {
      vendor = await Beautician.findById(id);
      if (!vendor) return res.status(404).json({ message: 'Beautician profile not found' });

      vendor.subscriptionStatus = 'suspended';
      await vendor.save();

      // Suspend all matching subscriptions for safety
      await Subscription.updateMany({ vendorId: id }, { status: 'suspended' });

      return res.json({ message: 'Beautician profile suspended successfully', data: vendor });
    } else {
      return res.status(400).json({ message: 'Invalid vendor type' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all customer support tickets
 * @route   GET /api/admin/tickets
 * @access  Private/Admin
 */
const getTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find().populate('user', 'name email role');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get support ticket by ID
 * @route   GET /api/admin/tickets/:id
 * @access  Private/Admin
 */
const getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('messages.sender', 'name email role');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Reply to a support ticket
 * @route   POST /api/admin/tickets/:id/reply
 * @access  Private/Admin
 */
const replyToTicket = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Please add message content' });
  }

  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.messages.push({
      sender: req.user._id,
      senderRole: 'admin',
      message: message,
      timestamp: new Date(),
    });

    // Automatically move to in_progress if replying
    if (ticket.status === 'open') {
      ticket.status = 'in_progress';
    }

    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update support ticket status
 * @route   PUT /api/admin/tickets/:id/status
 * @access  Private/Admin
 */
const updateTicketStatus = async (req, res) => {
  const { status } = req.body;

  if (!['open', 'in_progress', 'resolved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid ticket status' });
  }

  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = status;
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all reviews
 * @route   GET /api/admin/reviews
 * @access  Private/Admin
 */
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'name email');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete/Moderate a review
 * @route   DELETE /api/admin/reviews/:id
 * @access  Private/Admin
 */
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.deleteOne();
    res.json({ message: 'Review successfully removed by admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
