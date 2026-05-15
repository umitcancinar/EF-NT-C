const express = require('express');
const router = express.Router();

// ─── News (Using free RSS/API proxy) ───
router.get('/latest', async (req, res) => {
  try {
    // Use GNews API (free tier: 100 req/day)
    const response = await fetch('https://gnews.io/api/v4/top-headlines?category=business&lang=tr&country=tr&max=8&apikey=demo');
    
    if (response && response.ok) {
      const data = await response.json();
      if (data && data.articles) {
        const articles = data.articles.map(a => ({
          title: a.title,
          description: a.description,
          source: a.source?.name || 'Unknown',
          url: a.url,
          image: a.image,
          publishedAt: a.publishedAt
        }));
        return res.json(articles);
      }
    }
    throw new Error('Fallback needed');
  } catch (err) {
    console.log('News API error, using fallback');
    // Fallback mock business news
    res.json([
      {
        title: "Merkez Bankası Faiz Kararını Açıkladı",
        description: "TCMB, politika faizini sabit tutarak piyasalara net mesaj verdi. Analistler kararı değerlendirdi.",
        source: "Bloomberg HT",
        url: "#",
        image: null,
        publishedAt: new Date().toISOString()
      },
      {
        title: "Küresel Tedarik Zincirlerinde Yeni Dönüşüm",
        description: "Yapay zeka ve otomasyon teknolojileri, lojistik sektöründe maliyetleri %30 düşürüyor.",
        source: "Reuters",
        url: "#",
        image: null,
        publishedAt: new Date().toISOString()
      },
      {
        title: "E-Ticaret Sektörü 2026'da Rekor Büyüme",
        description: "Türkiye'de e-ticaret hacmi bu yıl 2 trilyon TL'yi geçmesi bekleniyor.",
        source: "Dünya Gazetesi",
        url: "#",
        image: null,
        publishedAt: new Date().toISOString()
      },
      {
        title: "Altın Fiyatları Tarihi Zirveye Yaklaşıyor",
        description: "Ons altın 3,300 dolar seviyesini test ederken, yatırımcılar güvenli liman arayışında.",
        source: "AA Finans",
        url: "#",
        image: null,
        publishedAt: new Date().toISOString()
      },
      {
        title: "Döviz Piyasalarında Volatilite Artıyor",
        description: "Fed'in faiz kararı sonrası dolar endeksi hareketlendi, gelişen ülke paraları baskı altında.",
        source: "ForexLive",
        url: "#",
        image: null,
        publishedAt: new Date().toISOString()
      },
      {
        title: "Kripto Piyasasında Kurumsal Yatırımlar Artıyor",
        description: "Bitcoin ETF'lerine bu hafta 2.3 milyar dolar net giriş kaydedildi.",
        source: "CoinDesk",
        url: "#",
        image: null,
        publishedAt: new Date().toISOString()
      }
    ]);
  }
});

module.exports = router;
