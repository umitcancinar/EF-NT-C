const i18n = {
    currentLang: localStorage.getItem('lang') || 'TR',
    translations: {
        TR: {
            nav_home:"Ana Sayfa",nav_how:"Nasıl Çalışır",nav_login:"Giriş Yap",nav_register:"Kayıt Ol",
            hero_title:"E-Ticaret Şirketinizin<br>Tüm Finansal Çözümleri<br>Tek Adreste.",
            hero_desc:"Yapay zeka destekli sektörel analiz, piyasa takibi, akıllı iş ortağı bulma ve portföy yönetimi platformu.",
            btn_start:"Hemen Başlayın",btn_login:"Giriş Yap",btn_register:"Kayıt Ol",
            feat_1_title:"Sektörel Risk Raporu",feat_1_desc:"AI, güncel haberleri ve piyasa verilerini analiz ederek sektörünüze özel risk ve fırsat raporu oluşturur.",
            feat_2_title:"Akıllı İş Ortağı Bulma",feat_2_desc:"Sektörünüzdeki en uygun iş ortaklarını yapay zeka ile keşfedin, uyumluluk analizi alın.",
            feat_3_title:"Portföy & Yatırım",feat_3_desc:"Sermayenizi güncel piyasa koşullarına göre optimize edin, kişiselleştirilmiş yatırım önerileri alın.",
            how_title:"Nasıl Çalışır?",
            step_1_title:"Kayıt Olun",step_1_desc:"Hesap oluşturun ve sektör bilgilerinizi girin.",
            step_2_title:"Sektörünüzü Seçin",step_2_desc:"AI size özel analizler için profilinizi tamamlayın.",
            step_3_title:"AI Analizlerini Alın",step_3_desc:"Risk raporu, iş ortağı, yatırım önerisi ve daha fazlası.",
            news_title:"📰 Son Dakika Finans Haberleri",
            cta_title:"Hemen Ücretsiz Hesap Oluşturun",
            footer_copy:"© 2026 EFİNTİC — Tüm hakları saklıdır.",
            footer_dev:"Geliştirici ile iletişime geçmek için tıkla",
            login_title:"EFİNTİC",login_desc:"E-Ticaret & Finans Platformunuza giriş yapın",
            reg_title:"Hesap Oluştur",reg_desc:"Geleceğin ticaret platformuna katılın",
            lbl_username:"Kullanıcı Adı",lbl_email:"E-posta",lbl_password:"Şifre",
            already_acc:"Zaten hesabınız var mı?",no_acc:"Hesabınız yok mu?",
            welcome_user:"Merhaba, ",
            logo_text:"EFİNTİC",
            nav_dashboard:"Dashboard",nav_risk:"Sektörel Risk Raporu",nav_partner:"İş Ortağı Bul",
            nav_portfolio:"Portföy & Yatırım",nav_logistics:"Lojistik Asistanı",nav_accountant:"Muhasebeci",nav_profile:"Profil",
            modal_welcome_title:"Hoş Geldiniz! 🚀",modal_welcome_desc:"Platformu kişiselleştirmek için bilgilerinizi tamamlayın.",
            lbl_fullname:"Ad Soyad",lbl_company:"Şirket Adı",lbl_sector:"Sektör",
            lbl_capital:"Sermaye Aralığı",lbl_country:"Ülke",lbl_city:"Şehir",
            lbl_experience:"Sektörünüz",btn_complete_profile:"Profili Tamamla",
            // Dashboard
            dash_title:"Dashboard",dash_desc:"Piyasa özeti ve hızlı erişim.",
            stat_reports:"Toplam Rapor",stat_expenses:"Aylık Gider",stat_sector:"Sektör",stat_risk:"Risk Seviyesi",
            // Risk Report
            risk_title:"Sektörel Risk & Tavsiye Raporu",risk_desc:"AI, güncel haberleri ve piyasayı analiz ederek sektörünüze özel risk raporu oluşturur.",
            risk_sector_label:"Sektör",risk_context_label:"Ek Bağlam (opsiyonel)",risk_context_ph:"Özel dikkat edilmesini istediğiniz konular...",
            btn_generate_report:"Rapor Oluştur",
            // Partner
            partner_title:"Akıllı İş Ortağı Bulma",partner_desc:"AI, sektörünüzdeki en uygun potansiyel iş ortaklarını analiz eder.",
            partner_city_label:"Hedef Şehir/Bölge",partner_budget_label:"Bütçe Aralığı",
            btn_find_partner:"İş Ortağı Ara",
            // Portfolio
            portfolio_title:"Portföy & Yatırım Önerisi",portfolio_desc:"AI, sermayenizi güncel piyasa koşullarına göre optimize eder.",
            portfolio_capital_label:"Sermaye (₺)",portfolio_risk_label:"Risk Toleransı",
            risk_low:"Düşük",risk_medium:"Orta",risk_high:"Yüksek",
            btn_get_portfolio:"Portföy Önerisi Al",
            // Logistics
            logistics_title:"Lojistik Asistanı",logistics_desc:"AI, rota analizi yaparak risk ve maliyet değerlendirmesi sunar.",
            logistics_origin:"Başlangıç Noktası",logistics_dest:"Varış Noktası",logistics_cargo:"Kargo Tipi",
            btn_analyze_route:"Rota Analizi Yap",
            // Accountant
            acc_title:"Muhasebeci Asistanı",acc_desc:"Beyanname takibi, maaş hesaplama, gider yönetimi ve AI mali analiz.",
            tab_declarations:"Beyannameler",tab_salary:"Maaş Hesaplama",tab_expenses:"Giderler",tab_ai_analysis:"AI Analizi",
            acc_add_expense:"Gider Ekle",acc_category:"Kategori",acc_description:"Açıklama",acc_amount:"Tutar (₺)",acc_date:"Tarih",
            acc_employee:"Çalışan Adı",acc_gross:"Brüt Maaş (₺)",acc_calc_salary:"Hesapla",
            acc_query_label:"Sorunuz",acc_query_ph:"Mali danışmanlık sorunuzu yazın...",btn_ask_accountant:"Mali Analiz Al",
            // Profile
            profile_title:"Profil Bilgileri",profile_desc:"Kişisel ve iş bilgilerinizi buradan güncelleyebilirsiniz.",
            btn_update:"Güncelle",lbl_current_pass:"Mevcut Şifre",lbl_new_pass:"Yeni Şifre",btn_change_pass:"Şifreyi Değiştir",
            // Chatbot
            chat_title:"EFİNTİC Asistan",chat_status:"Çevrimiçi | Gemini AI",
            chat_placeholder:"Mesajınızı yazın...",
            chat_greet_1:"Merhaba! 👋 Ben EFİNTİC AI asistanıyım. E-ticaret ve finans konularında yardımcı olabilirim.",
            chat_greet_2:"Sektörel analiz, yatırım, lojistik veya muhasebe hakkında soru sorabilirsiniz.",
            chat_error:"Bağlantı hatası oluştu. Lütfen tekrar deneyin.",
            chat_default_resp:"Üzgünüm, şu an yanıt veremiyorum.",
            btn_how_video:"Nasıl Kullanılır?",
            loading_1:"Veriler analiz ediliyor...",loading_2:"AI modeli çalışıyor...",loading_3:"Rapor hazırlanıyor...",loading_4:"Sonuçlar derleniyor...",
            // Declarations
            decl_title:"Yaklaşan Beyanname Takvimleri",
            decl_kdv:"KDV Beyannamesi",decl_kdv_date:"Her ayın 28'i",
            decl_muhtasar:"Muhtasar Beyanname",decl_muhtasar_date:"Her ayın 26'sı",
            decl_gelir:"Gelir Vergisi",decl_gelir_date:"Mart & Temmuz",
            decl_kurumlar:"Kurumlar Vergisi",decl_kurumlar_date:"Nisan ayı",
        },
        EN: {
            nav_home:"Home",nav_how:"How it Works",nav_login:"Login",nav_register:"Register",
            hero_title:"All Financial Solutions<br>for Your E-Commerce<br>in One Place.",
            hero_desc:"AI-powered sectoral analysis, market tracking, smart partner matching, and portfolio management platform.",
            btn_start:"Get Started",btn_login:"Login",btn_register:"Register",
            feat_1_title:"Sectoral Risk Report",feat_1_desc:"AI analyzes current news and market data to create sector-specific risk and opportunity reports.",
            feat_2_title:"Smart Partner Matching",feat_2_desc:"Discover the most suitable business partners in your sector with AI-powered compatibility analysis.",
            feat_3_title:"Portfolio & Investment",feat_3_desc:"Optimize your capital based on current market conditions and get personalized investment recommendations.",
            how_title:"How it Works?",
            step_1_title:"Sign Up",step_1_desc:"Create an account and enter your sector information.",
            step_2_title:"Select Your Sector",step_2_desc:"Complete your profile for personalized AI analysis.",
            step_3_title:"Get AI Analysis",step_3_desc:"Risk reports, partner matching, investment advice, and more.",
            news_title:"📰 Breaking Finance News",
            cta_title:"Create a Free Account Now",
            footer_copy:"© 2026 EFİNTİC — All rights reserved.",
            footer_dev:"Click to contact the developer",
            login_title:"EFİNTİC",login_desc:"Log in to your E-Commerce & Finance Platform",
            reg_title:"Create Account",reg_desc:"Join the future of trading platforms",
            lbl_username:"Username",lbl_email:"E-mail",lbl_password:"Password",
            already_acc:"Already have an account?",no_acc:"Don't have an account?",
            welcome_user:"Hello, ",
            logo_text:"EFİNTİC",
            nav_dashboard:"Dashboard",nav_risk:"Sectoral Risk Report",nav_partner:"Find Partner",
            nav_portfolio:"Portfolio & Investment",nav_logistics:"Logistics Assistant",nav_accountant:"Accountant",nav_profile:"Profile",
            modal_welcome_title:"Welcome! 🚀",modal_welcome_desc:"Complete your information to personalize the platform.",
            lbl_fullname:"Full Name",lbl_company:"Company Name",lbl_sector:"Sector",
            lbl_capital:"Capital Range",lbl_country:"Country",lbl_city:"City",
            lbl_experience:"Your Sector",btn_complete_profile:"Complete Profile",
            dash_title:"Dashboard",dash_desc:"Market summary and quick access.",
            stat_reports:"Total Reports",stat_expenses:"Monthly Expenses",stat_sector:"Sector",stat_risk:"Risk Level",
            risk_title:"Sectoral Risk & Advisory Report",risk_desc:"AI analyzes news and markets to create sector-specific risk reports.",
            risk_sector_label:"Sector",risk_context_label:"Additional Context (optional)",risk_context_ph:"Topics you want special attention on...",
            btn_generate_report:"Generate Report",
            partner_title:"Smart Partner Matching",partner_desc:"AI analyzes the most suitable potential business partners in your sector.",
            partner_city_label:"Target City/Region",partner_budget_label:"Budget Range",
            btn_find_partner:"Search Partners",
            portfolio_title:"Portfolio & Investment Advice",portfolio_desc:"AI optimizes your capital based on current market conditions.",
            portfolio_capital_label:"Capital (₺)",portfolio_risk_label:"Risk Tolerance",
            risk_low:"Low",risk_medium:"Medium",risk_high:"High",
            btn_get_portfolio:"Get Portfolio Advice",
            logistics_title:"Logistics Assistant",logistics_desc:"AI provides route analysis with risk and cost evaluation.",
            logistics_origin:"Origin Point",logistics_dest:"Destination Point",logistics_cargo:"Cargo Type",
            btn_analyze_route:"Analyze Route",
            acc_title:"Accountant Assistant",acc_desc:"Tax declaration tracking, salary calculation, expense management, and AI financial analysis.",
            tab_declarations:"Declarations",tab_salary:"Salary Calc",tab_expenses:"Expenses",tab_ai_analysis:"AI Analysis",
            acc_add_expense:"Add Expense",acc_category:"Category",acc_description:"Description",acc_amount:"Amount (₺)",acc_date:"Date",
            acc_employee:"Employee Name",acc_gross:"Gross Salary (₺)",acc_calc_salary:"Calculate",
            acc_query_label:"Your Question",acc_query_ph:"Write your financial consulting question...",btn_ask_accountant:"Get Financial Analysis",
            profile_title:"Profile Information",profile_desc:"You can update your personal and business information here.",
            btn_update:"Update",lbl_current_pass:"Current Password",lbl_new_pass:"New Password",btn_change_pass:"Change Password",
            chat_title:"EFİNTİC Assistant",chat_status:"Online | Gemini AI",
            chat_placeholder:"Type your message...",
            chat_greet_1:"Hello! 👋 I'm EFİNTİC AI assistant. I can help with e-commerce and finance topics.",
            chat_greet_2:"You can ask about sectoral analysis, investment, logistics, or accounting.",
            chat_error:"Connection error occurred. Please try again.",
            chat_default_resp:"Sorry, I cannot respond right now.",
            btn_how_video:"How to Use?",
            loading_1:"Analyzing data...",loading_2:"AI model working...",loading_3:"Preparing report...",loading_4:"Compiling results...",
            decl_title:"Upcoming Tax Declaration Calendar",
            decl_kdv:"VAT Declaration",decl_kdv_date:"28th of each month",
            decl_muhtasar:"Withholding Tax",decl_muhtasar_date:"26th of each month",
            decl_gelir:"Income Tax",decl_gelir_date:"March & July",
            decl_kurumlar:"Corporate Tax",decl_kurumlar_date:"April",
        }
    },
    toggle() {
        this.currentLang = this.currentLang === 'TR' ? 'EN' : 'TR';
        localStorage.setItem('lang', this.currentLang);
        this.apply();
        const flag = document.getElementById('lang-flag');
        if (flag) flag.textContent = this.currentLang === 'TR' ? '🇹🇷' : '🇬🇧';
        document.getElementById('current-lang').textContent = this.currentLang;
        window.dispatchEvent(new CustomEvent('langChanged', { detail: this.currentLang }));
    },
    apply() {
        const t = this.translations[this.currentLang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.hasAttribute('placeholder')) {
                    el.placeholder = t[key];
                } else {
                    el.innerHTML = t[key];
                }
            }
        });
        document.getElementById('current-lang').textContent = this.currentLang;
        const flag = document.getElementById('lang-flag');
        if (flag) flag.textContent = this.currentLang === 'TR' ? '🇹🇷' : '🇬🇧';
    }
};
