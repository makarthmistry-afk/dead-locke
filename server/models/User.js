const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://via.placeholder.com/150' },
  bio: { type: String, default: '' },
  country: { type: String, default: '' },
  stats: {
    tournamentsJoined: { type: Number, default: 0 },
    tournamentsWon: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
