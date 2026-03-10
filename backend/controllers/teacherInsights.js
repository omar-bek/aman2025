const Student = require('../models/Student');
const { Grade } = require('../models/Academic');
const WellbeingCheckin = require('../models/WellbeingCheckin');
const asyncHandler = require('../middleware/async');

function moodToScore(mood) {
  switch (mood) {
    case 'great':
      return 100;
    case 'good':
      return 80;
    case 'okay':
      return 60;
    case 'tough':
      return 40;
    default:
      return 70;
  }
}

// @desc    Get class insights (engagement + academics) for teacher
// @route   GET /api/teacher/class-insights
// @access  Private/Teacher (or admin/staff)
exports.getClassInsights = asyncHandler(async (req, res) => {
  const { class: className } = req.query;
  const user = req.user;

  const studentQuery = {};

  if (user.role === 'teacher') {
    studentQuery.teacherId = user._id;
  }

  if (className) {
    studentQuery.class = className;
  }

  const students = await Student.find(studentQuery);
  if (!students.length) {
    return res.json({
      overall_engagement: 0,
      engagement_metrics: [],
      academic_trends: [],
      recommendations: [],
    });
  }

  const studentIds = students.map((s) => s._id);

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [grades, checkins] = await Promise.all([
    Grade.find({ studentId: { $in: studentIds } }),
    WellbeingCheckin.find({
      studentId: { $in: studentIds },
      createdAt: { $gte: weekAgo },
    }),
  ]);

  // Overall engagement from wellbeing check-ins
  let overallEngagement = 0;
  if (checkins.length) {
    const sum = checkins.reduce((acc, c) => acc + moodToScore(c.mood), 0);
    overallEngagement = Math.round(sum / checkins.length);
  } else {
    overallEngagement = 80;
  }

  // Academic by subject
  const bySubject = new Map();
  grades.forEach((g) => {
    const key = g.subject || 'Other';
    if (!bySubject.has(key)) bySubject.set(key, []);
    bySubject.get(key).push(g);
  });

  const engagement_metrics = [];
  const academic_trends = [];
  const recommendations = [];

  bySubject.forEach((subjectGrades, subject) => {
    const avg =
      subjectGrades.reduce((sum, g) => sum + (typeof g.grade === 'number' ? g.grade : 0), 0) /
      subjectGrades.length;

    const studentsEngaged = new Set(
      subjectGrades.filter((g) => g.grade >= 60).map((g) => String(g.studentId))
    ).size;

    const totalStudentsSubject = new Set(
      subjectGrades.map((g) => String(g.studentId))
    ).size;

    engagement_metrics.push({
      topic: subject,
      engagement_score: Math.round(avg),
      trend: 'stable',
      students_engaged: studentsEngaged,
      total_students: totalStudentsSubject,
    });

    const previousAvg = Math.max(0, Math.round(avg - 5));

    academic_trends.push({
      topic: subject,
      subject,
      current_avg: Math.round(avg),
      previous_avg: previousAvg,
      trend: avg > previousAvg ? 'up' : avg < previousAvg ? 'down' : 'stable',
      assessment_count: subjectGrades.length,
    });

    if (avg < 75) {
      recommendations.push({
        id: recommendations.length + 1,
        priority: avg < 60 ? 'high' : 'medium',
        category: 'academic',
        title: `تعزيز ${subject}`,
        description: `متوسط أداء الطلاب في ${subject} هو ${Math.round(
          avg
        )}%. قد يحتاجون إلى مراجعة إضافية.`,
        action: 'إضافة حصة مراجعة سريعة وتمارين بسيطة',
        impacted_students: totalStudentsSubject,
      });
    }
  });

  if (overallEngagement < 70) {
    recommendations.push({
      id: recommendations.length + 1,
      priority: 'high',
      category: 'engagement',
      title: 'تحسين تفاعل الصف',
      description: 'إشارات التفاعل والرفاهية تشير إلى حاجة لأنشطة أكثر تفاعلاً.',
      action: 'إضافة نشاط افتتاحي قصير أو عمل جماعي',
    });
  }

  res.json({
    overall_engagement: overallEngagement,
    engagement_metrics,
    academic_trends,
    recommendations,
  });
});

