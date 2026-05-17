// ═══ EFİNTİC VIEW TEMPLATES ═══
const views = {
  landing(t) {
    return `<div class="view-section">
      <div class="landing-container">
        <div class="hero">
          <div class="hero-brand-badge">
            <span class="badge-glow-dot"></span>
            <span>EFİNTİC INTELLECT</span>
          </div>
          <h1 class="hero-title">
            <span class="hero-subtitle">${i18n.currentLang === 'TR' ? 'E-Ticaret & Finans' : 'E-Commerce & Finance'}</span>
            <span class="hero-main-title">${t.hero_title}</span>
          </h1>
          <p class="hero-desc">${t.hero_desc}</p>
          <div class="hero-actions">
            <a href="#register" class="btn-apple-primary">
              <span>${t.btn_start}</span>
              <i class='bx bx-right-arrow-alt'></i>
            </a>
            <a href="#how-it-works-scroll" class="btn-apple-secondary">
              <span>${i18n.currentLang === 'TR' ? 'Sistemi Keşfet' : 'Explore System'}</span>
              <i class='bx bx-chevron-right'></i>
            </a>
          </div>
        </div>
        
        <div class="features-grid">
          <div class="feature-card glass-panel">
            <div class="feat-icon-container" style="background: linear-gradient(135deg, rgba(0, 113, 227, 0.12), rgba(88, 86, 214, 0.12))">
              <i class='bx bx-bar-chart-alt-2' style="color: #0071e3"></i>
            </div>
            <h3>${t.feat_1_title}</h3>
            <p>${t.feat_1_desc}</p>
            <div class="card-arrow"><i class='bx bx-chevron-right'></i></div>
          </div>
          
          <div class="feature-card glass-panel">
            <div class="feat-icon-container" style="background: linear-gradient(135deg, rgba(255, 149, 0, 0.12), rgba(255, 59, 48, 0.12))">
              <i class='bx bx-group' style="color: #ff9500"></i>
            </div>
            <h3>${t.feat_2_title}</h3>
            <p>${t.feat_2_desc}</p>
            <div class="card-arrow"><i class='bx bx-chevron-right'></i></div>
          </div>
          
          <div class="feature-card glass-panel">
            <div class="feat-icon-container" style="background: linear-gradient(135deg, rgba(52, 199, 89, 0.12), rgba(48, 209, 88, 0.12))">
              <i class='bx bx-wallet' style="color: #34c759"></i>
            </div>
            <h3>${t.feat_3_title}</h3>
            <p>${t.feat_3_desc}</p>
            <div class="card-arrow"><i class='bx bx-chevron-right'></i></div>
          </div>
        </div>
        
        <div class="how-it-works" id="how-it-works-section">
          <h2 class="section-title">${t.how_title}</h2>
          <div class="steps">
            <div class="step">
              <div class="step-num">01</div>
              <h3>${t.step_1_title}</h3>
              <p>${t.step_1_desc}</p>
            </div>
            <div class="step">
              <div class="step-num">02</div>
              <h3>${t.step_2_title}</h3>
              <p>${t.step_2_desc}</p>
            </div>
            <div class="step">
              <div class="step-num">03</div>
              <h3>${t.step_3_title}</h3>
              <p>${t.step_3_desc}</p>
            </div>
          </div>
        </div>
        
        <div class="news-section">
          <h2 class="section-title">${t.news_title}</h2>
          <div class="news-grid" id="news-grid">
            <div class="news-card glass-panel">
              <h4>Yükleniyor...</h4>
              <p>Haberler getiriliyor.</p>
            </div>
          </div>
        </div>
        
        <div class="cta-section">
          <h2>${t.cta_title}</h2>
          <a href="#register" class="btn-apple-primary" style="margin: 0 auto; width: fit-content; padding: 14px 36px;">
            <span>${t.btn_start}</span>
            <i class='bx bx-right-arrow-alt'></i>
          </a>
        </div>
        
        <div class="landing-footer">
          <p>${t.footer_copy}</p>
          <a href="https://umitcancinar.me" target="_blank" class="dev-link">${t.footer_dev}</a>
        </div>
      </div>
    </div>`;
  },

login(t) {
return `<div class="auth-container"><div class="auth-box glass-panel">
  <h1 data-i18n="login_title">${t.login_title}</h1>
  <p data-i18n="login_desc">${t.login_desc}</p>
  <form id="login-form">
    <div class="form-group"><label data-i18n="lbl_email">${t.lbl_email}</label><input type="email" id="login-email" class="form-control" required></div>
    <div class="form-group"><label data-i18n="lbl_password">${t.lbl_password}</label><input type="password" id="login-password" class="form-control" required></div>
    <button type="submit" class="btn btn-primary" data-i18n="btn_login">${t.btn_login}</button>
  </form>
  <p class="toggle-auth"><span data-i18n="no_acc">${t.no_acc}</span> <a href="#register" data-i18n="nav_register">${t.nav_register}</a></p>
</div></div>`;
},

register(t) {
return `<div class="auth-container"><div class="auth-box glass-panel">
  <h1 data-i18n="reg_title">${t.reg_title}</h1>
  <p data-i18n="reg_desc">${t.reg_desc}</p>
  <form id="register-form">
    <div class="form-group"><label data-i18n="lbl_username">${t.lbl_username}</label><input type="text" id="reg-username" class="form-control" required></div>
    <div class="form-group"><label data-i18n="lbl_email">${t.lbl_email}</label><input type="email" id="reg-email" class="form-control" required></div>
    <div class="form-group"><label data-i18n="lbl_password">${t.lbl_password}</label><input type="password" id="reg-password" class="form-control" required minlength="6"></div>
    <button type="submit" class="btn btn-primary" data-i18n="btn_register">${t.btn_register}</button>
  </form>
  <p class="toggle-auth"><span data-i18n="already_acc">${t.already_acc}</span> <a href="#login" data-i18n="nav_login">${t.nav_login}</a></p>
</div></div>`;
},

dashboard(t, user) {
return `<div class="view-section"><div class="page-header"><h1 data-i18n="dash_title">${t.dash_title}</h1><p data-i18n="dash_desc">${t.dash_desc}</p></div>
<div class="dashboard-grid">
  <div class="col-3 card glass-panel"><div class="stat-card"><div class="stat-icon" style="background:linear-gradient(135deg,#0071e3,#5856d6)"><i class='bx bx-file'></i></div><div class="stat-info"><h3 data-i18n="stat_reports">${t.stat_reports}</h3><p id="stat-reports-count">0</p></div></div></div>
  <div class="col-3 card glass-panel"><div class="stat-card"><div class="stat-icon" style="background:linear-gradient(135deg,#ff3b30,#ff9500)"><i class='bx bx-money'></i></div><div class="stat-info"><h3 data-i18n="stat_expenses">${t.stat_expenses}</h3><p id="stat-expenses-total">0₺</p></div></div></div>
  <div class="col-3 card glass-panel"><div class="stat-card"><div class="stat-icon" style="background:linear-gradient(135deg,#34c759,#30d158)"><i class='bx bx-store'></i></div><div class="stat-info"><h3 data-i18n="stat_sector">${t.stat_sector}</h3><p id="stat-sector-name">${user?.sector||'—'}</p></div></div></div>
  <div class="col-3 card glass-panel"><div class="stat-card"><div class="stat-icon" style="background:linear-gradient(135deg,#ffcc00,#ff9500)"><i class='bx bx-shield'></i></div><div class="stat-info"><h3 data-i18n="stat_risk">${t.stat_risk}</h3><p id="stat-risk-level">—</p></div></div></div>
  <div class="col-12 card glass-panel"><h3 style="margin-bottom:16px" data-i18n="news_title">${t.news_title}</h3><div class="news-grid" id="dash-news-grid"><p style="color:var(--text-muted)">Yükleniyor...</p></div></div>
</div></div>`;
},

riskReport(t) {
const sectorOpts = ['e-ticaret','lojistik','gida','tekstil','teknoloji','insaat','enerji','turizm','saglik','finans','tarim','diger'].map(s=>`<option value="${s}">${s.charAt(0).toUpperCase()+s.slice(1)}</option>`).join('');
return `<div class="view-section feature-page"><div class="page-header"><div class="page-icon" style="background:linear-gradient(135deg,#0071e3,#5856d6)"><i class='bx bx-bar-chart-alt-2'></i></div><div><h1 data-i18n="risk_title">${t.risk_title}</h1><p data-i18n="risk_desc">${t.risk_desc}</p></div></div>
<div class="ai-form">
  <div class="form-group"><label data-i18n="risk_sector_label">${t.risk_sector_label}</label><select id="risk-sector" class="form-control">${sectorOpts}</select></div>
  <div class="form-group"><label data-i18n="risk_context_label">${t.risk_context_label}</label><textarea id="risk-context" class="form-control" rows="3" placeholder="${t.risk_context_ph}" data-i18n="risk_context_ph"></textarea></div>
  <button class="btn btn-primary" id="btn-risk-report" data-i18n="btn_generate_report">${t.btn_generate_report}</button>
</div>
<div class="ai-result hidden" id="risk-result"></div></div>`;
},

partnerSearch(t) {
return `<div class="view-section feature-page"><div class="page-header"><div class="page-icon" style="background:linear-gradient(135deg,#ff9500,#ff3b30)"><i class='bx bx-group'></i></div><div><h1 data-i18n="partner_title">${t.partner_title}</h1><p data-i18n="partner_desc">${t.partner_desc}</p></div></div>
<div class="ai-form">
  <div class="form-row"><div class="form-group"><label data-i18n="risk_sector_label">${t.risk_sector_label}</label><input type="text" id="partner-sector" class="form-control"></div>
  <div class="form-group"><label data-i18n="partner_city_label">${t.partner_city_label}</label><input type="text" id="partner-city" class="form-control"></div></div>
  <div class="form-group"><label data-i18n="partner_budget_label">${t.partner_budget_label}</label><input type="text" id="partner-budget" class="form-control" placeholder="Örn: 100.000 - 500.000 ₺"></div>
  <button class="btn btn-primary" id="btn-partner-search" data-i18n="btn_find_partner">${t.btn_find_partner}</button>
</div>
<div class="ai-result hidden" id="partner-result"></div></div>`;
},

portfolio(t) {
return `<div class="view-section feature-page"><div class="page-header"><div class="page-icon" style="background:linear-gradient(135deg,#34c759,#30d158)"><i class='bx bx-wallet'></i></div><div><h1 data-i18n="portfolio_title">${t.portfolio_title}</h1><p data-i18n="portfolio_desc">${t.portfolio_desc}</p></div></div>
<div class="ai-form">
  <div class="form-row"><div class="form-group"><label data-i18n="portfolio_capital_label">${t.portfolio_capital_label}</label><input type="text" id="portfolio-capital" class="form-control" placeholder="Örn: 500000"></div>
  <div class="form-group"><label data-i18n="portfolio_risk_label">${t.portfolio_risk_label}</label><select id="portfolio-risk" class="form-control"><option value="low">${t.risk_low}</option><option value="medium" selected>${t.risk_medium}</option><option value="high">${t.risk_high}</option></select></div></div>
  <button class="btn btn-primary" id="btn-portfolio" data-i18n="btn_get_portfolio">${t.btn_get_portfolio}</button>
</div>
<div class="ai-result hidden" id="portfolio-result"></div></div>`;
},

logistics(t) {
return `<div class="view-section feature-page"><div class="page-header"><div class="page-icon" style="background:linear-gradient(135deg,#5856d6,#af52de)"><i class='bx bx-package'></i></div><div><h1 data-i18n="logistics_title">${t.logistics_title}</h1><p data-i18n="logistics_desc">${t.logistics_desc}</p></div></div>
<div class="ai-form">
  <div class="form-row"><div class="form-group"><label data-i18n="logistics_origin">${t.logistics_origin}</label><input type="text" id="log-origin" class="form-control" placeholder="Örn: İstanbul"></div>
  <div class="form-group"><label data-i18n="logistics_dest">${t.logistics_dest}</label><input type="text" id="log-dest" class="form-control" placeholder="Örn: Berlin"></div></div>
  <div class="form-group"><label data-i18n="logistics_cargo">${t.logistics_cargo}</label><input type="text" id="log-cargo" class="form-control" placeholder="Örn: Tekstil, Elektronik"></div>
  <button class="btn btn-primary" id="btn-logistics" data-i18n="btn_analyze_route">${t.btn_analyze_route}</button>
</div>
<div class="ai-result hidden" id="logistics-result"></div></div>`;
},

accountant(t) {
return `<div class="view-section feature-page"><div class="page-header"><div class="page-icon" style="background:linear-gradient(135deg,#ff9500,#ffcc00)"><i class='bx bx-calculator'></i></div><div><h1 data-i18n="acc_title">${t.acc_title}</h1><p data-i18n="acc_desc">${t.acc_desc}</p></div></div>
<div class="tab-bar">
  <button class="tab-btn active" data-tab="declarations" data-i18n="tab_declarations">${t.tab_declarations}</button>
  <button class="tab-btn" data-tab="salary" data-i18n="tab_salary">${t.tab_salary}</button>
  <button class="tab-btn" data-tab="expenses" data-i18n="tab_expenses">${t.tab_expenses}</button>
  <button class="tab-btn" data-tab="ai-analysis" data-i18n="tab_ai_analysis">${t.tab_ai_analysis}</button>
</div>
<div class="tab-content active" id="tab-declarations">
  <h3 data-i18n="decl_title">${t.decl_title}</h3>
  <div class="dashboard-grid" style="margin-top:16px">
    <div class="col-6 card glass-panel"><div class="stat-card"><div class="stat-icon" style="background:linear-gradient(135deg,#ff3b30,#ff9500)"><i class='bx bx-receipt'></i></div><div class="stat-info"><h3 data-i18n="decl_kdv">${t.decl_kdv}</h3><p style="font-size:14px" data-i18n="decl_kdv_date">${t.decl_kdv_date}</p></div></div></div>
    <div class="col-6 card glass-panel"><div class="stat-card"><div class="stat-icon" style="background:linear-gradient(135deg,#5856d6,#af52de)"><i class='bx bx-receipt'></i></div><div class="stat-info"><h3 data-i18n="decl_muhtasar">${t.decl_muhtasar}</h3><p style="font-size:14px" data-i18n="decl_muhtasar_date">${t.decl_muhtasar_date}</p></div></div></div>
    <div class="col-6 card glass-panel"><div class="stat-card"><div class="stat-icon" style="background:linear-gradient(135deg,#34c759,#30d158)"><i class='bx bx-receipt'></i></div><div class="stat-info"><h3 data-i18n="decl_gelir">${t.decl_gelir}</h3><p style="font-size:14px" data-i18n="decl_gelir_date">${t.decl_gelir_date}</p></div></div></div>
    <div class="col-6 card glass-panel"><div class="stat-card"><div class="stat-icon" style="background:linear-gradient(135deg,#0071e3,#5ac8fa)"><i class='bx bx-receipt'></i></div><div class="stat-info"><h3 data-i18n="decl_kurumlar">${t.decl_kurumlar}</h3><p style="font-size:14px" data-i18n="decl_kurumlar_date">${t.decl_kurumlar_date}</p></div></div></div>
  </div>
</div>
<div class="tab-content" id="tab-salary">
  <div class="ai-form">
    <div class="form-row"><div class="form-group"><label data-i18n="acc_employee">${t.acc_employee}</label><input type="text" id="sal-name" class="form-control"></div>
    <div class="form-group"><label data-i18n="acc_gross">${t.acc_gross}</label><input type="number" id="sal-gross" class="form-control"></div></div>
    <button class="btn btn-primary btn-sm" id="btn-calc-salary" data-i18n="acc_calc_salary">${t.acc_calc_salary}</button>
  </div>
  <div class="ai-result hidden" id="salary-result"></div>
  <div style="margin-top:24px"><h3>Kayıtlar</h3><table class="data-table"><thead><tr><th>Ay</th><th>Çalışan</th><th>Brüt</th><th>Net</th><th>SGK</th><th></th></tr></thead><tbody id="salary-table-body"></tbody></table></div>
</div>
<div class="tab-content" id="tab-expenses">
  <div class="ai-form">
    <div class="form-row">
      <div class="form-group"><label data-i18n="acc_category">${t.acc_category}</label><select id="exp-category" class="form-control"><option>Kira</option><option>Personel</option><option>Malzeme</option><option>Ulaşım</option><option>Pazarlama</option><option>Diğer</option></select></div>
      <div class="form-group"><label data-i18n="acc_amount">${t.acc_amount}</label><input type="number" id="exp-amount" class="form-control"></div>
    </div>
    <div class="form-group"><label data-i18n="acc_description">${t.acc_description}</label><input type="text" id="exp-desc" class="form-control"></div>
    <button class="btn btn-accent btn-sm" id="btn-add-expense" data-i18n="acc_add_expense">${t.acc_add_expense}</button>
  </div>
  <table class="data-table" style="margin-top:20px"><thead><tr><th>Tarih</th><th>Kategori</th><th>Açıklama</th><th>Tutar</th><th></th></tr></thead><tbody id="expense-table-body"></tbody></table>
</div>
<div class="tab-content" id="tab-ai-analysis">
  <div class="ai-form">
    <div class="form-group"><label data-i18n="acc_query_label">${t.acc_query_label}</label><textarea id="acc-query" class="form-control" rows="3" placeholder="${t.acc_query_ph}" data-i18n="acc_query_ph"></textarea></div>
    <button class="btn btn-primary" id="btn-accountant" data-i18n="btn_ask_accountant">${t.btn_ask_accountant}</button>
  </div>
  <div class="ai-result hidden" id="accountant-result"></div>
</div></div>`;
},

  reports(t, reports) {
    const list = reports.length ? reports.map(r => `
      <div class="card glass-panel" style="margin-bottom:16px; cursor:pointer" onclick="this.querySelector('.report-content').classList.toggle('hidden')">
        <div style="display:flex; justify-content:space-between; align-items:center">
          <div>
            <h4 style="margin:0">${r.title || (r.type === 'risk' ? 'Sektörel Risk Analizi' : r.type === 'partner' ? 'İş Ortağı Analizi' : 'Yapay Zeka Raporu')}</h4>
            <span style="font-size:11px; color:var(--text-muted)">${new Date(r.created_at).toLocaleString()}</span>
          </div>
          <span class="badge" style="background:var(--primary); color:#fff; padding:4px 8px; border-radius:6px; font-size:10px">${r.type.toUpperCase()}</span>
        </div>
        <div class="report-content hidden" style="margin-top:16px; border-top:1px solid var(--border); padding-top:16px; font-size:14px; line-height:1.6">
          ${(r.content || r.result || '').replace(/\n/g, '<br>')}
        </div>
      </div>`).join('') : `<p style="text-align:center; color:var(--text-muted); padding:40px">Henüz raporunuz bulunmamaktadır.</p>`;
    
    return `<div class="view-section feature-page">
      <div class="page-header"><div class="page-icon" style="background:var(--primary)"><i class='bx bx-file-find'></i></div>
      <div><h1>Geçmiş Raporlarım</h1><p>Daha önce oluşturduğunuz tüm analizler burada saklanır.</p></div></div>
      <div class="reports-list" style="width:100%">${list}</div>
    </div>`;
  },

  profile(t, user) {
    return `<div class="view-section profile-section">
      <div class="page-header"><h1>${t.nav_profile || 'Profil'}</h1><p>Profil bilgilerinizi buradan yönetebilirsiniz.</p></div>
      <div class="card glass-panel" style="width:100%; max-width:600px">
        <form id="profile-form" class="ai-form">
          <div class="form-group"><label>Ad Soyad</label><input type="text" id="prof-fullname" class="form-control" value="${user?.full_name||''}"></div>
          <div class="form-group"><label>Şirket Adı</label><input type="text" id="prof-company" class="form-control" value="${user?.company_name||''}"></div>
          <div class="form-group"><label>Sektör</label><input type="text" id="prof-sector" class="form-control" value="${user?.sector||''}"></div>
          <div class="form-row">
            <div class="form-group"><label>Ülke</label><input type="text" id="prof-country" class="form-control" value="${user?.country||''}"></div>
            <div class="form-group"><label>Şehir</label><input type="text" id="prof-city" class="form-control" value="${user?.city||''}"></div>
          </div>
          <button type="submit" class="btn btn-primary">Bilgileri Güncelle</button>
        </form>
        <hr style="margin:32px 0; border:0; border-top:1px solid var(--border)">
        <h3 style="margin-bottom:16px">Şifre Değiştir</h3>
        <form id="password-form" class="ai-form">
          <div class="form-group"><label>Mevcut Şifre</label><input type="password" id="prof-curpass" class="form-control" autocomplete="current-password" required></div>
          <div class="form-group"><label>Yeni Şifre</label><input type="password" id="prof-newpass" class="form-control" autocomplete="new-password" required minlength="6"></div>
          <button type="submit" class="btn btn-primary" style="background: var(--text-main); color: var(--bg-secondary) !important;">Şifreyi Değiştir</button>
        </form>
      </div>
    </div>`;
  }
};

