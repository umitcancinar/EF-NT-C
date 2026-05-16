const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../config/db');

const MODEL_NAME = 'gemini-3-flash-preview'; // Mayıs 2026 Güncel Sürüm

// Ortak AI İstek Fonksiyonu
const getAIResponse = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing in environment variables');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
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
exports.chat = async (req, res) => {
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
exports.riskReport = async (req, res) => {
  try {
    const { sector, newsContext, lang } = req.body;
    const prompt = lang === 'TR' 
      ? `Sen profesyonel bir finans ve sektör analistisin. 
         Sektör: ${sector}
         Güncel Bağlam/Haberler: ${newsContext}
         
         Lütfen şu başlıklar altında DERİN bir analiz yap:
         1. GÜNCEL HABER ANALİZİ: Verilen haberlerin bu sektöre doğrudan etkileri nelerdir?
         2. RİSK SEVİYESİ VE NEDENLERİ: Sektörün şu anki kırılganlıkları nelerdir?
         3. SEKTÖREL FIRSATLAR: Bu kriz veya haberlerden doğabilecek fırsatlar nelerdir?
         4. STRATEJİK TAVSİYELER: Bu sektördeki bir işletme sahibi veya yatırımcı şu an ne yapmalı?
         
         Yanıtı profesyonel bir rapor formatında, net ve aksiyona dökülebilir şekilde ver.`
      : `You are a professional financial and sectoral analyst.
         Sector: ${sector}
         News Context: ${newsContext}
         
         Please provide a DEEP analysis under these headings:
         1. CURRENT NEWS ANALYSIS: Direct impacts of given news on this sector.
         2. RISK LEVEL & REASONS: Current vulnerabilities.
         3. SECTORAL OPPORTUNITIES: Potential opportunities arising from this situation.
         4. STRATEGIC ADVICE: What should a business owner or investor do right now?
         
         Provide the response in a professional report format, clear and actionable.`;
         
    const report = await getAIResponse(prompt);
    
    // Raporu Kaydet
    if (req.user && req.user.userId) {
      await db.query(
        'INSERT INTO ai_reports (user_id, type, title, content) VALUES ($1, $2, $3, $4)',
        [req.user.userId, 'risk', `${sector} Analizi`, report]
      );
    }
    
    return res.json({ report });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ─── Partner Search ───
exports.partnerSearch = async (req, res) => {
  try {
    const { sector, city, budget, lang } = req.body;
    const prompt = lang === 'TR'
      ? `${sector} sektöründe ${city} şehrinde ${budget} bütçeyle potansiyel iş ortaklığı modelleri ve stratejik öneriler sun.`
      : `Suggest potential business partner models and strategies for ${sector} in ${city} with budget ${budget}.`;
    const report = await getAIResponse(prompt);
    
    if (req.user && req.user.userId) {
      await db.query(
        'INSERT INTO ai_reports (user_id, type, title, content) VALUES ($1, $2, $3, $4)',
        [req.user.userId, 'partner', `${sector} - ${city} Partner`, report]
      );
    }
    
    return res.json({ report });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ─── Portfolio Advisor ───
exports.portfolio = async (req, res) => {
  try {
    const { capital, riskTolerance, lang } = req.body;
    const prompt = lang === 'TR'
      ? `${capital} sermaye ve ${riskTolerance} risk toleransı ile güncel piyasa koşullarına göre detaylı portföy dağılımı tavsiyesi ver.`
      : `Give detailed portfolio allocation advice for ${capital} with ${riskTolerance} risk tolerance based on current market conditions.`;
    const report = await getAIResponse(prompt);
    
    if (req.user && req.user.userId) {
      await db.query(
        'INSERT INTO ai_reports (user_id, type, title, content) VALUES ($1, $2, $3, $4)',
        [req.user.userId, 'portfolio', `Portföy Analizi (${capital})`, report]
      );
    }
    
    return res.json({ report });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ─── Logistics Assistant ───
exports.logistics = async (req, res) => {
  try {
    const { origin, destination, cargoType, lang } = req.body;
    const prompt = lang === 'TR'
      ? `${origin} - ${destination} arası ${cargoType} tipi yük için maliyet, rota ve verimlilik analizi yap.`
      : `Analyze cost, route, and efficiency from ${origin} to ${destination} for ${cargoType}.`;
    const report = await getAIResponse(prompt);
    
    if (req.user && req.user.userId) {
      await db.query(
        'INSERT INTO ai_reports (user_id, type, title, content) VALUES ($1, $2, $3, $4)',
        [req.user.userId, 'logistics', `${origin} -> ${destination} Lojistik`, report]
      );
    }
    
    return res.json({ report });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ─── Accountant Agent ───
exports.accountant = async (req, res) => {
  try {
    const { query, lang } = req.body;
    const prompt = lang === 'TR'
      ? `Muhasebe ve vergi danışmanı olarak şu soruya mevzuata uygun detaylı cevap ver: ${query}`
      : `As an accounting and tax advisor, provide a detailed answer based on regulations: ${query}`;
    const report = await getAIResponse(prompt);
    
    if (req.user && req.user.userId) {
      await db.query(
        'INSERT INTO ai_reports (user_id, type, title, content) VALUES ($1, $2, $3, $4)',
        [req.user.userId, 'accountant', `Muhasebe Danışmanlığı`, report]
      );
    }
    
    return res.json({ report });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ─── Get Reports ───
exports.getReports = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM ai_reports WHERE user_id = $1 ORDER BY created_at DESC LIMIT 30',
      [req.user.userId]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('getReports error:', err);
    return res.json([]);
  }
};



