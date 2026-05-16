const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/db');

const MODEL_NAME = 'gemini-2.0-flash';

const getAIResponse = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is missing');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

// ─── Chatbot ───
exports.chat = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) return res.status(400).json({ error: 'GEMINI_API_KEY missing' });
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const { message, history, lang } = req.body;
    
    const chat = model.startChat({
      history: history ? history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content || msg.text || '' }],
      })) : []
    });

    const systemPrompt = lang === 'TR' ? "Sen EFİNTİC platformu AI asistanısın. Türkçe konuş." : "You are EFİNTİC AI. Speak English.";
    const result = await chat.sendMessage(systemPrompt + "\n\n" + message);
    const aiMessage = (await result.response).text();
    
    try {
      if (req.user?.userId) {
        await db.query('INSERT INTO chat_history (user_id, role, content) VALUES ($1, $2, $3)', [req.user.userId, 'user', message]);
        await db.query('INSERT INTO chat_history (user_id, role, content) VALUES ($1, $2, $3)', [req.user.userId, 'assistant', aiMessage.substring(0, 2000)]);
      }
    } catch (dbErr) {
      console.error('Chat DB save error (non-fatal):', dbErr.message);
    }
    res.json({ response: aiMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Risk Report ───
exports.riskReport = async (req, res) => {
  try {
    const { sector, newsContext, lang } = req.body;
    const prompt = lang === 'TR' 
      ? `${sector} sektörü için şu güncel bilgilerle bir risk analizi yap: ${newsContext}`
      : `Analyze risks for ${sector} sector given this news: ${newsContext}`;
    const report = await getAIResponse(prompt);
    res.json({ report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Partner Search ───
exports.partnerSearch = async (req, res) => {
  try {
    const { sector, city, budget, lang } = req.body;
    const prompt = lang === 'TR'
      ? `${sector} sektöründe ${city} şehrinde ${budget} bütçeyle iş ortağı öner.`
      : `Find business partners in ${sector} sector in ${city} with budget ${budget}.`;
    const report = await getAIResponse(prompt);
    res.json({ report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Portfolio Advisor ───
exports.portfolio = async (req, res) => {
  try {
    const { capital, riskTolerance, lang } = req.body;
    const prompt = lang === 'TR'
      ? `${capital} sermaye ve ${riskTolerance} risk toleransı ile portföy tavsiyesi ver.`
      : `Give portfolio advice for ${capital} with ${riskTolerance} risk tolerance.`;
    const report = await getAIResponse(prompt);
    res.json({ report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Logistics Assistant ───
exports.logistics = async (req, res) => {
  try {
    const { origin, destination, cargoType, lang } = req.body;
    const prompt = lang === 'TR'
      ? `${origin} - ${destination} arası ${cargoType} tipi yük için lojistik analizi yap.`
      : `Analyze logistics route from ${origin} to ${destination} for ${cargoType}.`;
    const report = await getAIResponse(prompt);
    res.json({ report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Accountant Agent ───
exports.accountant = async (req, res) => {
  try {
    const { query, lang } = req.body;
    const prompt = lang === 'TR'
      ? `Muhasebe danışmanı olarak şu soruyu cevapla: ${query}`
      : `As an accountant advisor, answer: ${query}`;
    const report = await getAIResponse(prompt);
    res.json({ report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Get Reports ───
exports.getReports = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM ai_reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.json([]);
  }
};
