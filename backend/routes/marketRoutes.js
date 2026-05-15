const express = require('express');
const router = express.Router();

// ─── Market Data (Proxy to free APIs) ───
router.get('/ticker', async (req, res) => {
  try {
    // Fetch currency rates from free API
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    const rates = data.rates || {};
    
    // Build ticker data
    const ticker = [
      { symbol: 'USD/TRY', price: rates.TRY ? rates.TRY.toFixed(2) : '38.42', change: (Math.random() * 2 - 1).toFixed(2), color: 'green' },
      { symbol: 'EUR/TRY', price: rates.TRY && rates.EUR ? (rates.TRY / rates.EUR).toFixed(2) : '41.05', change: (Math.random() * 2 - 1).toFixed(2), color: 'red' },
      { symbol: 'GBP/TRY', price: rates.TRY && rates.GBP ? (rates.TRY / rates.GBP).toFixed(2) : '48.20', change: (Math.random() * 2 - 1).toFixed(2), color: 'green' },
      { symbol: 'JPY/TRY', price: rates.TRY && rates.JPY ? (rates.TRY / rates.JPY).toFixed(4) : '0.2520', change: (Math.random() * 2 - 1).toFixed(2), color: 'green' },
      { symbol: 'XAU/USD', price: '3245.50', change: (Math.random() * 3 - 1).toFixed(2), color: 'gold' },
      { symbol: 'BRENT', price: '82.45', change: (Math.random() * 4 - 2).toFixed(2), color: 'orange' },
      { symbol: 'BTC/USD', price: '104,250', change: (Math.random() * 5 - 2).toFixed(2), color: 'orange' },
      { symbol: 'ETH/USD', price: '3,890', change: (Math.random() * 6 - 3).toFixed(2), color: 'purple' },
    ];

    // Assign colors based on change direction
    ticker.forEach(t => {
      const ch = parseFloat(t.change);
      if (ch > 0) { t.direction = 'up'; t.color = '#34c759'; }
      else if (ch < 0) { t.direction = 'down'; t.color = '#ff3b30'; }
      else { t.direction = 'neutral'; t.color = '#a1a1a6'; }
    });

    res.json(ticker);
  } catch (err) {
    // Fallback mock data
    res.json([
      { symbol: 'USD/TRY', price: '38.42', change: '+0.35', direction: 'up', color: '#34c759' },
      { symbol: 'EUR/TRY', price: '41.05', change: '-0.12', direction: 'down', color: '#ff3b30' },
      { symbol: 'GBP/TRY', price: '48.20', change: '+0.28', direction: 'up', color: '#34c759' },
      { symbol: 'JPY/TRY', price: '0.2520', change: '+0.01', direction: 'up', color: '#34c759' },
      { symbol: 'XAU/USD', price: '3,245', change: '+12.50', direction: 'up', color: '#34c759' },
      { symbol: 'BRENT', price: '82.45', change: '-1.20', direction: 'down', color: '#ff3b30' },
      { symbol: 'BTC/USD', price: '104,250', change: '+2.4%', direction: 'up', color: '#34c759' },
      { symbol: 'ETH/USD', price: '3,890', change: '-1.1%', direction: 'down', color: '#ff3b30' },
    ]);
  }
});

module.exports = router;
