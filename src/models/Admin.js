const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    username:     { type: String, required: true, unique: true, lowercase: true },
    fullName:     { type: String, required: true },
    email:        { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, enum: ['super_admin', 'editor'], default: 'editor' },
    isActive:     { type: Boolean, default: true },
    lastLoginAt:  { type: Date, default: null },
  },
  { timestamps: true }
);

// Ẩn passwordHash khi trả về JSON
adminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

// So sánh password
adminSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Hash trước khi lưu
adminSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

module.exports = mongoose.model('Admin', adminSchema);
