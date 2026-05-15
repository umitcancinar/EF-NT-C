const { GoogleGenAI } = require('@google/genai');
const db = require('../config/db');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = 'gemini-2.0-flash';

// ─── Chatbot ───
exports.chat = async (req, res) => {
  try {
    const { message, history, lang } = req.body;
    const contents = [];
    if (history) {
      history.forEach(msg => {
        contents.push({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content || msg.text || '' }] });
      });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const systemInstruction = lang === 'TR'
      ? "Sen EFİNTİC platformunun AI asistanısın. E-ticaret ve finans konularında uzman bir danışmansın. Kullanıcılara yatırım, ticaret, lojistik, muhasebe ve sektörel analiz konularında yardımcı oluyorsun. Türkçe yanıt ver. Kısa ve öz cevaplar ver."
      : "You are EFİNTİC platform's AI assistant. You are an expert consultant in e-commerce and finance. You help users with investment, trade, logistics, accounting, and sectoral analysis. Respond in English. Keep answers concise.";

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: { systemInstruction: systemInstruction }
    });

    const aiMessage = result.text || "Yanıt üretilemedi.";
    
    if (req.user?.userId) {
      await db.query('INSERT INTO chat_history (user_id, role, content) VALUES ($1, $2, $3)', [req.user.userId, 'user', message]);
      await db.query('INSERT INTO chat_history (user_id, role, content) VALUES ($1, $2, $3)', [req.user.userId, 'assistant', aiMessage.substring(0, 2000)]);
    }
    res.json({ response: aiMessage });
  } catch (err) {
    console.error('Chat AI Error:', err);
    res.status(500).json({ error: `AI Error: ${err.message}` });
  }
};

// ─── Sektörel Risk & Tavsiye Raporu ───
exports.riskReport = async (req, res) => {
  try {
    const { sector, lang, newsContext } = req.body;
    
    // Get user profile for personalization
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [req.user.userId]);
    const user = userResult.rows[0];

    const prompt = lang === 'TR'
      ? `Sen bir sektörel risk analiz uzmanısın. Aşağıdaki bilgilere göre kapsamlı bir risk ve tavsiye raporu oluştur:

SEKTÖR: ${sector || user?.sector || 'Genel'}
KULLANICI ŞİRKETİ: ${user?.company_name || 'Belirtilmemiş'}
KONUM: ${user?.city || ''}, ${user?.country || 'Türkiye'}
SERMAYE ARALIĞI: ${user?.capital_range || 'Belirtilmemiş'}

GÜNCEL PİYASA BAĞLAMI:
${newsContext || 'Genel piyasa koşulları değerlendirilsin.'}

Lütfen şu başlıklar altında rapor oluştur:
1. 📊 GENEL RİSK SEVİYESİ (Düşük/Orta/Yüksek — emoji ile)
2. ⚠️ BAŞLICA RİSKLER (en az 3 madde)
3. 💡 FIRSATLAR (en az 3 madde)
4. 🎯 TAVSİYELER (en az 4 somut öneri)
5. 📈 KISA VADEDE BEKLENTİLER

Profesyonel ve detaylı bir analiz sun.`
      : `You are a sectoral risk analysis expert. Create a comprehensive risk and advisory report based on:

SECTOR: ${sector || user?.sector || 'General'}
USER COMPANY: ${user?.company_name || 'Not specified'}
LOCATION: ${user?.city || ''}, ${user?.country || 'Turkey'}
CAPITAL RANGE: ${user?.capital_range || 'Not specified'}

CURRENT MARKET CONTEXT:
${newsContext || 'Evaluate general market conditions.'}

Please create a report under these headings:
1. 📊 OVERALL RISK LEVEL (Low/Medium/High — with emoji)
2. ⚠️ KEY RISKS (at least 3 items)
3. 💡 OPPORTUNITIES (at least 3 items)
4. 🎯 RECOMMENDATIONS (at least 4 concrete suggestions)
5. 📈 SHORT-TERM OUTLOOK

Provide a professional and detailed analysis.`;

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const report = result.text || "Rapor oluşturulamadı.";
    
    await db.query(
      'INSERT INTO ai_reports (user_id, type, input_data, result) VALUES ($1, $2, $3, $4)',
      [req.user.userId, 'risk_report', JSON.stringify({ sector, newsContext }), report]
    );

    res.json({ report });
  } catch (err) {
    console.error('Risk Report Error:', err);
    res.status(500).json({ error: `Risk Report Error: ${err.message}` });
  }
};

