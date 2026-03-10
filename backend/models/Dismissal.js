const mongoose = require('mongoose');

const DismissalSchema = new mongoose.Schema({
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
  dismissalDate: {
    type: Date,
    required: true
  },
  dismissalTime: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending_teacher', 'pending_admin', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending_teacher'
  },
  teacherApproval: {
    approved: Boolean,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    notes: String
  },
  adminApproval: {
    approved: Boolean,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    notes: String
  },
  completedAt: Date,
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

DismissalSchema.index({ studentId: 1, dismissalDate: -1 });
DismissalSchema.index({ requestedBy: 1, createdAt: -1 });
DismissalSchema.index({ status: 1, dismissalDate: -1 });

module.exports = mongoose.model('Dismissal', DismissalSchema);
