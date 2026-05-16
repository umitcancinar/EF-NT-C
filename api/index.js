const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));

// Veritabanı testini (DB query NOW) Vercel'de global scope'tan çıkardım 
// çünkü bu, sunucu başlarken fonksiyonun zaman aşımına veya crash olmasına yol açıyordu.
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Serverless API is running' });
});

// Serve Static Files
app.use(express.static(path.join(__dirname, '../frontend')));

app.use((req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  }
});

// Export for Vercel
module.exports = app;
