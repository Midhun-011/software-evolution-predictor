const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema({
  owner:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName:   { type: String, required: true },
  source:     { type: String, enum: ['GitHub', 'GitLab', 'Bitbucket'], default: 'GitHub' },
  url:        { type: String, default: '' },
  language:   { type: String, default: '' },
  linesOfCode:{ type: Number, default: 0 },
  health:     { type: Number, default: 0 },
  risk:       { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  stars:      { type: Number, default: 0 },
  tags:       [{ type: String }],
  favorite:   { type: Boolean, default: false },
  category:   { type: String, default: '' },
  lastAnalyzed: { type: Date, default: null },
}, { timestamps: true });

repositorySchema.index({ owner: 1 });
repositorySchema.index({ fullName: 'text' });

module.exports = mongoose.model('Repository', repositorySchema);
