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
      ? `Sen EFİNTİC platformunun baş finans ve strateji danışmanısın. Aşağıda belirtilen sektör ve bağlama göre, en güncel ekonomik göstergeleri, küresel ve bölgesel risk faktörlerini ve piyasa trendlerini hesaba katarak SON DERECE DERİN, profesyonel ve kurumsal düzeyde bir Sektörel Risk ve Tavsiye Raporu oluştur.

Sektör: ${sector}
Kullanıcı Ek Bağlamı / İsteği: ${newsContext || 'Genel sektörel analiz ve risk tespiti.'}

Lütfen raporu tam olarak aşağıdaki başlıklar altında, detaylı alt paragraflar, maddeler ve profesyonel bir dille (markdown kullanarak, görsel olarak çok zengin ve okunaklı olacak şekilde) oluştur:

# 📊 ${sector.toUpperCase()} SEKTÖRÜ DETAYLI RİSK VE FIRSAT ANALİZİ

### 1. 🌐 KÜRESEL VE BÖLGESEL MAKROEKONOMİK DURUM
- Bu sektörün şu anki küresel ekonomik iklimden (enflasyon, faiz kararları, döviz kuru dalgalanmaları, jeopolitik riskler) nasıl etkilendiğini derinlemesine analiz et.
- Sektörün tedarik zinciri ve lojistik bağımlılıklarını değerlendir.

### 2. 📰 GÜNCEL GELİŞMELER & HABER ANALİZİ
- Sektörü doğrudan veya dolaylı olarak etkileyen son dakika gelişmelerini (varsa kullanıcının ek bağlamındaki haberleri) analiz et. Bu gelişmelerin kısa ve orta vadeli etkilerini açıkla.

### 3. 🚨 KRİTİK RİSK SEVİYESİ VE ZAAFİYETLER
- Sektörün şu anki **Risk Seviyesini** açıkça belirt (örn: Düşük, Orta, Yüksek, Kritik) ve bunun nedenlerini açıkla.
- Likidite riskleri, operasyonel riskler, yasal/regülatif riskler ve teknolojik dönüşüm risklerini ayrı ayrı ele al.

### 4. 📈 YENİ NESİL FIRSATLAR VE STRATEJİK TRENDLER
- Bu kriz veya değişim döneminde ortaya çıkan dijitalleşme, e-ticaret entegrasyonu, alternatif pazarlar ve yeni iş modelleri gibi fırsat alanlarını tanımla.

### 5. 💡 ÜST DÜZEY YÖNETİCİ & YATIRIMCI STRATEJİK TAVSİYELERİ
- Bu sektörde faaliyet gösteren bir işletme sahibi veya bu sektöre yatırım yapmayı düşünen bir yatırımcı için **aksiyona dökülebilir**, somut, finansal ve operasyonel yol haritası sun.

Yanıtı düz bir yapay zeka çıktısı gibi değil; Sanki McKinsey, BCG veya PwC tarafından hazırlanmış milyon dolarlık profesyonel bir rapor gibi yaz. Giriş seviyesi veya genelgeçer ifadelerden kaçın, sektöre has teknik terimleri ve somut örnekleri kullan.`
      : `You are the Chief Financial and Strategic Advisor of the EFİNTİC platform. Generate an EXTREMELY DEEP, professional, and corporate-level Sectoral Risk and Advisory Report for the following sector and context, taking into account the latest economic indicators, global and regional risk factors, and market trends.

Sector: ${sector}
User Additional Context / Request: ${newsContext || 'General sectoral analysis and risk assessment.'}

Please generate the report under these exact headings, with detailed paragraphs and a highly professional tone:

# 📊 ${sector.toUpperCase()} DETAILED RISK AND OPPORTUNITY ANALYSIS

### 1. 🌐 GLOBAL AND REGIONAL MACROECONOMIC SITUATION
- Deeply analyze how this sector is affected by the current global economic climate (inflation, interest rates, currency fluctuations, geopolitical risks).
- Evaluate supply chain and logistical dependencies.

### 2. 📰 LATEST DEVELOPMENTS & NEWS ANALYSIS
- Analyze recent developments affecting the sector. Explain short and medium-term impacts.

### 3. 🚨 CRITICAL RISK LEVEL & VULNERABILITIES
- Clearly state the current **Risk Level** (e.g. Low, Medium, High, Critical) and explain the reasons.
- Address liquidity, operational, regulatory, and technological risks separately.

### 4. 📈 NEXT-GEN OPPORTUNITIES & STRATEGIC TRENDS
- Define opportunity areas such as digitalization, e-commerce integration, alternative markets, and new business models.

### 5. 💡 EXECUTIVE & INVESTOR STRATEGIC ADVICE
- Provide an **actionable**, concrete financial and operational roadmap for a business owner or investor in this sector.

Write this report as if it were prepared by a top-tier consulting firm like McKinsey, BCG, or PwC. Avoid generic statements; use industry-specific terminology and concrete examples.`;
         
    const report = await getAIResponse(prompt);
    
    // Raporu Kaydet
    if (req.user && req.user.userId) {
      await db.query(
        'INSERT INTO ai_reports (user_id, type, title, content, result) VALUES ($1, $2, $3, $4, $4)',
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
        'INSERT INTO ai_reports (user_id, type, title, content, result) VALUES ($1, $2, $3, $4, $4)',
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
        'INSERT INTO ai_reports (user_id, type, title, content, result) VALUES ($1, $2, $3, $4, $4)',
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
        'INSERT INTO ai_reports (user_id, type, title, content, result) VALUES ($1, $2, $3, $4, $4)',
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
        'INSERT INTO ai_reports (user_id, type, title, content, result) VALUES ($1, $2, $3, $4, $4)',
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



