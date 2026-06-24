const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  detail: { type: String, default: '' },
  type:   { type: String, enum: ['auth', 'repo', 'settings', 'report', 'team', 'security'], default: 'auth' },
  ip:     { type: String, default: '' },
}, { timestamps: true });

activityLogSchema.index({ user: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
