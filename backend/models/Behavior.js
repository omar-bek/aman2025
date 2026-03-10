const mongoose = require('mongoose');

const BehaviorSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  type: {
    type: String,
    enum: ['positive', 'negative'],
    required: true
  },
  category: {
    type: String,
    enum: ['respect', 'responsibility', 'safety', 'academic', 'social', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: String,
  witnesses: [String],
  actionTaken: String,
  parentNotified: {
    type: Boolean,
    default: false
  },
  parentNotifiedAt: Date,
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Behavior', BehaviorSchema);
