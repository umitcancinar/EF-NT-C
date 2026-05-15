const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/db');

const MODEL_NAME = 'gemini-2.0-flash';

const getAIResponse = async (prompt, lang) => {
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
    
    if (req.user?.userId) {
      await db.query('INSERT INTO chat_history (user_id, role, content) VALUES ($1, $2, $3)', [req.user.userId, 'user', message]);
      await db.query('INSERT INTO chat_history (user_id, role, content) VALUES ($1, $2, $3)', [req.user.userId, 'assistant', aiMessage.substring(0, 2000)]);
    }
    res.json({ response: aiMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Risk Report ───
exports.getRiskReport = async (req, res) => {
  try {
    const { sector, newsContext, lang } = req.body;
    const prompt = lang === 'TR' 
      ? `${sector} sektörü için şu güncel bilgilerle bir risk analizi yap: ${newsContext}`
      : `Analyze risks for ${sector} sector given this news: ${newsContext}`;
    const report = await getAIResponse(prompt, lang);
    res.json({ report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Partner Search ───
exports.findPartner = async (req, res) => {
  try {
    const { sector, city, budget, lang } = req.body;
    const prompt = `Find business partners in ${sector} sector in ${city} with budget ${budget}. Lang: ${lang}`;
    const report = await getAIResponse(prompt, lang);
    res.json({ report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Portfolio Advisor ───
exports.getPortfolioAdvice = async (req, res) => {
  try {
    const { capital, riskTolerance, lang } = req.body;
    const prompt = `Give portfolio advice for ${capital} with ${riskTolerance} risk. Lang: ${lang}`;
    const report = await getAIResponse(prompt, lang);
    res.json({ report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Logistics Assistant ───
exports.analyzeLogistics = async (req, res) => {
  try {
    const { origin, destination, cargoType, lang } = req.body;
    const prompt = `Analyze logistics route from ${origin} to ${destination} for ${cargoType}. Lang: ${lang}`;
    const report = await getAIResponse(prompt, lang);
    res.json({ report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ─── Accountant Agent ───
exports.askAccountant = async (req, res) => {
  try {
    const { query, lang } = req.body;
    const report = await getAIResponse(`Accountant advice for: ${query}. Lang: ${lang}`, lang);
    res.json({ report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
