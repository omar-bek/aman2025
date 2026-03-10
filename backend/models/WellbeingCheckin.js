const mongoose = require('mongoose');

const WellbeingCheckinSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'tough'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

WellbeingCheckinSchema.index({ studentId: 1, createdAt: -1 });

module.exports = mongoose.model('WellbeingCheckin', WellbeingCheckinSchema);

