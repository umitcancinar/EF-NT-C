'use strict';
// ═══ EFİNTİC CORE APP ═══
(function(){
const vc = document.getElementById('view-container');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const headerLogin = document.getElementById('header-login');
const headerRegister = document.getElementById('header-register');
const landingLinks = document.getElementById('landing-links');
const welcomeEl = document.getElementById('header-user-welcome');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const langToggle = document.getElementById('lang-toggle');
const mobileToggle = document.getElementById('mobile-menu-toggle');
const overlay = document.getElementById('sidebar-overlay');
const profileModal = document.getElementById('profile-modal');
const loader = document.getElementById('loader');
const loaderMsg = document.getElementById('loader-message');
const youtubeBtn = document.getElementById('youtube-btn');

let currentUser = JSON.parse(localStorage.getItem('efintic_user') || 'null');

// ── Theme ──
function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') { document.body.classList.remove('dark-mode'); themeIcon.className = 'bx bx-sun'; }
  else { document.body.classList.add('dark-mode'); themeIcon.className = 'bx bx-moon'; }
}
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeIcon.className = isDark ? 'bx bx-moon' : 'bx bx-sun';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
initTheme();

// ── Language ──
langToggle.addEventListener('click', () => i18n.toggle());
i18n.apply();

// ── Toast ──
function toast(msg, type='success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, 3000);
}

// ── Loader ──
function showLoader(msg) {
  loaderMsg.textContent = msg || '';
  loader.classList.remove('hidden');
}
function hideLoader() { loader.classList.add('hidden'); }

async function showAILoader() {
  const t = i18n.translations[i18n.currentLang];
  const msgs = [t.loading_1, t.loading_2, t.loading_3, t.loading_4];
  showLoader(msgs[0]);
  let i = 1;
  const interval = setInterval(() => { if (i < msgs.length) loaderMsg.textContent = msgs[i++]; }, 2000);
  return () => { clearInterval(interval); hideLoader(); };
}

// ── Auth State ──
function isLoggedIn() { return !!api.token && !!currentUser; }

function updateUI() {
  const logged = isLoggedIn();
  if (logged) {
    sidebar.classList.remove('hidden');
    headerLogin.classList.add('hidden');
    headerRegister.classList.add('hidden');
    landingLinks.classList.add('hidden');
    welcomeEl.classList.remove('hidden');
    const t = i18n.translations[i18n.currentLang];
    welcomeEl.textContent = t.welcome_user + (currentUser.full_name || currentUser.username) + '!';
    document.getElementById('nav-username').textContent = currentUser.username;
    document.body.classList.add('sidebar-active');
    mainContent.style.marginLeft = 'var(--sidebar-width)';
    mainContent.style.width = 'calc(100% - var(--sidebar-width))';
    mobileToggle.classList.add('logged-in');
    if (window.innerWidth <= 768) { mainContent.style.marginLeft = '0'; mainContent.style.width = '100%'; }
  } else {
    sidebar.classList.add('hidden');
    headerLogin.classList.remove('hidden');
    headerRegister.classList.remove('hidden');
    landingLinks.classList.remove('hidden');
    welcomeEl.classList.add('hidden');
    document.body.classList.remove('sidebar-active');
    mainContent.style.marginLeft = '0';
    mainContent.style.width = '100%';
    mobileToggle.classList.remove('logged-in');
  }
}

// ── Mobile sidebar ──
mobileToggle.addEventListener('click', () => { sidebar.classList.toggle('show'); overlay.classList.toggle('show'); });
overlay.addEventListener('click', () => { sidebar.classList.remove('show'); overlay.classList.remove('show'); });

// ── Fetch News ──
async function loadNews(targetId) {
  try {
    const articles = await api.get('/news/latest');
    const grid = document.getElementById(targetId);
    if (!grid || !Array.isArray(articles)) return;
    grid.innerHTML = articles.map(a => `
      <div class="news-card glass-panel" onclick="${a.url !== '#' ? `window.open('${a.url}','_blank')` : ''}">
        <h4>${a.title}</h4>
        <p>${a.description || ''}</p>
        <div class="news-meta"><span class="source">${a.source}</span><span>${new Date(a.publishedAt).toLocaleDateString()}</span></div>
      </div>`).join('');
  } catch(e) {}
}

// ── Router ──
function navigate(hash) {
  const t = i18n.translations[i18n.currentLang];
  const route = hash.replace('#','') || 'landing';

  // Close mobile sidebar on navigate
  sidebar.classList.remove('show');
  overlay.classList.remove('show');

  // Update active sidebar link
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const activeLink = document.querySelector(`.nav-links a[href="#${route}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Auth guard
  const publicRoutes = ['landing','login','register','how-it-works-scroll'];
  if (!publicRoutes.includes(route) && !isLoggedIn()) { location.hash = '#login'; return; }

  // Scroll to how-it-works
  if (route === 'how-it-works-scroll') {
    if (!isLoggedIn()) {
      location.hash = '#landing';
      setTimeout(() => { const el = document.getElementById('how-it-works-section'); if (el) el.scrollIntoView({behavior:'smooth'}); }, 300);
    }
    return;
  }

  // Render view
  switch(route) {
    case 'landing': vc.innerHTML = views.landing(t); loadNews('news-grid'); break;
    case 'login': vc.innerHTML = views.login(t); break;
    case 'register': vc.innerHTML = views.register(t); break;
    case 'dashboard': vc.innerHTML = views.dashboard(t, currentUser); loadNews('dash-news-grid'); loadDashStats(); break;
    case 'risk-report': vc.innerHTML = views.riskReport(t); break;
    case 'partner-search': vc.innerHTML = views.partnerSearch(t); break;
    case 'portfolio': vc.innerHTML = views.portfolio(t); break;
    case 'logistics': vc.innerHTML = views.logistics(t); break;
    case 'accountant': vc.innerHTML = views.accountant(t); initAccountantTabs(); loadExpenses(); loadSalaries(); break;
    case 'profile': vc.innerHTML = views.profile(t, currentUser); break;
    default: vc.innerHTML = views.landing(t); loadNews('news-grid');
  }
  window.scrollTo(0,0);
  bindPageEvents(route);
}

// ── Dashboard Stats ──
async function loadDashStats() {
  try {
    const [reports, expenses] = await Promise.all([api.get('/ai/reports'), api.get('/user/expenses')]);
    const rc = document.getElementById('stat-reports-count');
    const ec = document.getElementById('stat-expenses-total');
    if (rc && Array.isArray(reports)) rc.textContent = reports.length;
    if (ec && Array.isArray(expenses)) {
      const total = expenses.reduce((s,e) => s + parseFloat(e.amount||0), 0);
      ec.textContent = total.toLocaleString('tr-TR') + '₺';
    }
  } catch(e) {}
}

// ── Accountant Tabs ──
function initAccountantTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}

// ── Load Expenses ──
async function loadExpenses() {
  try {
    const data = await api.get('/user/expenses');
    const tbody = document.getElementById('expense-table-body');
    if (!tbody || !Array.isArray(data)) return;
    tbody.innerHTML = data.map(e => `<tr>
      <td>${new Date(e.date).toLocaleDateString()}</td><td>${e.category}</td><td>${e.description||''}</td>
      <td>${parseFloat(e.amount).toLocaleString('tr-TR')}₺</td>
      <td><button class="btn-icon" onclick="window._deleteExpense(${e.id})"><i class='bx bx-trash'></i></button></td>
    </tr>`).join('');
  } catch(e) {}
}
window._deleteExpense = async (id) => { await api.del('/user/expenses/'+id); loadExpenses(); toast('Silindi'); };

// ── Load Salaries ──
async function loadSalaries() {
  try {
    const data = await api.get('/user/salaries');
    const tbody = document.getElementById('salary-table-body');
    if (!tbody || !Array.isArray(data)) return;
    tbody.innerHTML = data.map(s => `<tr>
      <td>${s.month}</td><td>${s.employee_name}</td><td>${parseFloat(s.gross_salary).toLocaleString('tr-TR')}₺</td>
      <td>${parseFloat(s.net_salary).toLocaleString('tr-TR')}₺</td><td>${parseFloat(s.sgk_premium).toLocaleString('tr-TR')}₺</td>
      <td><button class="btn-icon" onclick="window._deleteSalary(${s.id})"><i class='bx bx-trash'></i></button></td>
    </tr>`).join('');
  } catch(e) {}
}
window._deleteSalary = async (id) => { await api.del('/user/salaries/'+id); loadSalaries(); toast('Silindi'); };

// ── Bind Page Events ──
function bindPageEvents(route) {
  const t = i18n.translations[i18n.currentLang];
  const lang = i18n.currentLang;

  // Login
  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    try {
      showLoader(t.loading_1);
      const res = await api.post('/auth/login', { email: document.getElementById('login-email').value, password: document.getElementById('login-password').value });
      hideLoader();
      if (res.error) return toast(res.error, 'error');
      api.setToken(res.token);
      currentUser = res.user;
      localStorage.setItem('efintic_user', JSON.stringify(currentUser));
      updateUI();
      if (!currentUser.profile_completed) { profileModal.classList.remove('hidden'); }
      else { location.hash = '#dashboard'; }
      toast(t.welcome_user + (currentUser.full_name || currentUser.username) + '!');
    } catch(err) { hideLoader(); toast('Hata oluştu', 'error'); }
  });

  // Register
  const regForm = document.getElementById('register-form');
  if (regForm) regForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    try {
      showLoader(t.loading_1);
      const res = await api.post('/auth/register', { username: document.getElementById('reg-username').value, email: document.getElementById('reg-email').value, password: document.getElementById('reg-password').value });
      hideLoader();
      if (res.error) return toast(res.error, 'error');
      api.setToken(res.token);
      currentUser = res.user;
      localStorage.setItem('efintic_user', JSON.stringify(currentUser));
      updateUI();
      profileModal.classList.remove('hidden');
      toast('Hesap oluşturuldu! 🎉');
    } catch(err) { hideLoader(); toast('Hata oluştu', 'error'); }
  });

  // Risk Report
  const btnRisk = document.getElementById('btn-risk-report');
  if (btnRisk) btnRisk.addEventListener('click', async() => {
    const stop = await showAILoader();
    const res = await api.post('/ai/risk-report', { sector: document.getElementById('risk-sector').value, newsContext: document.getElementById('risk-context').value, lang });
    stop();
    const el = document.getElementById('risk-result');
    el.classList.remove('hidden');
    el.innerHTML = res.report ? formatAIResult(res.report) : `<p style="color:var(--danger)">${res.error}</p>`;
  });

  // Partner Search
  const btnPartner = document.getElementById('btn-partner-search');
  if (btnPartner) btnPartner.addEventListener('click', async() => {
    const stop = await showAILoader();
    const res = await api.post('/ai/partner-search', { sector: document.getElementById('partner-sector').value, city: document.getElementById('partner-city').value, budget: document.getElementById('partner-budget').value, lang });
    stop();
    const el = document.getElementById('partner-result');
    el.classList.remove('hidden');
    el.innerHTML = res.report ? formatAIResult(res.report) : `<p style="color:var(--danger)">${res.error}</p>`;
  });

  // Portfolio
  const btnPort = document.getElementById('btn-portfolio');
  if (btnPort) btnPort.addEventListener('click', async() => {
    const stop = await showAILoader();
    const res = await api.post('/ai/portfolio', { capital: document.getElementById('portfolio-capital').value, riskTolerance: document.getElementById('portfolio-risk').value, lang });
    stop();
    const el = document.getElementById('portfolio-result');
    el.classList.remove('hidden');
    el.innerHTML = res.report ? formatAIResult(res.report) : `<p style="color:var(--danger)">${res.error}</p>`;
  });

  // Logistics
  const btnLog = document.getElementById('btn-logistics');
  if (btnLog) btnLog.addEventListener('click', async() => {
    const stop = await showAILoader();
    const res = await api.post('/ai/logistics', { origin: document.getElementById('log-origin').value, destination: document.getElementById('log-dest').value, cargoType: document.getElementById('log-cargo').value, lang });
    stop();
    const el = document.getElementById('logistics-result');
    el.classList.remove('hidden');
    el.innerHTML = res.report ? formatAIResult(res.report) : `<p style="color:var(--danger)">${res.error}</p>`;
  });

  // Accountant AI
  const btnAcc = document.getElementById('btn-accountant');
  if (btnAcc) btnAcc.addEventListener('click', async() => {
    const stop = await showAILoader();
    const res = await api.post('/ai/accountant', { query: document.getElementById('acc-query').value, type: 'analysis', lang });
    stop();
    const el = document.getElementById('accountant-result');
    el.classList.remove('hidden');
    el.innerHTML = res.report ? formatAIResult(res.report) : `<p style="color:var(--danger)">${res.error}</p>`;
  });

  // Add Expense
  const btnExp = document.getElementById('btn-add-expense');
  if (btnExp) btnExp.addEventListener('click', async() => {
    const res = await api.post('/user/expenses', { category: document.getElementById('exp-category').value, amount: document.getElementById('exp-amount').value, description: document.getElementById('exp-desc').value });
    if (!res.error) { toast('Gider eklendi'); loadExpenses(); } else { toast(res.error, 'error'); }
  });

  // Calc Salary
  const btnSal = document.getElementById('btn-calc-salary');
  if (btnSal) btnSal.addEventListener('click', async() => {
    const gross = parseFloat(document.getElementById('sal-gross').value);
    if (!gross) return toast('Brüt maaş girin', 'error');
    const sgk = gross * 0.14; const unemp = gross * 0.01;
    const taxBase = gross - sgk - unemp;
    const tax = taxBase * 0.15; // Simplified first bracket
    const net = gross - sgk - unemp - tax;
    const name = document.getElementById('sal-name').value;
    const month = new Date().toISOString().slice(0,7);
    // Save
    await api.post('/user/salaries', { employee_name: name, gross_salary: gross, net_salary: net.toFixed(2), sgk_premium: sgk.toFixed(2), tax: tax.toFixed(2), month });
    const el = document.getElementById('salary-result');
    el.classList.remove('hidden');
    el.innerHTML = `<h3>💰 Maaş Hesaplama</h3><p>Brüt: ${gross.toLocaleString('tr-TR')}₺<br>SGK (%14): ${sgk.toLocaleString('tr-TR')}₺<br>İşsizlik (%1): ${unemp.toLocaleString('tr-TR')}₺<br>Gelir Vergisi (%15): ${tax.toLocaleString('tr-TR')}₺<br><strong>Net Maaş: ${net.toLocaleString('tr-TR')}₺</strong></p>`;
    loadSalaries();
  });

  // Profile Update
  const profForm = document.getElementById('profile-form');
  if (profForm) profForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const res = await api.put('/user/profile', { full_name: document.getElementById('prof-fullname').value, company_name: document.getElementById('prof-company').value, sector: document.getElementById('prof-sector').value, capital_range: document.getElementById('prof-capital').value, country: document.getElementById('prof-country').value, city: document.getElementById('prof-city').value, experience: document.getElementById('prof-exp').value });
    if (!res.error) { currentUser = {...currentUser, ...res}; localStorage.setItem('efintic_user', JSON.stringify(currentUser)); updateUI(); toast('Profil güncellendi'); }
  });

  // Password Change
  const passForm = document.getElementById('password-form');
  if (passForm) passForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const res = await api.put('/user/change-password', { currentPassword: document.getElementById('prof-curpass').value, newPassword: document.getElementById('prof-newpass').value });
    if (res.error) toast(res.error, 'error'); else toast('Şifre değiştirildi');
  });
}

// ── Format AI Result ──
function formatAIResult(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.*$)/gm, '<h3 style="margin:16px 0 8px;font-size:16px">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 style="margin:20px 0 10px;font-size:18px">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 style="margin:24px 0 12px;font-size:22px">$1</h1>')
    .replace(/\n/g, '<br>');
}

// ── Profile Complete Modal ──
const profCompleteForm = document.getElementById('profile-complete-form');
if (profCompleteForm) profCompleteForm.addEventListener('submit', async(e) => {
  e.preventDefault();
  const data = {
    full_name: document.getElementById('pf-fullname').value,
    company_name: document.getElementById('pf-company').value,
    sector: document.getElementById('pf-sector').value,
    capital_range: document.getElementById('pf-capital').value,
    country: document.getElementById('pf-country').value,
    city: document.getElementById('pf-city').value,
    experience: document.getElementById('pf-experience').value,
  };
  const res = await api.put('/user/profile', data);
  if (!res.error) {
    currentUser = {...currentUser, ...res};
    localStorage.setItem('efintic_user', JSON.stringify(currentUser));
    profileModal.classList.add('hidden');
    updateUI();
    location.hash = '#dashboard';
    toast('Profil tamamlandı! 🎉');
  }
});

// ── Logout ──
document.getElementById('logout-btn').addEventListener('click', () => {
  api.clearToken();
  currentUser = null;
  localStorage.removeItem('efintic_user');
  updateUI();
  location.hash = '#landing';
  toast('Çıkış yapıldı');
});

// ── Language change listener ──
window.addEventListener('langChanged', () => {
  updateUI();
  navigate(location.hash || '#landing');
});

// ── Init ──
window.addEventListener('hashchange', () => navigate(location.hash));
updateUI();
navigate(location.hash || (isLoggedIn() ? '#dashboard' : '#landing'));

})();
