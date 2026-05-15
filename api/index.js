const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const initDB = require('../backend/config/init');

// Initialize Database
initDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/auth', require('../backend/routes/authRoutes'));
app.use('/api/user', require('../backend/routes/userRoutes'));
app.use('/api/ai', require('../backend/routes/aiRoutes'));
app.use('/api/market', require('../backend/routes/marketRoutes'));
app.use('/api/news', require('../backend/routes/newsRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error', details: err.message });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 EFİNTİC Server running on port ${PORT}`);
  });
}

module.exports = app;
