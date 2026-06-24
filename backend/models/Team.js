const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email:  { type: String, required: true },
  role:   { type: String, enum: ['admin', 'manager', 'developer'], default: 'developer' },
  status: { type: String, enum: ['active', 'invited', 'removed'], default: 'invited' },
  joinedAt: { type: Date, default: null },
});

const teamSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  owner:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [memberSchema],
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
