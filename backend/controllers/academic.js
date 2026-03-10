const { Grade, Exam, Assignment } = require('../models/Academic');
const Student = require('../models/Student');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// ========== GRADES ==========

// @desc    Get all grades
// @route   GET /api/academic/grades
// @access  Private
exports.getGrades = asyncHandler(async (req, res, next) => {
  let query = {};

  if (req.user.role === 'parent') {
    const students = await Student.find({ parentIds: req.user._id });
    const studentIds = students.map(s => s._id);
    query.studentId = { $in: studentIds };
  }

  const { studentId, subject, type } = req.query;
  if (studentId) query.studentId = studentId;
  if (subject) query.subject = subject;
  if (type) query.type = type;

  const grades = await Grade.find(query)
    .populate('studentId', 'name studentId grade class')
    .populate('gradedBy', 'name')
    .sort('-date');

  res.status(200).json({
    success: true,
    count: grades.length,
    data: grades
  });
});

// @desc    Create grade
// @route   POST /api/academic/grades
// @access  Private/Teacher
exports.createGrade = asyncHandler(async (req, res, next) => {
  const grade = await Grade.create({
    ...req.body,
    gradedBy: req.user._id
  });

  res.status(201).json({
    success: true,
    data: grade
  });
});

// @desc    Update grade
// @route   PUT /api/academic/grades/:id
// @access  Private/Teacher
exports.updateGrade = asyncHandler(async (req, res, next) => {
  let grade = await Grade.findById(req.params.id);

  if (!grade) {
    return next(new ErrorResponse(`Grade not found with id of ${req.params.id}`, 404));
  }

  grade = await Grade.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: grade
  });
});

// @desc    Delete grade
// @route   DELETE /api/academic/grades/:id
// @access  Private/Teacher
exports.deleteGrade = asyncHandler(async (req, res, next) => {
  const grade = await Grade.findById(req.params.id);

  if (!grade) {
    return next(new ErrorResponse(`Grade not found with id of ${req.params.id}`, 404));
  }

  await grade.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// ========== EXAMS ==========

// @desc    Get all exams
// @route   GET /api/academic/exams
// @access  Private
exports.getExams = asyncHandler(async (req, res, next) => {
  let query = {};

  if (req.user.role === 'parent') {
    const students = await Student.find({ parentIds: req.user._id });
    const studentIds = students.map(s => s._id);
    query.studentIds = { $in: studentIds };
  }

  const { grade, subject, date } = req.query;
  if (grade) query.grade = grade;
  if (subject) query.subject = subject;
  if (date) query.date = new Date(date);

  const exams = await Exam.find(query)
    .populate('createdBy', 'name')
    .populate('studentIds', 'name studentId')
    .sort('-date');

  res.status(200).json({
    success: true,
    count: exams.length,
    data: exams
  });
});

// @desc    Create exam
// @route   POST /api/academic/exams
// @access  Private/Teacher
exports.createExam = asyncHandler(async (req, res, next) => {
  const exam = await Exam.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    data: exam
  });
});

// @desc    Update exam
// @route   PUT /api/academic/exams/:id
// @access  Private/Teacher
exports.updateExam = asyncHandler(async (req, res, next) => {
  let exam = await Exam.findById(req.params.id);

  if (!exam) {
    return next(new ErrorResponse(`Exam not found with id of ${req.params.id}`, 404));
  }

  exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: exam
  });
});

// @desc    Delete exam
// @route   DELETE /api/academic/exams/:id
// @access  Private/Teacher
exports.deleteExam = asyncHandler(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    return next(new ErrorResponse(`Exam not found with id of ${req.params.id}`, 404));
  }

  await exam.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// ========== ASSIGNMENTS ==========

// @desc    Get all assignments
// @route   GET /api/academic/assignments
// @access  Private
exports.getAssignments = asyncHandler(async (req, res, next) => {
  let query = {};

  if (req.user.role === 'parent') {
    const students = await Student.find({ parentIds: req.user._id });
    const studentIds = students.map(s => s._id);
    query.studentIds = { $in: studentIds };
  }

  const { grade, subject, dueDate } = req.query;
  if (grade) query.grade = grade;
  if (subject) query.subject = subject;
  if (dueDate) query.dueDate = new Date(dueDate);

  const assignments = await Assignment.find(query)
    .populate('createdBy', 'name')
    .populate('studentIds', 'name studentId')
    .sort('-dueDate');

  res.status(200).json({
    success: true,
    count: assignments.length,
    data: assignments
  });
});

// @desc    Create assignment
// @route   POST /api/academic/assignments
// @access  Private/Teacher
exports.createAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    data: assignment
  });
});

// @desc    Update assignment
// @route   PUT /api/academic/assignments/:id
// @access  Private/Teacher
exports.updateAssignment = asyncHandler(async (req, res, next) => {
  let assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    return next(new ErrorResponse(`Assignment not found with id of ${req.params.id}`, 404));
  }

  assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: assignment
  });
});

// @desc    Delete assignment
// @route   DELETE /api/academic/assignments/:id
// @access  Private/Teacher
exports.deleteAssignment = asyncHandler(async (req, res, next) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    return next(new ErrorResponse(`Assignment not found with id of ${req.params.id}`, 404));
  }

  await assignment.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