// ─── İş Ortağı Bulma ───
exports.partnerSearch = async (req, res) => {
  try {
    const { sector, city, budget, lang } = req.body;
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [req.user.userId]);
    const user = userResult.rows[0];

    const prompt = lang === 'TR'
      ? `Sen bir iş ortağı eşleştirme uzmanısın. Aşağıdaki kriterlere göre en uygun potansiyel iş ortaklarını analiz et ve öner:

ARANAN SEKTÖR: ${sector || user?.sector || 'Genel'}
KONUM: ${city || user?.city || 'Türkiye geneli'}
BÜTÇE ARALIĞI: ${budget || user?.capital_range || 'Belirtilmemiş'}
KULLANICININ SEKTÖRÜ: ${user?.sector || 'Belirtilmemiş'}
DENEYİM: ${user?.experience || 'Belirtilmemiş'}

Lütfen 5 potansiyel iş ortağı profili oluştur. Her biri için:
1. 🏢 Şirket/İş Ortağı Profili (tip ve ölçek)
2. ⭐ Tahmini Uyum Puanı (1-10)
3. ✅ Neden Uygun (3 madde)
4. ⚠️ Dikkat Edilmesi Gerekenler
5. 📋 İşbirliği Önerileri

Gerçekçi ve uygulanabilir öneriler sun.`
      : `You are a business partner matching expert. Analyze and suggest the most suitable potential business partners based on:

TARGET SECTOR: ${sector || user?.sector || 'General'}
LOCATION: ${city || user?.city || 'Turkey-wide'}
BUDGET RANGE: ${budget || user?.capital_range || 'Not specified'}
USER'S SECTOR: ${user?.sector || 'Not specified'}
EXPERIENCE: ${user?.experience || 'Not specified'}

Please create 5 potential business partner profiles. For each:
1. 🏢 Company/Partner Profile (type and scale)
2. ⭐ Estimated Compatibility Score (1-10)
3. ✅ Why Suitable (3 points)
4. ⚠️ Points to Consider
5. 📋 Collaboration Suggestions

Provide realistic and actionable suggestions.`;

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const report = result.text || "Sonuç oluşturulamadı.";
    await db.query(
      'INSERT INTO ai_reports (user_id, type, input_data, result) VALUES ($1, $2, $3, $4)',
      [req.user.userId, 'partner_search', JSON.stringify({ sector, city, budget }), report]
    );

    res.json({ report });
  } catch (err) {
    console.error('Partner Search Error:', err);
    res.status(500).json({ error: `Partner Search Error: ${err.message}` });
  }
};

