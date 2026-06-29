const express = require('express');
const router = express.Router();
const { getChatHistory, sendMessage, getChatContacts } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Get unique chat contacts
router.get('/contacts', protect, getChatContacts);

// Get chat history with a specific user
router.get('/:userId', protect, getChatHistory);

// Send a message
router.post('/', protect, sendMessage);

module.exports = router;
