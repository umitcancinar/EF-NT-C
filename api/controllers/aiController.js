const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/db');

const MODEL_NAME = 'gemini-1.5-flash-latest'; // En stabil flash modeli

// Ortak AI İstek Fonksiyonu
const getAIResponse = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing in environment variables');
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error details:", error);
    throw new Error('Google Gemini API service unavailable. Please check your API key.');
  }
};

// ─── Chatbot ───
const chat = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: 'GEMINI_API_KEY missing' });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const { message, history, lang } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }
    
    // Geçmişi temizle ve Gemini'ye uygun formata getir
    const formattedHistory = Array.isArray(history) ? history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content || msg.text || '' }],
    })) : [];
    
    const chatSession = model.startChat({ history: formattedHistory });

    const systemPrompt = lang === 'TR' 
      ? "Sen EFİNTİC platformu AI asistanısın. Sadece Türkçe konuş ve profesyonel bir üslup kullan." 
      : "You are EFİNTİC AI assistant. Speak English professionally.";
      
    const result = await chatSession.sendMessage(systemPrompt + "\n\nKullanıcı: " + message);
    const aiMessage = await result.response.text();
    
    // Geçmişi kaydet (Hata verirse yoksay, sohbeti bölmesin)
    try {
      if (req.user && req.user.userId) {
        await db.query('INSERT INTO chat_history (user_id, role, content) VALUES ($1, $2, $3)', [req.user.userId, 'user', message]);
        await db.query('INSERT INTO chat_history (user_id, role, content) VALUES ($1, $2, $3)', [req.user.userId, 'assistant', aiMessage.substring(0, 2000)]);
      }
    } catch (dbErr) {
      console.warn('Chat DB save error (ignored):', dbErr.message);
    }
    
    return res.json({ response: aiMessage });
  } catch (err) {
    console.error("Chat Error:", err.message);
    return res.status(500).json({ error: `AI Error: ${err.message}` });
  }
};

// ─── Risk Report ───
const riskReport = async (req, res) => {
  try {
    const { sector, newsContext, lang } = req.body;
    const prompt = lang === 'TR' 
      ? `${sector} sektörü için şu güncel bilgilerle detaylı bir risk analizi yap: ${newsContext}`
      : `Analyze risks for ${sector} sector given this news: ${newsContext}`;
    const report = await getAIResponse(prompt);
    return res.json({ report });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ─── Partner Search ───
const partnerSearch = async (req, res) => {
  try {
    const { sector, city, budget, lang } = req.body;
    const prompt = lang === 'TR'
      ? `${sector} sektöründe ${city} şehrinde ${budget} bütçeyle iş ortağı öner.`
      : `Find business partners in ${sector} sector in ${city} with budget ${budget}.`;
    const report = await getAIResponse(prompt);
    return res.json({ report });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ─── Portfolio Advisor ───
const portfolio = async (req, res) => {
  try {
    const { capital, riskTolerance, lang } = req.body;
    const prompt = lang === 'TR'
      ? `${capital} sermaye ve ${riskTolerance} risk toleransı ile portföy tavsiyesi ver.`
      : `Give portfolio advice for ${capital} with ${riskTolerance} risk tolerance.`;
    const report = await getAIResponse(prompt);
    return res.json({ report });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ─── Logistics Assistant ───
const logistics = async (req, res) => {
  try {
    const { origin, destination, cargoType, lang } = req.body;
    const prompt = lang === 'TR'
      ? `${origin} - ${destination} arası ${cargoType} tipi yük için lojistik analizi yap.`
      : `Analyze logistics route from ${origin} to ${destination} for ${cargoType}.`;
    const report = await getAIResponse(prompt);
    return res.json({ report });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ─── Accountant Agent ───
const accountant = async (req, res) => {
  try {
    const { query, lang } = req.body;
    const prompt = lang === 'TR'
      ? `Muhasebe danışmanı olarak şu soruyu cevapla: ${query}`
      : `As an accountant advisor, answer: ${query}`;
    const report = await getAIResponse(prompt);
    return res.json({ report });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ─── Get Reports ───
const getReports = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM ai_reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [req.user.userId]
    );
    return res.json(result.rows);
  } catch (err) {
    return res.json([]);
  }
};

module.exports = {
  chat,
  riskReport,
  partnerSearch,
  portfolio,
  logistics,
  accountant,
  getReports
};
