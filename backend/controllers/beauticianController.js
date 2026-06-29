const User = require('../models/user');
const Beautician = require('../models/beautician');
const Subscription = require('../models/subscription');
const Review = require('../models/review');
const Message = require('../models/message');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new beautician
// @route   POST /api/beauticians/register
// @access  Public
const registerBeautician = async (req, res) => {
  try {
    const { 
      name, email, password, phoneNumber, 
      location, nic, roleTitle, 
      experienceYears, specialties, description 
    } = req.body;

    const profilePhotoUrl = req.file ? `/uploads/${req.file.filename}` : '';

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check if NIC exists
    let existingBeautician = await Beautician.findOne({ nic });
    if (existingBeautician) {
      return res.status(400).json({ message: 'NIC already in use' });
    }

    // Create User
    user = await User.create({
      name,
      email,
      password,
      role: 'beautician',
      phoneNumber,
    });

    // Create Beautician profile
    const beautician = await Beautician.create({
      user: user._id,
      name,
      nic,
      profilePhotoUrl,
      roleTitle,
      description: description || 'New Beautician Profile',
      specialties: specialties ? specialties.split(',') : [],
      experienceYears: parseInt(experienceYears, 10) || 0,
      location,
      phoneNumber,
      status: 'pending',
      subscriptionStatus: 'active', // Trial is active
    });

    // Create Trial Subscription
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7 days trial
    await Subscription.create({
      owner: user._id,
      vendorType: 'beautician',
      vendorId: beautician._id,
      vendorName: beautician.name,
      planName: 'Basic', // Trial basically
      price: 0,
      status: 'active',
      startDate: new Date(),
      endDate,
    });

    res.status(201).json({
      message: 'Registration successful! Please wait for admin approval.',
      beautician
    });

  } catch (error) {
    console.error('Beautician Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Get all approved beauticians
// @route   GET /api/beauticians
// @access  Public
const getApprovedBeauticians = async (req, res) => {
  try {
    const beauticians = await Beautician.find({ status: 'approved' }).populate('user', 'email');
    res.json(beauticians);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get beautician by ID
// @route   GET /api/beauticians/:id
// @access  Public
const getBeauticianById = async (req, res) => {
  try {
    const beautician = await Beautician.findById(req.params.id).populate('user', 'email');
    if (!beautician) {
      return res.status(404).json({ message: 'Beautician not found' });
    }
    
    const reviews = await Review.find({ vendorType: 'beautician', vendorId: beautician._id });
    const avgRating = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : 0;
    
    res.json({
      ...beautician.toObject(),
      rating: avgRating,
      reviewCount: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get beautician profile (for logged in beautician)
// @route   GET /api/beauticians/profile/me
// @access  Private (Beautician)
const getBeauticianProfile = async (req, res) => {
  try {
    const beautician = await Beautician.findOne({ user: req.user._id }).populate('user', 'email');
    if (!beautician) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Calculate stats
    const reviews = await Review.find({ vendorType: 'beautician', vendorId: beautician._id });
    const avgRating = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : 0;
    
    // Count unique chats
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    });
    const uniqueContacts = new Set();
    messages.forEach(msg => {
      uniqueContacts.add(msg.sender.toString());
      uniqueContacts.add(msg.receiver.toString());
    });
    uniqueContacts.delete(req.user._id.toString());
    
    res.json({
      ...beautician.toObject(),
      rating: avgRating,
      chatsCount: uniqueContacts.size
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update beautician profile
// @route   PUT /api/beauticians/profile/me
// @access  Private (Beautician)
const updateBeauticianProfile = async (req, res) => {
  try {
    const beautician = await Beautician.findOneAndUpdate(
      { user: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!beautician) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(beautician);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to protect beautician routes
const protectBeautician = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user || user.role !== 'beautician') {
        return res.status(401).json({ message: 'Not authorized as a beautician' });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = {
  registerBeautician,
  getApprovedBeauticians,
  getBeauticianById,
  getBeauticianProfile,
  updateBeauticianProfile,
  protectBeautician,
};
