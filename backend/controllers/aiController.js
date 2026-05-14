const { GoogleGenAI } = require('@google/genai');
const db = require('../config/db');

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = 'gemini-2.0-flash';

exports.chat = async (req, res) => {
  try {
    const { message, history, lang } = req.body;
    
    const contents = [];
    if (history && history.length > 0) {
      history.forEach(msg => {
         contents.push({ 
           role: msg.role === 'user' ? 'user' : 'model', 
           parts: [{ text: msg.content || msg.text }] 
         });
      });
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const systemInstruction = lang === 'TR' 
        ? "Sen Erken Teşhis AI adında bir sağlık danışmanısın. Kullanıcılara tıbbi konularda genel bilgiler verirsin, ancak her zaman kesin teşhis için bir doktora görünmeleri gerektiğini belirtirsin. Türkçe ve empatik bir dille yanıt ver."
        : "You are Early Diagnosis AI, a professional health advisor. You provide general health information and analysis based on user symptoms and data. Always emphasize that your advice is a preliminary screening and not a professional medical diagnosis, and suggest seeing a doctor for official results. Be empathetic and professional.";

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      systemInstruction: systemInstruction
    });

    const aiMessage = result.text;
    
    if (req.user && req.user.userId) {
      await db.query(
        'INSERT INTO analyses (user_id, type, content) VALUES ($1, $2, $3)',
        [req.user.userId, 'chat', `User: ${message}\nAI: ${aiMessage}`]
      );
    }

    res.json({ response: aiMessage });
  } catch (err) {
    console.error('Chat AI Error:', err);
    res.status(500).json({ error: 'Yapay zeka yanıt üretirken hata oluştu.' });
  }
};

exports.analyzeImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Lütfen bir fotoğraf yükleyin.' });

    const { symptoms, moodScore, lang } = req.body;
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    
    let prompt = lang === 'TR'
        ? "Bir sağlık uzmanı gibi bu görüntüyü analiz et. Cilt, göz, ağız veya saçla ilgili belirgin bir sorun veya semptom var mı?"
        : "Analyze this image as a health expert. Is there any visible issue or symptom related to skin, eyes, mouth, or hair?";
    
    if (symptoms) prompt += lang === 'TR' ? `\nEk semptomlar: ${symptoms}` : `\nAdditional symptoms: ${symptoms}`;
    if (moodScore) prompt += lang === 'TR' ? `\nMod puanı: ${moodScore}` : `\nMood score: ${moodScore}`;
    
    prompt += lang === 'TR'
        ? "\nTürkçe olarak detaylı raporla. Tıbbi tavsiye olmadığını belirt."
        : "\nReport in detailed English. Mention it's not medical advice.";

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        { 
          parts: [
            { inlineData: { data: base64Image, mimeType: mimeType } },
            { text: prompt }
          ] 
        }
      ]
    });

    const aiAnalysis = result.text;

    await db.query(
      'INSERT INTO analyses (user_id, type, content) VALUES ($1, $2, $3)',
      [req.user.userId, 'image_analysis', aiAnalysis]
    );

    res.json({ analysis: aiAnalysis });
  } catch (err) {
    console.error('Image AI Error:', err);
    res.status(500).json({ error: 'Görüntü analiz edilirken hata oluştu.' });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const { lang } = req.body;
    const healthResult = await db.query(
      'SELECT * FROM health_entries WHERE user_id = $1 AND date >= CURRENT_DATE - INTERVAL \'7 days\' ORDER BY date DESC',
      [req.user.userId]
    );
    
    if (healthResult.rows.length === 0) {
      return res.status(400).json({ error: lang === 'TR' ? 'Veri yok.' : 'No data.' });
    }

    const dataString = healthResult.rows.map(e => `[${new Date(e.date).toLocaleDateString()}] Pulse:${e.pulse}, BP:${e.blood_pressure}, Symptoms:${e.symptoms}`).join('\n');

    const prompt = lang === 'TR'
        ? `Haftalık sağlık raporu oluştur:\n${dataString}`
        : `Generate weekly health report:\n${dataString}`;

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const reportContent = result.text;
    const newReport = await db.query(
      'INSERT INTO analyses (user_id, type, content) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, 'report', reportContent]
    );

    res.json({ report: newReport.rows[0] });
  } catch (err) {
    console.error('Report AI Error:', err);
    res.status(500).json({ error: 'Hata.' });
  }
};

exports.generateDoctorSummary = async (req, res) => {
  try {
    const { lang } = req.body;
    const healthResult = await db.query(
      'SELECT * FROM health_entries WHERE user_id = $1 ORDER BY date DESC LIMIT 10',
      [req.user.userId]
    );
    
    if (healthResult.rows.length === 0) return res.status(400).json({ error: 'No data.' });

    const dataString = healthResult.rows.map(e => `[${new Date(e.date).toLocaleDateString()}] Pulse:${e.pulse}, Symptoms:${e.symptoms}`).join('\n');

    const prompt = lang === 'TR'
        ? `Doktor özeti oluştur:\n${dataString}`
        : `Generate doctor summary:\n${dataString}`;

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const summaryContent = result.text;
    const newReport = await db.query(
      'INSERT INTO analyses (user_id, type, content) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, 'doctor_summary', summaryContent]
    );

    res.json({ report: newReport.rows[0] });
  } catch (err) {
    console.error('Doctor Summary AI Error:', err);
    res.status(500).json({ error: 'Hata.' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const reports = await db.query(
      'SELECT * FROM analyses WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(reports.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Hata.' });
  }
};
