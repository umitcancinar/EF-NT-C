const express = require('express');
const router = express.Router();
const ai = require('../controllers/aiController');
const auth = require('../middlewares/auth');

// Public chatbot (no auth required for basic chat)
router.post('/chat', ai.chat);

// Protected AI features
router.post('/risk-report', auth, ai.riskReport);
router.post('/partner-search', auth, ai.partnerSearch);
router.post('/portfolio', auth, ai.portfolio);
router.post('/logistics', auth, ai.logistics);
router.post('/accountant', auth, ai.accountant);
router.get('/reports', auth, ai.getReports);

module.exports = router;
