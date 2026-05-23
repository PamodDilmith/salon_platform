const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a salon name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a salon description'],
    },
    address: {
      type: String,
      required: [true, 'Please add a salon address'],
    },
    location: {
      type: String,
      required: [true, 'Please add a salon location (city/town)'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add a contact number'],
    },
    images: [
      {
        type: String,
      },
    ],
    categories: [
      {
        type: String, // e.g., Haircut, Nails, Bridal, Spa
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'unpaid', 'suspended'],
      default: 'active',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Salon', salonSchema);
