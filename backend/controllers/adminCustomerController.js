const Customer = require('../models/Customer');
const CustomerTicket = require('../models/CustomerTicket');

// @desc    Get all registered customers
// @route   GET /api/admin/customers
// @access  Private/Admin
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({}).select('-password').sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all customer tickets
// @route   GET /api/admin/customer-tickets
// @access  Private/Admin
const getAllCustomerTickets = async (req, res) => {
  try {
    const tickets = await CustomerTicket.find({})
      .populate('customer', 'firstName secondName email phone nic')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Reply to customer ticket (and resolve it)
// @route   POST /api/admin/customer-tickets/:id/reply
// @access  Private/Admin
const replyToCustomerTicket = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Reply message is required' });
    }

    const ticket = await CustomerTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.status === 'Resolved') {
      return res.status(400).json({ message: 'Ticket is already resolved' });
    }

    const reply = {
      message,
      senderRole: 'admin',
    };

    ticket.replies.push(reply);
    ticket.status = 'Resolved';

    await ticket.save();

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete a resolved customer ticket
// @route   DELETE /api/admin/customer-tickets/:id
// @access  Private/Admin
const deleteCustomerTicket = async (req, res) => {
  try {
    const ticket = await CustomerTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.status !== 'Resolved') {
      return res.status(400).json({ message: 'Cannot delete an unresolved ticket' });
    }

    await CustomerTicket.deleteOne({ _id: req.params.id });
    res.json({ message: 'Ticket removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  getAllCustomers,
  getAllCustomerTickets,
  replyToCustomerTicket,
  deleteCustomerTicket,
};
