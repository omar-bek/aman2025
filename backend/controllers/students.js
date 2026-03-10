const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const { Grade } = require('../models/Academic');
const Behavior = require('../models/Behavior');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
exports.getStudents = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // If user is parent, only show their children
  if (req.user.role === 'parent') {
    reqQuery.parentIds = req.user._id;
  }

  // If user is teacher, only show their class students
  if (req.user.role === 'teacher') {
    reqQuery.teacherId = req.user._id;
  }

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  query = Student.find(JSON.parse(queryStr)).populate('parentIds', 'name email phone');

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Student.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  const students = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: students.length,
    pagination,
    data: students
  });
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
exports.getStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id)
    .populate('parentIds', 'name email phone')
    .populate('teacherId', 'name email')
    .populate('busId');

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  // Check if user has access
  if (req.user.role === 'parent' && !student.parentIds.includes(req.user._id)) {
    return next(new ErrorResponse('Not authorized to access this student', 403));
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
exports.createStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.create(req.body);

  res.status(201).json({
    success: true,
    data: student
  });
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
exports.updateStudent = asyncHandler(async (req, res, next) => {
  let student = await Student.findById(req.params.id);

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: student
  });
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
exports.deleteStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  await student.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get student attendance
// @route   GET /api/students/:id/attendance
// @access  Private
exports.getStudentAttendance = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  // Check access
  if (req.user.role === 'parent' && !student.parentIds.includes(req.user._id)) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  const { startDate, endDate } = req.query;
  let query = { studentId: req.params.id };

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const attendance = await Attendance.find(query)
    .sort('-date')
    .populate('verifiedBy', 'name');

  res.status(200).json({
    success: true,
    count: attendance.length,
    data: attendance
  });
});

// @desc    Get student grades
// @route   GET /api/students/:id/grades
// @access  Private
exports.getStudentGrades = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  if (req.user.role === 'parent' && !student.parentIds.includes(req.user._id)) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  const grades = await Grade.find({ studentId: req.params.id })
    .populate('gradedBy', 'name')
    .sort('-date');

  res.status(200).json({
    success: true,
    count: grades.length,
    data: grades
  });
});

// @desc    Get student behavior
// @route   GET /api/students/:id/behavior
// @access  Private
exports.getStudentBehavior = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
  }

  if (req.user.role === 'parent' && !student.parentIds.includes(req.user._id)) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  const behavior = await Behavior.find({ studentId: req.params.id })
    .populate('reportedBy', 'name')
    .sort('-date');

  res.status(200).json({
    success: true,
    count: behavior.length,
    data: behavior
  });
});
