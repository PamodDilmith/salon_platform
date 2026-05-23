const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    vendorType: {
      type: String,
      enum: ['salon', 'beautician'],
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating (1-5)'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
    },
    reply: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);
