const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
      refPath: 'vendorTypeModel',
    },
    vendorName: {
      type: String,
      required: true,
    },
    planName: {
      type: String,
      enum: ['Basic', 'Standard', 'Premium'],
      default: 'Standard',
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'unpaid', 'suspended'],
      default: 'active',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for dynamic refPath
subscriptionSchema.virtual('vendorTypeModel').get(function () {
  return this.vendorType === 'salon' ? 'Salon' : 'Beautician';
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
