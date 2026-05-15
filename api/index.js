const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));

// Database Initialization (optional but helpful)
const db = require('./config/db');
db.query('SELECT NOW()').then(() => console.log('✅ DB Connected')).catch(err => console.error('❌ DB Error:', err));

// Serve Static Files
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  }
});

// Export for Vercel
module.exports = app;
