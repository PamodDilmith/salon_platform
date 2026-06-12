const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    senderRole: {
      type: String,
      required: true,
      enum: ['customer', 'admin'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const customerTicketSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    topic: {
      type: String,
      required: [true, 'Please add a topic'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    attachment: {
      type: String, // URL/path to the uploaded file
      default: null,
    },
    status: {
      type: String,
      enum: ['Pending', 'Resolved'],
      default: 'Pending',
    },
    replies: [replySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CustomerTicket', customerTicketSchema);
