// ═══ EFİNTİC VIEW TEMPLATES ═══
const views = {
landing(t) {
return `<div class="view-section" style="margin-left:calc(-1 * var(--sidebar-width));width:calc(100% + var(--sidebar-width));padding:0 40px;">
<div class="hero">
  <h1 data-i18n="hero_title">${t.hero_title}</h1>
  <p data-i18n="hero_desc">${t.hero_desc}</p>
  <a href="#register" class="btn btn-primary" data-i18n="btn_start">${t.btn_start}</a>
</div>
<div class="features-grid">
  <div class="feature-card glass-panel"><div class="feat-icon" style="background:linear-gradient(135deg,#0071e3,#5856d6)"><i class='bx bx-bar-chart-alt-2'></i></div><h3 data-i18n="feat_1_title">${t.feat_1_title}</h3><p data-i18n="feat_1_desc">${t.feat_1_desc}</p></div>
  <div class="feature-card glass-panel"><div class="feat-icon" style="background:linear-gradient(135deg,#ff9500,#ff3b30)"><i class='bx bx-group'></i></div><h3 data-i18n="feat_2_title">${t.feat_2_title}</h3><p data-i18n="feat_2_desc">${t.feat_2_desc}</p></div>
  <div class="feature-card glass-panel"><div class="feat-icon" style="background:linear-gradient(135deg,#34c759,#30d158)"><i class='bx bx-wallet'></i></div><h3 data-i18n="feat_3_title">${t.feat_3_title}</h3><p data-i18n="feat_3_desc">${t.feat_3_desc}</p></div>
</div>
<div class="how-it-works" id="how-it-works-section">
  <h2 class="section-title" data-i18n="how_title">${t.how_title}</h2>
  <div class="steps">
    <div class="step"><div class="step-num">1</div><h3 data-i18n="step_1_title">${t.step_1_title}</h3><p data-i18n="step_1_desc">${t.step_1_desc}</p></div>
    <div class="step"><div class="step-num">2</div><h3 data-i18n="step_2_title">${t.step_2_title}</h3><p data-i18n="step_2_desc">${t.step_2_desc}</p></div>
    <div class="step"><div class="step-num">3</div><h3 data-i18n="step_3_title">${t.step_3_title}</h3><p data-i18n="step_3_desc">${t.step_3_desc}</p></div>
  </div>
</div>
<div class="news-section">
  <h2 class="section-title" data-i18n="news_title">${t.news_title}</h2>
  <div class="news-grid" id="news-grid">
    <div class="news-card glass-panel"><h4>Yükleniyor...</h4><p>Haberler getiriliyor.</p></div>
  </div>
</div>
<div class="cta-section">
  <h2 data-i18n="cta_title">${t.cta_title}</h2>
  <a href="#register" class="btn btn-primary" data-i18n="btn_start">${t.btn_start}</a>
</div>
<div class="landing-footer">
  <p data-i18n="footer_copy">${t.footer_copy}</p>
  <a href="https://umitcancinar.me" target="_blank" class="dev-link" data-i18n="footer_dev">${t.footer_dev}</a>
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

profile(t, user) {
return `<div class="view-section profile-section"><div class="page-header"><h1 data-i18n="profile_title">${t.profile_title}</h1><p data-i18n="profile_desc">${t.profile_desc}</p></div>
<form id="profile-form" class="ai-form">
  <div class="form-row"><div class="form-group"><label data-i18n="lbl_fullname">${t.lbl_fullname}</label><input type="text" id="prof-fullname" class="form-control" value="${user?.full_name||''}"></div>
  <div class="form-group"><label data-i18n="lbl_company">${t.lbl_company}</label><input type="text" id="prof-company" class="form-control" value="${user?.company_name||''}"></div></div>
  <div class="form-row"><div class="form-group"><label data-i18n="lbl_sector">${t.lbl_sector}</label><input type="text" id="prof-sector" class="form-control" value="${user?.sector||''}"></div>
  <div class="form-group"><label data-i18n="lbl_capital">${t.lbl_capital}</label><input type="text" id="prof-capital" class="form-control" value="${user?.capital_range||''}"></div></div>
  <div class="form-row"><div class="form-group"><label data-i18n="lbl_country">${t.lbl_country}</label><input type="text" id="prof-country" class="form-control" value="${user?.country||''}"></div>
  <div class="form-group"><label data-i18n="lbl_city">${t.lbl_city}</label><input type="text" id="prof-city" class="form-control" value="${user?.city||''}"></div></div>
  <div class="form-group"><label data-i18n="lbl_experience">${t.lbl_experience}</label><input type="text" id="prof-exp" class="form-control" value="${user?.experience||''}"></div>
  <button type="submit" class="btn btn-primary" data-i18n="btn_update">${t.btn_update}</button>
</form>
<hr style="border-color:var(--border);margin:32px 0">
<form id="password-form" class="ai-form">
  <div class="form-row"><div class="form-group"><label data-i18n="lbl_current_pass">${t.lbl_current_pass}</label><input type="password" id="prof-curpass" class="form-control"></div>
  <div class="form-group"><label data-i18n="lbl_new_pass">${t.lbl_new_pass}</label><input type="password" id="prof-newpass" class="form-control"></div></div>
  <button type="submit" class="btn btn-glass" data-i18n="btn_change_pass">${t.btn_change_pass}</button>
</form></div>`;
}
};
