const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  game: { type: String, required: true },
  description: { type: String, default: '' },
  entryFee: { type: Number, required: true },
  maxParticipants: { type: Number, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bracket: [{
    player1: String,
    player2: String,
    winner: String
  }],
  prizes: {
    first: { type: Number, default: 0 },
    second: { type: Number, default: 0 },
    third: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'completed'],
    default: 'upcoming'
  },
  startDate: Date,
  endDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tournament', TournamentSchema);
