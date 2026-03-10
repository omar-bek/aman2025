const Concern = require('../models/Concern');
const Student = require('../models/Student');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const axios = require('axios');

// @desc    Get concerns for current user (parent) or all (admin/staff)
// @route   GET /api/concerns
// @access  Private
exports.getConcerns = asyncHandler(async (req, res, next) => {
  const query = {};

  if (req.user.role === 'parent') {
    query.parentId = req.user._id;
  }

  const concerns = await Concern.find(query)
    .populate('studentId', 'name grade class')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: concerns.length,
    data: concerns,
  });
});

// @desc    Get single concern
// @route   GET /api/concerns/:id
// @access  Private
exports.getConcern = asyncHandler(async (req, res, next) => {
  const concern = await Concern.findById(req.params.id).populate(
    'studentId',
    'name grade class'
  );

  if (!concern) {
    return next(new ErrorResponse('Concern not found', 404));
  }

  if (req.user.role === 'parent' && concern.parentId.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  res.status(200).json({
    success: true,
    data: concern,
  });
});

// @desc    Create concern (parent)
// @route   POST /api/concerns
// @access  Private/Parent
exports.createConcern = asyncHandler(async (req, res, next) => {
  const { studentId, type, priority, title, description } = req.body;

  const student = await Student.findById(studentId);
  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${studentId}`, 404));
  }

  if (req.user.role === 'parent' && !student.parentIds.includes(req.user._id)) {
    return next(new ErrorResponse('Not authorized to create concern for this student', 403));
  }

  const concern = await Concern.create({
    studentId,
    parentId: req.user._id,
    type,
    priority,
    title,
    description,
  });

  res.status(201).json({
    success: true,
    data: concern,
  });
});

// @desc    Generate AI-based concern suggestion for a student
// @route   POST /api/concerns/ai/suggest
// @access  Private/Parent
exports.suggestConcern = asyncHandler(async (req, res, next) => {
  const { studentId } = req.body;

  if (!studentId) {
    return next(new ErrorResponse('studentId is required', 400));
  }

  const student = await Student.findById(studentId);
  if (!student) {
    return next(new ErrorResponse(`Student not found with id of ${studentId}`, 404));
  }

  if (req.user.role === 'parent' && !student.parentIds.includes(req.user._id)) {
    return next(new ErrorResponse('Not authorized to generate concern for this student', 403));
  }

  const aiApiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
  if (!aiApiKey) {
    return next(new ErrorResponse('AI API key is not configured', 500));
  }

  // Very simple placeholder: call OpenAI-compatible API with student basic info only.
  const prompt = `
أنت مساعد لولي أمر في مدرسة. بناءً على المعلومات التالية عن الطالب، اقترح نص قلق مختصر وواضح باللغة العربية ليتم إرساله للمدرسة.

اسم الطالب: ${student.name || 'غير معروف'}
الصف: ${student.grade || 'غير محدد'}
الفصل: ${student.class || 'غير محدد'}

اكتب فقرة قصيرة (3-6 جمل) بصيغة ولي الأمر، بدون تفاصيل حساسة، تركّز على طلب الدعم والمتابعة من المدرسة.
`;

  try {
    const response = await axios.post(
      process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'أنت مساعد يساعد أولياء الأمور على صياغة مخاوفهم بشكل مهني وواضح.' },
          { role: 'user', content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${aiApiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const suggestion =
      response.data?.choices?.[0]?.message?.content?.trim() ||
      'لم نتمكن من توليد نص مناسب في الوقت الحالي. يرجى كتابة القلق يدويًا.';

    res.status(200).json({
      success: true,
      data: {
        suggestion,
      },
    });
  } catch (err) {
    console.error('AI suggestConcern error:', err.response?.data || err.message);
    return next(new ErrorResponse('Failed to generate AI suggestion', 502));
  }
});