// ─── Portföy & Yatırım Önerisi ───
exports.portfolio = async (req, res) => {
  try {
    const { capital, riskTolerance, lang, marketContext } = req.body;
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [req.user.userId]);
    const user = userResult.rows[0];

    const prompt = lang === 'TR'
      ? `Sen bir yatırım danışmanısın. Aşağıdaki bilgilere göre kişiselleştirilmiş portföy ve yatırım önerileri oluştur:

SERMAYE: ${capital || user?.capital_range || 'Belirtilmemiş'}
RİSK TOLERANSI: ${riskTolerance || 'Orta'}
SEKTÖR: ${user?.sector || 'Genel'}
DENEYİM: ${user?.experience || 'Belirtilmemiş'}

PİYASA BAĞLAMI:
${marketContext || 'Güncel piyasa koşullarını değerlendir.'}

Lütfen şu başlıklar altında detaylı portföy önerisi sun:
1. 📊 PORTFÖY DAĞILIMI (yüzdelik dağılım tablosu)
   - Hisse Senedi %
   - Tahvil/Bono %
   - Altın/Emtia %
   - Döviz %
   - Kripto %
   - Nakit %

2. 🎯 KISA VADE STRATEJİSİ (0-3 ay)
3. 📈 ORTA VADE STRATEJİSİ (3-12 ay)
4. 🏦 UZUN VADE STRATEJİSİ (1-5 yıl)
5. ⚠️ RİSKLER VE UYARILAR
6. 💡 ÖZEL TAVSİYELER

YASAL UYARI: Bu yatırım tavsiyesi niteliğinde değildir.`
      : `You are an investment advisor. Create personalized portfolio and investment recommendations based on:

CAPITAL: ${capital || user?.capital_range || 'Not specified'}
RISK TOLERANCE: ${riskTolerance || 'Medium'}
SECTOR: ${user?.sector || 'General'}
EXPERIENCE: ${user?.experience || 'Not specified'}

MARKET CONTEXT:
${marketContext || 'Evaluate current market conditions.'}

Please provide a detailed portfolio recommendation under these headings:
1. 📊 PORTFOLIO ALLOCATION (percentage distribution table)
2. 🎯 SHORT-TERM STRATEGY (0-3 months)
3. 📈 MID-TERM STRATEGY (3-12 months)
4. 🏦 LONG-TERM STRATEGY (1-5 years)
5. ⚠️ RISKS AND WARNINGS
6. 💡 SPECIAL RECOMMENDATIONS

DISCLAIMER: This is not investment advice.`;

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const report = result.text || "Portföy önerisi oluşturulamadı.";
    await db.query(
      'INSERT INTO ai_reports (user_id, type, input_data, result) VALUES ($1, $2, $3, $4)',
      [req.user.userId, 'portfolio', JSON.stringify({ capital, riskTolerance }), report]
    );

    res.json({ report });
  } catch (err) {
    console.error('Portfolio Error:', err);
    res.status(500).json({ error: `Portfolio Error: ${err.message}` });
  }
};

// ─── Lojistik Asistanı ───
exports.logistics = async (req, res) => {
  try {
    const { origin, destination, cargoType, lang, marketContext } = req.body;

    const prompt = lang === 'TR'
      ? `Sen bir lojistik ve rota analiz uzmanısın. Aşağıdaki güzergah için kapsamlı bir risk ve öneri raporu oluştur:

BAŞLANGIÇ: ${origin}
VARIŞ: ${destination}
KARGO TİPİ: ${cargoType || 'Genel'}

PİYASA VE GÜNDEM BAĞLAMI:
${marketContext || 'Güncel koşulları değerlendir.'}

Lütfen şu başlıklar altında rapor oluştur:
1. 🗺️ ROTA ANALİZİ (önerilen güzergah)
2. ⚠️ RİSK DEĞERLENDİRMESİ
   - Güvenlik riskleri
   - Hava koşulları riskleri
   - Politik/ekonomik riskler
3. 💰 TAHMİNİ MALİYET ANALİZİ
4. 🔄 ALTERNATİF ROTALAR (en az 2)
5. ⏱️ TAHMİNİ SÜRE
6. 📋 ÖNERİLER VE DİKKAT EDİLMESİ GEREKENLER
7. 📦 KARGO GÜVENLİĞİ TAVSİYELERİ`
      : `You are a logistics and route analysis expert. Create a comprehensive risk and recommendation report for:

ORIGIN: ${origin}
DESTINATION: ${destination}
CARGO TYPE: ${cargoType || 'General'}

MARKET AND CURRENT CONTEXT:
${marketContext || 'Evaluate current conditions.'}

Please create a report under these headings:
1. 🗺️ ROUTE ANALYSIS (recommended route)
2. ⚠️ RISK ASSESSMENT
3. 💰 ESTIMATED COST ANALYSIS
4. 🔄 ALTERNATIVE ROUTES (at least 2)
5. ⏱️ ESTIMATED DURATION
6. 📋 RECOMMENDATIONS
7. 📦 CARGO SAFETY TIPS`;

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const report = result.text || "Lojistik raporu oluşturulamadı.";
    await db.query(
      'INSERT INTO ai_reports (user_id, type, input_data, result) VALUES ($1, $2, $3, $4)',
      [req.user.userId, 'logistics', JSON.stringify({ origin, destination, cargoType }), report]
    );

    res.json({ report });
  } catch (err) {
    console.error('Logistics Error:', err);
    res.status(500).json({ error: `Logistics Error: ${err.message}` });
  }
};

