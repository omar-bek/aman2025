const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    actorRole: {
      type: String,
      enum: ['parent', 'teacher', 'admin', 'staff', 'driver', 'system', 'super_admin', 'government'],
      required: false,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['auth', 'permission_change', 'data_export', 'data_access', 'config_change', 'incident', 'system'],
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    resourceType: {
      type: String,
      required: false,
      trim: true,
    },
    resourceId: {
      type: String,
      required: false,
      trim: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      default: 'success',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

AuditLogSchema.index({ category: 1, createdAt: -1 });
AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ resourceType: 1, resourceId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);

