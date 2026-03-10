const mongoose = require('mongoose');

const ConcernSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['health', 'safety', 'academic', 'behavior', 'other'],
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'escalated'],
    default: 'new',
  },
  visibility: {
    type: String,
    enum: ['standard', 'confidential', 'authority'],
    default: 'standard',
  },
  lastUpdateAt: {
    type: Date,
    default: Date.now,
  },
  resolutionSummary: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ConcernSchema.index({ parentId: 1, createdAt: -1 });

module.exports = mongoose.model('Concern', ConcernSchema);

