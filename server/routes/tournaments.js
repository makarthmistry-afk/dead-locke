const express = require('express');
const Tournament = require('../models/Tournament');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { requireAuth, auth } = require('../middleware/auth');

const router = express.Router();

// Create Tournament
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, game, description, entryFee, maxParticipants, startDate, endDate, prizes } = req.body;

    if (!name || !game || !entryFee || !maxParticipants) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const tournament = new Tournament({
      name,
      game,
      description,
      entryFee,
      maxParticipants,
      startDate,
      endDate,
      prizes,
      createdBy: req.userId
    });

    await tournament.save();
    res.status(201).json({ message: 'Tournament created', tournament });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Tournaments
router.get('/', auth, async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate('createdBy', 'username')
      .populate('participants', 'username');
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Tournament
router.get('/:id', auth, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('participants', 'username email stats');
    
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join Tournament (with Payment)
router.post('/:id/join', requireAuth, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    if (tournament.participants.includes(req.userId)) {
      return res.status(400).json({ error: 'Already joined this tournament' });
    }

    if (tournament.participants.length >= tournament.maxParticipants) {
      return res.status(400).json({ error: 'Tournament is full' });
    }

    // Create payment record
    const payment = new Payment({
      userId: req.userId,
      tournamentId: req.params.id,
      amount: tournament.entryFee,
      status: 'completed',
      paymentMethod: 'stripe'
    });

    await payment.save();

    // Add participant
    tournament.participants.push(req.userId);
    await tournament.save();

    // Update user stats
    await User.findByIdAndUpdate(req.userId, {
      $inc: { 'stats.tournamentsJoined': 1 }
    });

    res.json({ message: 'Joined tournament successfully', tournament });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Tournament
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    
    if (tournament.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only creator can update' });
    }

    const { name, description, status, bracket } = req.body;
    const updated = await Tournament.findByIdAndUpdate(
      req.params.id,
      { name, description, status, bracket, updatedAt: Date.now() },
      { new: true }
    );

    res.json({ message: 'Tournament updated', tournament: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
