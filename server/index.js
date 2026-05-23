const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dead-locke', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected');
}).catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/tournaments', require('./routes/tournaments'));
app.use('/api/payments', require('./routes/payments'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Dead Locke Server is Running 🎮' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎮 Dead Locke Server Running on Port ${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
});
