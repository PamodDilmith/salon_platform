const CustomerTicket = require('../models/CustomerTicket');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|pdf/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Images and PDFs only!'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Create a new customer ticket
// @route   POST /api/customers/tickets
// @access  Private (Customer)
const createTicket = async (req, res) => {
  try {
    const { topic, description } = req.body;
    
    if (!topic || !description) {
      return res.status(400).json({ message: 'Topic and description are required' });
    }

    let attachment = null;
    if (req.file) {
      attachment = `/uploads/${req.file.filename}`;
    }

    const ticket = await CustomerTicket.create({
      customer: req.customer._id,
      topic,
      description,
      attachment,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all tickets for logged in customer
// @route   GET /api/customers/tickets
// @access  Private (Customer)
const getTickets = async (req, res) => {
  try {
    const tickets = await CustomerTicket.find({ customer: req.customer._id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update a pending ticket
// @route   PUT /api/customers/tickets/:id
// @access  Private (Customer)
const updateTicket = async (req, res) => {
  try {
    const ticket = await CustomerTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Make sure the customer owns the ticket
    if (ticket.customer.toString() !== req.customer._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Only allow edit if Pending
    if (ticket.status !== 'Pending') {
      return res.status(400).json({ message: 'Can only edit pending tickets' });
    }

    const { topic, description } = req.body;
    
    if (topic) ticket.topic = topic;
    if (description) ticket.description = description;

    // Handle new attachment if uploaded
    if (req.file) {
      ticket.attachment = `/uploads/${req.file.filename}`;
    }

    const updatedTicket = await ticket.save();
    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a ticket
// @route   DELETE /api/customers/tickets/:id
// @access  Private (Customer)
const deleteTicket = async (req, res) => {
  try {
    const ticket = await CustomerTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.customer.toString() !== req.customer._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await CustomerTicket.deleteOne({ _id: req.params.id });
    res.json({ message: 'Ticket removed' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  upload,
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket,
};
