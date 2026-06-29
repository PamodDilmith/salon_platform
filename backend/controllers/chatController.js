const Message = require('../models/message');
const User = require('../models/user');
const mongoose = require('mongoose');

// @desc    Get chat history between logged in user and another user
// @route   GET /api/chat/:userId
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Use a compound $and+$or query: find messages where BOTH users are involved
    // This avoids any ObjectId casting direction issues
    const messages = await Message.find({
      $and: [
        {
          $or: [
            { sender: currentUserId },
            { receiver: currentUserId }
          ]
        },
        {
          $or: [
            { sender: userId },
            { receiver: userId }
          ]
        }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('getChatHistory error:', error);
    res.status(500).json({ message: 'Error fetching chat history', detail: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver ID and content are required' });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
};

// @desc    Get a list of unique users the current user has chatted with
// @route   GET /api/chat/contacts
// @access  Private
const getChatContacts = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find all messages where the user is either sender or receiver
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }]
    }).sort({ createdAt: -1 }); // Newest first

    // Extract unique contact IDs and their latest message
    const contactsMap = new Map();
    
    messages.forEach(msg => {
      const isSender = msg.sender.toString() === currentUserId.toString();
      const contactId = isSender ? msg.receiver.toString() : msg.sender.toString();
      
      if (!contactsMap.has(contactId)) {
        contactsMap.set(contactId, {
          contactId,
          latestMessage: msg.content,
          latestMessageAt: msg.createdAt,
          isSender
        });
      }
    });

    const contactIds = Array.from(contactsMap.keys());
    
    // Fetch user details for these contacts from User collection
    const users = await User.find({ _id: { $in: contactIds } }).select('name email role');
    
    // Fetch from Customer collection
    const Customer = require('../models/Customer');
    const customers = await Customer.find({ _id: { $in: contactIds } }).select('firstName secondName email');
    
    const allContacts = [];
    users.forEach(u => allContacts.push({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role || 'user'
    }));
    customers.forEach(c => allContacts.push({
      _id: c._id,
      name: `${c.firstName} ${c.secondName}`.trim(),
      email: c.email,
      role: 'customer'
    }));
    
    const contacts = allContacts
      .filter(user => user._id.toString() !== currentUserId.toString())
      .map(user => {
        const contactInfo = contactsMap.get(user._id.toString());
        if (!contactInfo) return null;
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          latestMessage: contactInfo.latestMessage,
          latestMessageAt: contactInfo.latestMessageAt,
        };
      })
      .filter(Boolean);

    // Sort contacts by latest message time
    contacts.sort((a, b) => new Date(b.latestMessageAt) - new Date(a.latestMessageAt));

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat contacts' });
  }
};

module.exports = {
  getChatHistory,
  sendMessage,
  getChatContacts
};
