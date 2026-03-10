const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private
exports.getAttendance = asyncHandler(async (req, res, next) => {
  let query = {};

  if (req.user.role === 'parent') {
    const students = await Student.find({ parentIds: req.user._id });
    const studentIds = students.map((s) => s._id);
    query.studentId = { $in: studentIds };
  }

  if (req.user.role === 'teacher') {
    const students = await Student.find({ teacherId: req.user._id });
    const studentIds = students.map((s) => s._id);
    query.studentId = { $in: studentIds };
  }

  const { studentId, date, type, page = 1, limit = 100 } = req.query;

  if (studentId) query.studentId = studentId;
  if (date) query.date = new Date(date);
  if (type) query.type = type;

  const pageInt = parseInt(page, 10) || 1;
  const limitInt = Math.min(parseInt(limit, 10) || 100, 500);
  const skip = (pageInt - 1) * limitInt;

  const [attendance, total] = await Promise.all([
    Attendance.find(query)
      .populate('studentId', 'name studentId grade class')
      .populate('verifiedBy', 'name')
      .sort('-date')
      .skip(skip)
      .limit(limitInt),
    Attendance.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: attendance.length,
    total,
    page: pageInt,
    limit: limitInt,
    data: attendance,
  });
});

// @desc    Create attendance record
// @route   POST /api/attendance
// @access  Private/Staff
exports.createAttendance = asyncHandler(async (req, res, next) => {
  const { studentId, type, location, method, coordinates, notes } = req.body;

  // Verify student exists
  const student = await Student.findById(studentId);
  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${studentId}`, 404));
  }

  const attendance = await Attendance.create({
    studentId,
    type,
    location,
    method,
    coordinates,
    verifiedBy: req.user._id,
    notes
  });

  // Emit notification
  const io = req.app.get('io');
  if (io) {
    io.emit('attendanceUpdate', {
      studentId,
      type,
      location,
      timestamp: attendance.createdAt
    });
  }

  res.status(201).json({
    success: true,
    data: attendance
  });
});

// @desc    Get attendance by date
// @route   GET /api/attendance/date/:date
// @access  Private
exports.getAttendanceByDate = asyncHandler(async (req, res, next) => {
  const date = new Date(req.params.date);
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  let query = {
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  };

  if (req.user.role === 'parent') {
    const students = await Student.find({ parentIds: req.user._id });
    const studentIds = students.map(s => s._id);
    query.studentId = { $in: studentIds };
  }

  const attendance = await Attendance.find(query)
    .populate('studentId', 'name studentId grade class')
    .sort('date');

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance
  });
});

// @desc    Get attendance statistics
// @route   GET /api/attendance/stats
// @access  Private
exports.getAttendanceStats = asyncHandler(async (req, res, next) => {
  const { studentId, startDate, endDate } = req.query;

  let query = {};

  if (studentId) {
    query.studentId = studentId;
  } else if (req.user.role === 'parent') {
    const students = await Student.find({ parentIds: req.user._id });
    const studentIds = students.map(s => s._id);
    query.studentId = { $in: studentIds };
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const attendance = await Attendance.find(query);

  const stats = {
    total: attendance.length,
    schoolEntry: attendance.filter(a => a.type === 'school_entry').length,
    schoolExit: attendance.filter(a => a.type === 'school_exit').length,
    busBoarding: attendance.filter(a => a.type === 'bus_boarding').length,
    busAlighting: attendance.filter(a => a.type === 'bus_alighting').length,
    homeArrival: attendance.filter(a => a.type === 'home_arrival').length
  };

  res.status(200).json({
    success: true,
    data: stats
  });
});

// ------- Extra helpers to match frontend attendanceAPI and pages -------

// Map frontend attendance_type to internal type/location
const mapAttendanceType = (attendance_type) => {
  switch (attendance_type) {
    case 'board_bus':
      return { type: 'bus_boarding', location: 'bus' };
    case 'enter_school':
      return { type: 'school_entry', location: 'school' };
    case 'exit_school':
      return { type: 'school_exit', location: 'school' };
    case 'arrive_home':
      return { type: 'home_arrival', location: 'home' };
    default:
      return { type: 'school_entry', location: 'school' };
  }
};

// @desc    Log attendance event (simplified endpoint used by frontend)
// @route   POST /api/attendance/log
// @access  Private
exports.logAttendanceEvent = asyncHandler(async (req, res, next) => {
  const { student_id, attendance_type, device_id, location } = req.body;

  if (!student_id || !attendance_type || !device_id) {
    return next(new ErrorResponse('student_id, attendance_type and device_id are required', 400));
  }

  const student = await Student.findById(student_id);
  if (!student) {
    return next(new ErrorResponse('Student not found', 404));
  }

  const mapped = mapAttendanceType(attendance_type);

  const record = await Attendance.create({
    studentId: student._id,
    type: mapped.type,
    location: mapped.location,
    method: 'manual',
    coordinates: undefined,
    verifiedBy: req.user._id,
    notes: location ? `Device: ${device_id} @ ${location}` : `Device: ${device_id}`
  });

  res.status(201).json({
    id: record._id,
    student_id: student._id,
    attendance_type,
    device_id,
    location: location || mapped.location,
    timestamp: record.createdAt,
    verified: true
  });
});

// @desc    Get daily attendance summary for a student
// @route   GET /api/attendance/student/:studentId
// @access  Private
exports.getStudentAttendance = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  const { start_date, end_date } = req.query;

  const query = { studentId };

  if (start_date || end_date) {
    query.date = {};
    if (start_date) query.date.$gte = new Date(start_date);
    if (end_date) query.date.$lte = new Date(end_date);
  }

  const records = await Attendance.find(query).sort({ date: -1 });

  // Very simple projection to the shape expected by the generic Attendance interface
  const data = records.map((r) => ({
    id: r._id,
    student_id: r.studentId,
    date: r.date,
    status: 'present',
    notes: r.notes
  }));

  res.status(200).json(data);
});

// @desc    Get raw attendance logs for a student
// @route   GET /api/attendance/logs/:studentId
// @access  Private
exports.getAttendanceLogsForStudent = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  const { limit } = req.query;
  const max = parseInt(limit, 10) || 50;

  const records = await Attendance.find({ studentId })
    .sort({ createdAt: -1 })
    .limit(max);

  const data = records.map((r) => ({
    id: r._id,
    student_id: r.studentId,
    attendance_type: r.type,
    device_id: 'unknown',
    location: r.location,
    timestamp: r.createdAt,
    verified: true
  }));

  res.status(200).json(data);
});
