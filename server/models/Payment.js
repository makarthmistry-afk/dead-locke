const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: String,
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'card'],
    default: 'stripe'
  },
  receipt: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