// ─── Muhasebeci Asistanı ───
exports.accountant = async (req, res) => {
  try {
    const { query, type, data, lang } = req.body;
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [req.user.userId]);
    const user = userResult.rows[0];

    // Fetch user's expenses and salary records for context
    const expensesResult = await db.query(
      'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC LIMIT 20', [req.user.userId]
    );
    const salaryResult = await db.query(
      'SELECT * FROM salary_records WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10', [req.user.userId]
    );

    const expensesSummary = expensesResult.rows.length > 0
      ? expensesResult.rows.map(e => `${e.date}: ${e.category} - ${e.description} - ${e.amount}₺`).join('\n')
      : 'Henüz gider kaydı yok';

    const salarySummary = salaryResult.rows.length > 0
      ? salaryResult.rows.map(s => `${s.month}: ${s.employee_name} - Brüt:${s.gross_salary}₺ Net:${s.net_salary}₺`).join('\n')
      : 'Henüz maaş kaydı yok';

    const prompt = lang === 'TR'
      ? `Sen bir muhasebe ve mali müşavir asistanısın. Türkiye vergi mevzuatına hakimsin.

KULLANICI BİLGİLERİ:
- Şirket: ${user?.company_name || 'Belirtilmemiş'}
- Sektör: ${user?.sector || 'Belirtilmemiş'}
- Sermaye: ${user?.capital_range || 'Belirtilmemiş'}

İSTEK TİPİ: ${type || 'genel'}
SORU/İSTEK: ${query || 'Genel mali analiz'}

MEVCUT GİDERLER:
${expensesSummary}

MAAŞ KAYITLARI:
${salarySummary}

EK VERİ:
${JSON.stringify(data || {})}

Lütfen profesyonel bir muhasebeci gibi detaylı yanıt ver. Beyanname takvimleri, vergi optimizasyonu, maaş hesaplamaları konularında yardımcı ol.`
      : `You are an accounting and financial advisor assistant. You are familiar with Turkish tax regulations.

USER INFO:
- Company: ${user?.company_name || 'Not specified'}
- Sector: ${user?.sector || 'Not specified'}
- Capital: ${user?.capital_range || 'Not specified'}

REQUEST TYPE: ${type || 'general'}
QUERY: ${query || 'General financial analysis'}

CURRENT EXPENSES:
${expensesSummary}

SALARY RECORDS:
${salarySummary}

ADDITIONAL DATA:
${JSON.stringify(data || {})}

Please respond like a professional accountant. Help with tax calendars, tax optimization, salary calculations.`;

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const report = result.text || "Muhasebe analizi oluşturulamadı.";
    await db.query(
      'INSERT INTO ai_reports (user_id, type, input_data, result) VALUES ($1, $2, $3, $4)',
      [req.user.userId, 'accountant', JSON.stringify({ query, type }), report]
    );

    res.json({ report });
  } catch (err) {
    console.error('Accountant Error:', err);
    res.status(500).json({ error: `Accountant Error: ${err.message}` });
  }
};

// ─── Get Reports ───
exports.getReports = async (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM ai_reports WHERE user_id = $1';
    const params = [req.user.userId];
    if (type) { query += ' AND type = $2'; params.push(type); }
    query += ' ORDER BY created_at DESC LIMIT 20';
    const reports = await db.query(query, params);
    res.json(reports.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching reports' });
  }
};
