const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['school_entry', 'school_exit', 'bus_boarding', 'bus_alighting', 'home_arrival'],
    required: true
  },
  location: {
    type: String,
    enum: ['school', 'bus', 'home'],
    required: true
  },
  method: {
    type: String,
    enum: ['rfid', 'smartwatch', 'manual', 'qr'],
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
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

// Index for efficient queries
AttendanceSchema.index({ studentId: 1, date: -1 });
AttendanceSchema.index({ date: -1 });

module.exports = mongoose.model('Attendance', AttendanceSchema);
