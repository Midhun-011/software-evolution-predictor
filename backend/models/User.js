const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:    { type: String, default: '' },
  password: { type: String, required: true, minlength: 6 },
  bio:      { type: String, default: '' },
  avatar:   { type: String, default: '' },
  role:     { type: String, enum: ['admin', 'manager', 'developer'], default: 'developer' },
  verified: { type: Boolean, default: false },
  twoFA:    { type: Boolean, default: false },
  lastLogin:{ type: Date, default: null },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublic = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    bio: this.bio,
    avatar: this.avatar,
    role: this.role,
    verified: this.verified,
    twoFA: this.twoFA,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
