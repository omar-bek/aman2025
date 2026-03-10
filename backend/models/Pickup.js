const mongoose = require('mongoose');

const PickupSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupDate: {
    type: Date,
    required: true
  },
  pickupTime: {
    type: String,
    required: true
  },
  authorizedPerson: {
    name: {
      type: String,
      required: true
    },
    relationship: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    idNumber: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  qrCode: String,
  verificationMethod: {
    type: String,
    enum: ['qr', 'nfc', 'bluetooth', 'manual']
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

PickupSchema.index({ studentId: 1, pickupDate: -1 });
PickupSchema.index({ requestedBy: 1, createdAt: -1 });
PickupSchema.index({ status: 1, pickupDate: -1 });

module.exports = mongoose.model('Pickup', PickupSchema);
