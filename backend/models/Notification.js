const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:  { type: String, enum: ['risk', 'security', 'repo', 'system', 'team'], default: 'system' },
  title: { type: String, required: true },
  desc:  { type: String, default: '' },
  read:  { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ user: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
