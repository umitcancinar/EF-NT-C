const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/latest', async (req, res) => {
  try {
    const apiKey = process.env.GNEWS_API_KEY || '775a2d658238686e0887103759902633';
    const response = await axios.get(`https://gnews.io/api/v4/top-headlines?category=business&lang=tr&country=tr&max=8&apikey=${apiKey}`, { timeout: 5000 });
    
    if (response.data && response.data.articles) {
      const articles = response.data.articles.map(a => ({
        title: a.title,
        description: a.description,
        source: a.source?.name || 'Unknown',
        url: a.url,
        image: a.image,
        publishedAt: a.publishedAt
      }));
      return res.json(articles);
    }
    throw new Error('No articles found');
  } catch (err) {
    console.error('News API Error:', err.message);
    res.json([
      {
        title: "Merkez Bankası Faiz Kararını Açıkladı",
        description: "TCMB, politika faizini sabit tutarak piyasalara net mesaj verdi. Analistler kararı değerlendirdi.",
        source: "Bloomberg HT",
        url: "https://www.bloomberght.com",
        image: null,
        publishedAt: new Date().toISOString()
      },
      {
        title: "Küresel Tedarik Zincirlerinde Yeni Dönüşüm",
        description: "Yapay zeka ve otomasyon teknolojileri, lojistik sektöründe maliyetleri %30 düşürüyor.",
        source: "Reuters",
        url: "https://www.reuters.com",
        image: null,
        publishedAt: new Date().toISOString()
      },
      {
        title: "E-Ticaret Sektörü 2026'da Rekor Büyüme",
        description: "Türkiye'de e-ticaret hacmi bu yıl 2 trilyon TL'yi geçmesi bekleniyor.",
        source: "Dünya Gazetesi",
        url: "https://www.dunya.com",
        image: null,
        publishedAt: new Date().toISOString()
      }
    ]);
  }
});

module.exports = router;
