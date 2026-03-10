const asyncHandler = require('../middleware/async');

// These handlers provide a minimal stub implementation for teacher assignments
// so that the frontend UI can function without 404 errors. They intentionally
// avoid exposing any student-level identifiers beyond simple numeric IDs.

// @desc    Get all assignments (stubbed demo data)
// @route   GET /api/teacher/assignments/
// @access  Private (teacher)
exports.getAssignments = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const data = [
    {
      id: 1,
      assignment_name: 'Math Practice Sheet',
      subject: 'Math',
      description: 'Revision of key concepts before midterm',
      due_date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      max_grade: 100,
      class_name: '4B',
      grade: '4',
      academic_year: '2024-2025',
      teacher_id: 1,
      assignment_type: 'individual',
      file_path: '',
      is_active: true,
      created_at: now,
    },
  ];

  res.status(200).json(data);
});

// @desc    Get single assignment by id (stub)
// @route   GET /api/teacher/assignments/:id
// @access  Private (teacher)
exports.getAssignmentById = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const assignment = {
    id: Number(req.params.id),
    assignment_name: 'Sample Assignment',
    subject: 'Science',
    description: 'Example assignment details',
    due_date: now,
    max_grade: 100,
    class_name: '3A',
    grade: '3',
    academic_year: '2024-2025',
    teacher_id: 1,
    assignment_type: 'individual',
    file_path: '',
    is_active: true,
    created_at: now,
  };

  res.status(200).json(assignment);
});

// @desc    Create assignment (stub – echoes payload)
// @route   POST /api/teacher/assignments/
// @access  Private (teacher)
exports.createAssignment = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const created = {
    id: Date.now(),
    ...req.body,
    is_active: true,
    created_at: now,
  };

  res.status(201).json(created);
});

// @desc    Update assignment (stub)
// @route   PUT /api/teacher/assignments/:id
// @access  Private (teacher)
exports.updateAssignment = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const updated = {
    id: Number(req.params.id),
    ...req.body,
    updated_at: now,
  };

  res.status(200).json(updated);
});

// @desc    Delete assignment (stub – no-op)
// @route   DELETE /api/teacher/assignments/:id
// @access  Private (teacher)
exports.deleteAssignment = asyncHandler(async (req, res, next) => {
  res.status(204).send();
});

// @desc    Get submissions for an assignment (stubbed empty list)
// @route   GET /api/teacher/assignments/:assignmentId/submissions
// @access  Private (teacher)
exports.getSubmissions = asyncHandler(async (req, res, next) => {
  res.status(200).json([]);
});

// @desc    Grade a submission (stub)
// @route   PUT /api/teacher/assignments/submissions/:submissionId
// @access  Private (teacher)
exports.gradeSubmission = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const submission = {
    id: Number(req.params.submissionId),
    assignment_id: 1,
    student_id: 1,
    submission_status: req.body.submission_status || 'graded',
    submitted_at: now,
    file_path: '',
    comment: req.body.comment || '',
    teacher_comment: req.body.teacher_comment || '',
    grade: req.body.grade || 0,
    created_at: now,
    updated_at: now,
  };

  res.status(200).json(submission);
});

// @desc    Get count of today’s assignments (stub)
// @route   GET /api/teacher/assignments/today/count
// @access  Private (teacher)
exports.getTodayAssignmentCount = asyncHandler(async (req, res, next) => {
  res.status(200).json({ count: 1 });
});

