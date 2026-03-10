const AuditLog = require('../models/AuditLog');

async function logAudit({
  actorId,
  actorRole,
  action,
  category,
  resourceType,
  resourceId,
  status = 'success',
  metadata = {},
  req,
}) {
  try {
    const entry = new AuditLog({
      actorId: actorId || (req && req.user ? req.user._id : undefined),
      actorRole: actorRole || (req && req.user ? req.user.role : undefined),
      action,
      category,
      resourceType,
      resourceId,
      status,
      metadata,
      ipAddress: req ? req.ip : undefined,
      userAgent: req && req.headers ? req.headers['user-agent'] : undefined,
    });
    await entry.save();
  } catch (err) {
    // Fail silently – auditing must not break main flow
  }
}

module.exports = {
  logAudit,
};

