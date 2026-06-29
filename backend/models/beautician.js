const mongoose = require('mongoose');

const beauticianSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    profilePhotoUrl: {
      type: String, // Path to uploaded photo
    },
    nic: {
      type: String,
      required: [true, 'Please provide an NIC'],
      unique: true,
      match: [/^([0-9]{9}[vVxX]|[0-9]{12})$/, 'Please provide a valid Sri Lankan NIC'],
    },
    roleTitle: {
      type: String,
      required: [true, 'Please provide a Position/Role'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    specialties: [
      {
        type: String, // e.g., Makeup Artist, Hair Styling, Skincare
      },
    ],
    experienceYears: {
      type: Number,
      required: [true, 'Please add years of experience'],
    },
    location: {
      type: String,
      required: [true, 'Please specify location/city'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please add a contact number'],
    },
    certificationUrl: {
      type: String, // Verification certificate upload
    },
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

module.exports = mongoose.model('Beautician', beauticianSchema);
