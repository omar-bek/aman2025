const mongoose = require('mongoose');

const TeacherMessageSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  senderRole: {
    type: String,
    enum: ['teacher', 'parent'],
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

TeacherMessageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for common queries
TeacherMessageSchema.index({ studentId: 1, createdAt: -1 });
TeacherMessageSchema.index({ teacherId: 1, createdAt: -1 });
TeacherMessageSchema.index({ parentId: 1, createdAt: -1 });

module.exports = mongoose.model('TeacherMessage', TeacherMessageSchema);

