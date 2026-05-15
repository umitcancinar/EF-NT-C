const express = require('express');
const router = express.Router();

// ─── Market Data (Proxy to free APIs) ───
router.get('/ticker', async (req, res) => {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (response && response.ok) {
      const data = await response.json();
      const rates = data.rates || {};
      const ticker = [
        { symbol: 'USD/TRY', price: rates.TRY ? rates.TRY.toFixed(2) : '45.51', change: (Math.random() * 2 - 1).toFixed(2) },
        { symbol: 'EUR/TRY', price: rates.TRY && rates.EUR ? (rates.TRY / rates.EUR).toFixed(2) : '53.17', change: (Math.random() * 2 - 1).toFixed(2) },
        { symbol: 'GBP/TRY', price: rates.TRY && rates.GBP ? (rates.TRY / rates.GBP).toFixed(2) : '61.25', change: (Math.random() * 2 - 1).toFixed(2) },
        { symbol: 'JPY/TRY', price: rates.TRY && rates.JPY ? (rates.TRY / rates.JPY).toFixed(4) : '0.2878', change: (Math.random() * 2 - 1).toFixed(2) },
        { symbol: 'XAU/USD', price: '3245.50', change: (Math.random() * 3 - 1).toFixed(2) },
        { symbol: 'BRENT', price: '82.45', change: (Math.random() * 4 - 2).toFixed(2) },
        { symbol: 'BTC/USD', price: '104,250', change: (Math.random() * 5 - 2).toFixed(2) },
        { symbol: 'ETH/USD', price: '3,890', change: (Math.random() * 6 - 3).toFixed(2) },
      ];
      ticker.forEach(t => {
        const ch = parseFloat(t.change);
        if (ch >= 0) { t.direction = 'up'; t.color = '#34c759'; t.change = '+' + t.change; }
        else { t.direction = 'down'; t.color = '#ff3b30'; }
      });
      return res.json(ticker);
    }
    throw new Error('API down');
  } catch (err) {
    console.log('Market API error, using fallback');
    res.json([
      { symbol: 'USD/TRY', price: '45.51', change: '+0.35', direction: 'up', color: '#34c759' },
      { symbol: 'EUR/TRY', price: '53.17', change: '-0.12', direction: 'down', color: '#ff3b30' },
      { symbol: 'GBP/TRY', price: '61.25', change: '+0.28', direction: 'up', color: '#34c759' },
      { symbol: 'JPY/TRY', price: '0.2878', change: '+0.01', direction: 'up', color: '#34c759' },
      { symbol: 'XAU/USD', price: '3,245', change: '+12.50', direction: 'up', color: '#34c759' },
      { symbol: 'BRENT', price: '82.45', change: '-1.20', direction: 'down', color: '#ff3b30' },
      { symbol: 'BTC/USD', price: '104,250', change: '+2.4%', direction: 'up', color: '#34c759' },
      { symbol: 'ETH/USD', price: '3,890', change: '-1.1%', direction: 'down', color: '#ff3b30' },
    ]);
  }
});

module.exports = router;
