const Customer = require('../models/Customer');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Validations ---
// Validates Sri Lankan phone numbers (e.g. 0771234567, +94771234567, 94771234567)
const isValidSLPhone = (phone) => {
  const phoneRegex = /^(?:0|94|\+94)?(?:7\d|1\d|2\d|3\d|4\d|5\d|6\d|8\d|9\d)\d{7}$/;
  return phoneRegex.test(phone);
};

// Validates old (9 digits + V/X) or new (12 digits) Sri Lankan NIC
const isValidNIC = (nic) => {
  const nicRegex = /^([0-9]{9}[xXvV]|[0-9]{12})$/;
  return nicRegex.test(nic);
};

// Validates password: at least 8 characters, containing at least one letter and one number
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

// @desc    Register a new customer
// @route   POST /api/customers/register
// @access  Public
const registerCustomer = async (req, res) => {
  try {
    const { firstName, secondName, email, phone, nic, password, confirmPassword } = req.body;

    // Basic required fields check
    if (!firstName || !secondName || !email || !phone || !nic || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Format validations
    if (!isValidSLPhone(phone)) {
      return res.status(400).json({ message: 'Invalid Sri Lankan phone number format' });
    }

    if (!isValidNIC(nic)) {
      return res.status(400).json({ message: 'Invalid Sri Lankan NIC format' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and contain both letters and numbers' });
    }

    // Check if customer exists by email or nic
    const customerExists = await Customer.findOne({ $or: [{ email }, { nic }] });
    if (customerExists) {
      return res.status(400).json({ message: 'Customer with this email or NIC already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create customer
    const customer = await Customer.create({
      firstName,
      secondName,
      email,
      phone,
      nic,
      password: hashedPassword,
    });

    if (customer) {
      res.status(201).json({
        message: 'Customer registered successfully',
        _id: customer._id,
        firstName: customer.firstName,
        email: customer.email,
      });
    } else {
      res.status(400).json({ message: 'Invalid customer data received' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate customer & get token
// @route   POST /api/customers/login
// @access  Public
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for admin first
    const adminUser = await User.findOne({ email }).select('+password');
    if (adminUser && adminUser.role === 'admin' && (await adminUser.matchPassword(password))) {
      const token = jwt.sign(
        { id: adminUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      
      return res.json({
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        token
      });
    }

    // Check for customer
    const customer = await Customer.findOne({ email });

    if (customer && (await bcrypt.compare(password, customer.password))) {
      // Create JWT
      const token = jwt.sign(
        { id: customer._id, role: 'customer' },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        _id: customer._id,
        firstName: customer.firstName,
        secondName: customer.secondName,
        email: customer.email,
        phone: customer.phone,
        nic: customer.nic,
        token,
        role: 'customer'
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Middleware to protect customer routes
const protectCustomer = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.customer = await Customer.findById(decoded.id).select('-password');
      if (!req.customer) {
        return res.status(401).json({ message: 'Not authorized, customer not found' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// @desc    Get customer profile
// @route   GET /api/customers/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer._id).select('-password');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update customer profile (firstName, secondName, phone only)
// @route   PUT /api/customers/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { firstName, secondName, phone } = req.body;
    const customer = await Customer.findById(req.customer._id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (firstName) customer.firstName = firstName;
    if (secondName) customer.secondName = secondName;

    if (phone) {
      if (!isValidSLPhone(phone)) {
        return res.status(400).json({ message: 'Invalid Sri Lankan phone number format' });
      }
      customer.phone = phone;
    }

    const updatedCustomer = await customer.save();

    res.json({
      _id: updatedCustomer._id,
      firstName: updatedCustomer.firstName,
      secondName: updatedCustomer.secondName,
      email: updatedCustomer.email,
      phone: updatedCustomer.phone,
      nic: updatedCustomer.nic,
      role: 'customer'
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};

// @desc    Delete customer account
// @route   DELETE /api/customers/profile
// @access  Private
const deleteProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer._id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await Customer.findByIdAndDelete(req.customer._id);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete Profile Error:', error);
    res.status(500).json({ message: 'Server error during account deletion' });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  protectCustomer,
  getProfile,
  updateProfile,
  deleteProfile,
};

