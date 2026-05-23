const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Create Payment Intent
router.post('/create-intent', requireAuth, async (req, res) => {
  try {
    const { amount, tournamentId } = req.body;

    if (!amount || !tournamentId) {
      return res.status(400).json({ error: 'Amount and tournamentId required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        userId: req.userId,
        tournamentId: tournamentId
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process Payment
router.post('/', requireAuth, async (req, res) => {
  try {
    const { tournamentId, amount, stripeToken } = req.body;

    if (!tournamentId || !amount || !stripeToken) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In production, verify with Stripe
    const payment = new Payment({
      userId: req.userId,
      tournamentId,
      amount,
      status: 'completed',
      transactionId: stripeToken,
      paymentMethod: 'stripe'
    });

    await payment.save();
    res.status(201).json({ message: 'Payment processed', payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Payments
router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    if (req.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const payments = await Payment.find({ userId: req.params.userId })
      .populate('tournamentId', 'name game')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Payment Details
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('userId', 'username email')
      .populate('tournamentId', 'name game');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
