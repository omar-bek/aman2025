const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please add student name'],
    trim: true
  },
  arabicName: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  parentIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus'
  },
  rfidTag: {
    type: String,
    unique: true,
    sparse: true
  },
  smartwatchId: {
    type: String,
    unique: true,
    sparse: true
  },
  address: {
    street: String,
    city: String,
    building: String,
    apartment: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  emergencyContacts: [{
    name: String,
    relationship: String,
    phone: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', StudentSchema);
