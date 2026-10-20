/**
 * JRM Antophill — Deeni Mehfil & Fund Portal
 * Application Controller, Role-Guarded UI, Public Portal, Member Ledger & WhatsApp Engine
 * Organization: Jamat Raza-e-Mustafa Antophill, Mumbai
 * Developed by esitesz (jrmantophill.esitesz.com)
 */

(function (window, document) {
  'use strict';

  const state = {
    role: 'public', // 'public' | 'member' | 'admin' | 'superadmin'
    loggedMember: null,
    currentView: 'public-home',
    currentProgramId: null,
    activeWhatsAppTab: 'collection', // 'collection' | 'expense'
    searchQuery: '',
    statusFilter: 'all',
    modeFilter: 'all'
  };

  const el = {};

  // Indian Standard Time (IST) Helpers
  function getISTDateTime(dateObj = new Date()) {
    const d = (dateObj instanceof Date && !isNaN(dateObj)) ? dateObj : new Date();
    const formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    return formatter.format(d) + ' IST';
  }

  function getISTISODate() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(now);
  }

  function updateISTClock() {
    const clockEl = document.getElementById('istLiveClock');
    if (clockEl) {
      clockEl.textContent = getISTDateTime();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    initTheme();
    initPWA();
    syncSessionState();
    initNavigation();
    bindEvents();
    renderAll();

    // Start live IST clock
    updateISTClock();
    setInterval(updateISTClock, 30000);
  });

  function cacheElements() {
    el.navTabsContainer = document.getElementById('navTabsContainer');
    el.userRoleDisplay = document.getElementById('userRoleDisplay');
    el.loginActionBtn = document.getElementById('loginActionBtn');
    el.themeToggle = document.getElementById('themeToggle');
    el.toastContainer = document.getElementById('toastContainer');
    el.activeProgramStrip = document.getElementById('activeProgramStrip');

    // Modals
    el.accessPortalModal = document.getElementById('accessPortalModal');
    el.collectionModal = document.getElementById('collectionModal');
    el.expenseModal = document.getElementById('expenseModal');
    el.memberPinModal = document.getElementById('memberPinModal');
    el.receiptModal = document.getElementById('receiptModal');
  }

  function initTheme() {
    const saved = localStorage.getItem('jrm_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', saved);
    if (el.themeToggle) {
      el.themeToggle.textContent = saved === 'dark' ? '☀️' : '🌙';
    }
  }

  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('jrm_theme', next);
    if (el.themeToggle) el.themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  }

  function initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
      });
    }
  }

  function syncSessionState() {
    if (JRMData.isSuperAdminLoggedIn()) {
      state.role = 'superadmin';
      state.loggedMember = null;
    } else if (JRMData.isAdminLoggedIn()) {
      state.role = 'admin';
      state.loggedMember = null;
    } else if (JRMData.isMemberLoggedIn()) {
      state.role = 'member';
      state.loggedMember = JRMData.getLoggedInMember();
    } else {
      state.role = 'public';
      state.loggedMember = null;
    }
  }

  function updateHeaderUserPill() {
    if (!el.userRoleDisplay || !el.loginActionBtn) return;

    if (state.role === 'superadmin') {
      el.userRoleDisplay.className = 'user-session-pill superadmin-badge';
      el.userRoleDisplay.innerHTML = `<span>👑 Zain (Super Admin)</span>`;
      el.loginActionBtn.textContent = 'Logout';
      el.loginActionBtn.onclick = logoutCurrent;
    } else if (state.role === 'admin') {
      el.userRoleDisplay.className = 'user-session-pill admin-badge';
      el.userRoleDisplay.innerHTML = `<span>🛡️ Committee Admin</span>`;
      el.loginActionBtn.textContent = 'Logout';
      el.loginActionBtn.onclick = logoutCurrent;
    } else if (state.role === 'member' && state.loggedMember) {
      el.userRoleDisplay.className = 'user-session-pill member-badge';
      el.userRoleDisplay.innerHTML = `<span>👤 ${escapeHTML(state.loggedMember.name)}</span>`;
      el.loginActionBtn.textContent = 'Logout';
      el.loginActionBtn.onclick = logoutCurrent;
    } else {
      el.userRoleDisplay.className = 'user-session-pill';
      el.userRoleDisplay.innerHTML = `<span>Public Portal</span>`;
      el.loginActionBtn.textContent = 'Login';
      el.loginActionBtn.onclick = () => openAccessPortalModal('member');
    }
  }

  function logoutCurrent() {
    if (confirm('Kya aap is session se logout karna chahte hain?')) {
      JRMData.logoutAll();
      syncSessionState();
      switchView('public-home');
      renderAll();
      showToast('Successfully logged out.');
    }
  }

  // Dynamic Navigation Tabs Based on Role
  function renderNavTabs() {
    if (!el.navTabsContainer) return;

    let tabs = [];

    if (state.role === 'superadmin') {
      tabs = [
        { id: 'admin-dashboard', label: 'Dashboard' },
        { id: 'collections', label: 'Collections' },
        { id: 'expenses', label: 'Expenses' },
        { id: 'callbook', label: 'Call Book (CRM)', badge: getPendingBalanceCount() },
        { id: 'whatsapp', label: 'WhatsApp Reports' },
        { id: 'program-manager', label: 'Poster & Program' },
        { id: 'super-settings', label: '👑 Super Settings' },
        { id: 'public-home', label: 'Public Portal' },
        { id: 'verify', label: 'Verify' }
      ];
    } else if (state.role === 'admin') {
      tabs = [
        { id: 'admin-dashboard', label: 'Dashboard' },
        { id: 'collections', label: 'Collections' },
        { id: 'expenses', label: 'Expenses' },
        { id: 'callbook', label: 'Call Book (CRM)', badge: getPendingBalanceCount() },
        { id: 'whatsapp', label: 'WhatsApp Reports' },
        { id: 'program-manager', label: 'Poster & Program' },
        { id: 'public-home', label: 'Public Portal' },
        { id: 'verify', label: 'Verify' }
      ];
    } else if (state.role === 'member') {
      tabs = [
        { id: 'public-home', label: 'Mehfil & Poster' },
        { id: 'statement', label: 'Mera Hisab & Receipts' },
        { id: 'public-transparency', label: 'Monthly Transparency' },
        { id: 'verify', label: 'Verify Receipt' }
      ];
    } else {
      // Public / Guest
      tabs = [
        { id: 'public-home', label: 'Mehfil & Poster' },
        { id: 'public-transparency', label: 'Monthly Transparency' },
        { id: 'verify', label: 'Verify Receipt' }
      ];
    }

    el.navTabsContainer.innerHTML = tabs.map(t => `
      <button class="nav-tab ${state.currentView === t.id ? 'active' : ''}" data-view="${t.id}" onclick="window.JRMApp.switchView('${t.id}')">
        ${escapeHTML(t.label)}
        ${t.badge ? `<span class="nav-counter">${t.badge}</span>` : ''}
      </button>
    `).join('');
  }

  function getPendingBalanceCount() {
    const list = JRMData.getCollections(state.currentProgramId);
    return list.filter(c => Number(c.balance) > 0).length;
  }

  function initNavigation() {
    window.addEventListener('hashchange', handleHashRouting);
    if (window.location.hash) {
      handleHashRouting();
    } else {
      // Set appropriate initial view based on role
      if (state.role === 'superadmin' || state.role === 'admin') {
        state.currentView = 'admin-dashboard';
      } else if (state.role === 'member') {
        state.currentView = 'statement';
      } else {
        state.currentView = 'public-home';
      }
    }
  }

  function handleHashRouting() {
    const raw = window.location.hash.replace(/^#\/?/, '');
    if (!raw) return;

    if (raw.startsWith('verify/')) {
      const token = raw.split('/')[1];
      switchView('verify');
      const input = document.getElementById('receiptSearchInput');
      if (input && token) {
        input.value = decodeURIComponent(token);
        performReceiptSearch(input.value);
      }
      return;
    }

    const validViews = [
      'public-home', 'public-transparency', 'statement', 'admin-dashboard',
      'collections', 'expenses', 'callbook', 'whatsapp', 'program-manager',
      'super-settings', 'verify'
    ];

    if (validViews.includes(raw)) {
      switchView(raw);
    }
  }

  function switchView(viewId) {
    // Role guard: Protect admin & superadmin views
    const adminViews = ['admin-dashboard', 'collections', 'expenses', 'callbook', 'whatsapp', 'program-manager'];
    const superViews = ['super-settings'];

    if (superViews.includes(viewId) && state.role !== 'superadmin') {
      showToast('Sirf Super Admin (Zain) is section ko access kar sakte hain.');
      openAccessPortalModal('super');
      return;
    }

    if (adminViews.includes(viewId) && state.role !== 'admin' && state.role !== 'superadmin') {
      showToast('Kripya Admin PIN se login karein.');
      openAccessPortalModal('admin');
      return;
    }

    if (viewId === 'statement' && state.role !== 'member' && state.role !== 'admin' && state.role !== 'superadmin') {
      openAccessPortalModal('member');
      return;
    }

    state.currentView = viewId;
    window.location.hash = '#' + viewId;

    document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById('view-' + viewId);
    if (target) target.classList.add('active');

    renderNavTabs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function bindEvents() {
    if (el.themeToggle) el.themeToggle.addEventListener('click', toggleTheme);

    // Collection filters
    const searchInput = document.getElementById('collectionSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderCollectionsTable();
      });
    }

    const statusFilter = document.getElementById('collectionStatusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => {
        state.statusFilter = e.target.value;
        renderCollectionsTable();
      });
    }

    const modeFilter = document.getElementById('collectionModeFilter');
    if (modeFilter) {
      modeFilter.addEventListener('change', (e) => {
        state.modeFilter = e.target.value;
        renderCollectionsTable();
      });
    }
  }

  function renderAll() {
    syncSessionState();
    updateHeaderUserPill();
    renderNavTabs();
    renderActiveProgramStrip();
    renderPublicHome();
    renderPublicTransparency();
    renderStatementView();
    renderAdminDashboard();
    renderCollectionsTable();
    renderExpensesTable();
    renderCallBook();
    renderWhatsAppPreview();
    renderProgramManagerForm();
    renderSuperSettings();
  }

  // Active Program Strip
  function renderActiveProgramStrip() {
    const banner = el.activeProgramStrip;
    if (!banner) return;

    const prog = JRMData.getActiveProgram();
    if (!prog) return;

    banner.innerHTML = `
      <div>
        <h2>${escapeHTML(prog.title)}</h2>
        <p>${escapeHTML(prog.day)}, ${escapeHTML(prog.date)} (${escapeHTML(prog.month)} ${prog.year}) • Time: ${escapeHTML(prog.time || '08:30 PM')} • Asia/Kolkata (IST)</p>
      </div>
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <span class="user-session-pill" style="font-size: 0.72rem; color: var(--brand-green);">
          🇮🇳 IST: <strong id="istLiveClock">${getISTDateTime()}</strong>
        </span>
        <select id="programSelector" class="form-input" onchange="window.JRMApp.handleProgramChange(this.value)" style="width: auto; padding: 4px 8px; font-size: 0.82rem;">
          ${JRMData.getPrograms().map(p => `
            <option value="${p.id}" ${p.id === prog.id ? 'selected' : ''}>${escapeHTML(p.title)} (${p.month} ${p.year})</option>
          `).join('')}
        </select>
      </div>
    `;
  }

  function handleProgramChange(progId) {
    state.currentProgramId = progId;
    renderAll();
  }

  // ==========================================================================
  // VIEW 1: PUBLIC HOME (Mehfil Poster & Official Bio Links)
  // ==========================================================================
  function renderPublicHome() {
    const posterSection = document.getElementById('publicProgramPosterSection');
    const bioContainer = document.getElementById('bioLinksContainer');
    const settings = JRMData.getSettings();
    const prog = JRMData.getActiveProgram();
    if (!prog) return;

    const posterImage = prog.posterUrl || settings.activePosterUrl || settings.posterImageUrl;

    if (posterSection) {
      posterSection.innerHTML = `
        <div class="program-poster-hero">
          <span style="display: inline-block; font-size: 0.72rem; font-weight: 700; background: rgba(255,255,255,0.18); padding: 4px 10px; border-radius: var(--radius-full); margin-bottom: 8px; letter-spacing: 0.5px;">
            JAMAT RAZA-E-MUSTAFA ANTOPHILL MUMBAI
          </span>
          <h2>${escapeHTML(prog.title)}</h2>
          <p>${escapeHTML(prog.day)}, ${escapeHTML(prog.date)} • Ba-Waqt: ${escapeHTML(prog.time || '08:30 PM (IST)')}</p>
        </div>

        ${posterImage ? `
          <div style="background: #000; text-align: center;">
            <img src="${posterImage}" alt="Mehfil Poster" class="program-poster-banner">
          </div>
        ` : `
          <div style="background: var(--bg-subtle); border-bottom: 1px solid var(--border); padding: 24px 20px; text-align: center;">
            <div style="font-size: 2.4rem; margin-bottom: 8px;">🕌</div>
            <h3 style="color: var(--brand-green); font-size: 1.1rem; margin-bottom: 6px;">MAHANA SUNNI DEENI NASHISHT MEHFIL</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 520px; margin: 0 auto;">
              ${escapeHTML(prog.posterAnnouncement || settings.posterAnnouncement || 'In Sha Allah Mahana Deeni Mehfil ba-mukaam Antophill munaqqad hogi.')}
            </p>
          </div>
        `}

        <div class="program-poster-body">
          <div class="program-meta-row">
            <div class="program-meta-item">
              <strong>Tareekh (Date)</strong>
              ${escapeHTML(prog.day)}, ${escapeHTML(prog.date)} (${escapeHTML(prog.month)} ${prog.year})
            </div>
            <div class="program-meta-item">
              <strong>Waqt (IST)</strong>
              ${escapeHTML(prog.time || '08:30 PM')} (Indian Standard Time)
            </div>
            <div class="program-meta-item">
              <strong>Mukaam (Venue)</strong>
              ${escapeHTML(prog.venue)}
            </div>
          </div>

          <p style="font-size: 0.84rem; color: var(--text-main); margin-bottom: 16px; line-height: 1.6;">
            ${escapeHTML(prog.description)}
          </p>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${settings.bioLinks?.maps ? `
              <a href="${escapeHTML(settings.bioLinks.maps)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
                📍 Get Directions / Location
              </a>
            ` : ''}
            <button class="btn btn-whatsapp btn-sm" onclick="window.JRMApp.shareProgramInfo()">
              📱 Share Program on WhatsApp
            </button>
            ${(state.role === 'admin' || state.role === 'superadmin') ? `
              <button class="btn btn-outline btn-sm" onclick="window.JRMApp.switchView('program-manager')">
                ✏️ Edit Program & Poster
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }

    if (bioContainer) {
      const bio = settings.bioLinks || {};
      bioContainer.innerHTML = `
        ${bio.whatsapp ? `
          <a href="${escapeHTML(bio.whatsapp)}" target="_blank" rel="noopener" class="bio-link-btn whatsapp-link">
            💬 WhatsApp Channel
          </a>
        ` : ''}
        ${bio.instagram ? `
          <a href="${escapeHTML(bio.instagram)}" target="_blank" rel="noopener" class="bio-link-btn instagram-link">
            📷 Instagram Official
          </a>
        ` : ''}
        ${bio.youtube ? `
          <a href="${escapeHTML(bio.youtube)}" target="_blank" rel="noopener" class="bio-link-btn youtube-link">
            📺 YouTube Channel
          </a>
        ` : ''}
        ${bio.maps ? `
          <a href="${escapeHTML(bio.maps)}" target="_blank" rel="noopener" class="bio-link-btn">
            📍 Antophill Location
          </a>
        ` : ''}
        ${bio.helpline ? `
          <a href="tel:${escapeHTML(bio.helpline.replace(/\s+/g, ''))}" class="bio-link-btn">
            📞 Helpline: ${escapeHTML(bio.helpline)}
          </a>
        ` : ''}
      `;
    }
  }

  function shareProgramInfo() {
    const prog = JRMData.getActiveProgram();
    const settings = JRMData.getSettings();
    if (!prog) return;

    const text =
      `*(40) MAHANA SUNNI DEENI NASHISHT MEHFIL*\n` +
      `*Jamat Raza-e-Mustafa Antophill Mumbai*\n\n` +
      `*Date:* ${prog.day}, ${prog.date} (${prog.month} ${prog.year})\n` +
      `*Time:* ${prog.time || '08:30 PM'} (IST)\n` +
      `*Venue:* ${prog.venue}\n\n` +
      `${prog.posterAnnouncement || 'In Sha Allah ba-barkat deeni nashisht munaqqad hogi. Sabhi ahl-e-sunnat se shirkat ki guzarish hai.'}\n\n` +
      `Official Community Link: https://${settings.domain}\n` +
      `*Zain & Zimmedaran Committee*`;

    const url = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
  }

  // ==========================================================================
  // VIEW 2: PUBLIC TRANSPARENCY (Itemized Management Expenses)
  // ==========================================================================
  function renderPublicTransparency() {
    const metricsContainer = document.getElementById('publicTransparencyMetrics');
    const itemsContainer = document.getElementById('publicExpenseItemsContainer');
    if (!metricsContainer || !itemsContainer) return;

    const prog = JRMData.getActiveProgram();
    const data = JRMData.getPublicTransparency(prog ? prog.id : null);

    metricsContainer.innerHTML = `
      <div class="transparency-metric-card">
        <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Mahana Fund Received</span>
        <div class="transparency-metric-val" style="color: var(--status-paid);">${JRMData.formatINR(data.totalCollected)}</div>
      </div>
      <div class="transparency-metric-card">
        <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Total Management Kharcha</span>
        <div class="transparency-metric-val" style="color: var(--status-pending);">${JRMData.formatINR(data.totalExpenses)}</div>
      </div>
      <div class="transparency-metric-card">
        <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Balance In Hand</span>
        <div class="transparency-metric-val" style="color: ${data.netBalance >= 0 ? 'var(--brand-green)' : 'var(--status-pending)'};">
          ${JRMData.formatINR(data.netBalance)}
        </div>
      </div>
    `;

    if (!data.expensesList || data.expensesList.length === 0) {
      itemsContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">Is mahine ke expense abhi record ho rahe hain.</p>`;
      return;
    }

    itemsContainer.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Sr</th>
            <th>Expense Head / Madad</th>
            <th>Category</th>
            <th>Date (IST)</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${data.expensesList.map((e, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td><strong>${escapeHTML(e.title)}</strong></td>
              <td><span class="user-session-pill" style="font-size: 0.72rem;">${escapeHTML(e.category)}</span></td>
              <td>${escapeHTML(e.date)}</td>
              <td style="text-align: right; font-weight: 700; color: var(--status-pending);">${JRMData.formatINR(e.amount)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr style="font-weight: 800; background: var(--bg-subtle);">
            <td colspan="4" style="text-align: right;">Kul Management Expense:</td>
            <td style="text-align: right; color: var(--status-pending);">${JRMData.formatINR(data.totalExpenses)}</td>
          </tr>
        </tfoot>
      </table>
    `;
  }

  // ==========================================================================
  // VIEW 3: MEMBER STATEMENT & LEDGER (Mera Hisab)
  // ==========================================================================
  function renderStatementView() {
    const container = document.getElementById('memberStatementContainer');
    if (!container) return;

    if (state.role !== 'member' && state.role !== 'admin' && state.role !== 'superadmin') {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-md);">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">👤</div>
          <h3 style="margin-bottom: 8px;">Member Statement & Personal Ledger</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; max-width: 480px; margin: 0 auto 16px;">
            Aapne Mahana Sunni Deeni Nashisht ke liye kab kitna fund jama kiya hai, uska personal hisab aur digital receipts 4-digit PIN ke sath securely dekhein.
          </p>
          <button class="btn btn-primary" onclick="window.JRMApp.openAccessPortalModal('member')">
            Member Login (Mera Hisab Kholein)
          </button>
        </div>
      `;
      return;
    }

    // Determine which member to show
    let memberName = state.loggedMember?.name;
    if (!memberName && (state.role === 'admin' || state.role === 'superadmin')) {
      const all = JRMData.getCollections();
      memberName = all[0]?.name || '';
    }

    const history = JRMData.getMemberLedger(memberName);
    const totalPaid = history.reduce((sum, h) => sum + (Number(h.paid) || 0), 0);
    const totalBal = history.reduce((sum, h) => sum + (Number(h.balance) || 0), 0);
    const primaryToken = history[0]?.token || '';

    container.innerHTML = `
      <div class="content-box">
        <div class="content-box-header">
          <div>
            <h3>Mera Hisab — Personal Member Statement</h3>
            <span style="font-size: 0.78rem; color: var(--text-muted);">Contributor: <strong>${escapeHTML(memberName)}</strong></span>
          </div>
          <div style="display: flex; gap: 8px;">
            ${(state.role === 'admin' || state.role === 'superadmin') ? `
              <select class="form-input" style="font-size: 0.82rem; width: auto;" onchange="window.JRMApp.previewMemberStatement(this.value)">
                ${JRMData.getCollections().map(c => `
                  <option value="${escapeHTML(c.name)}" ${c.name === memberName ? 'selected' : ''}>${escapeHTML(c.name)}</option>
                `).join('')}
              </select>
            ` : `
              <button class="btn btn-outline btn-sm" onclick="window.JRMApp.logoutCurrent()">Logout</button>
            `}
          </div>
        </div>

        <!-- Personal Summary Strip -->
        <div class="transparency-summary-strip">
          <div class="transparency-metric-card">
            <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Kul Jama (Paid)</span>
            <div class="transparency-metric-val" style="color: var(--status-paid);">${JRMData.formatINR(totalPaid)}</div>
          </div>
          <div class="transparency-metric-card">
            <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Baki Balance (Pending)</span>
            <div class="transparency-metric-val" style="color: ${totalBal > 0 ? 'var(--status-pending)' : 'var(--text-muted)'};">${JRMData.formatINR(totalBal)}</div>
          </div>
          <div class="transparency-metric-card">
            <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Receipt Verification Token</span>
            <div style="font-size: 0.95rem; font-family: var(--font-mono); font-weight: 700; margin-top: 8px;"><code>${escapeHTML(primaryToken)}</code></div>
          </div>
        </div>

        <h4 style="font-size: 0.88rem; margin: 18px 0 10px;">Payment Transactions & Official Receipts</h4>
        <div style="overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Receipt Token</th>
                <th>Tareekh (IST)</th>
                <th>Mode</th>
                <th>Jama Amount</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${history.map(h => `
                <tr>
                  <td><code>${escapeHTML(h.token || '')}</code></td>
                  <td>${escapeHTML(h.date)}</td>
                  <td>${escapeHTML(h.mode || 'Cash')}</td>
                  <td style="font-weight: 700; color: var(--status-paid);">${JRMData.formatINR(h.paid)}</td>
                  <td style="color: ${Number(h.balance) > 0 ? 'var(--status-pending)' : 'var(--text-muted)'}; font-weight: 700;">
                    ${Number(h.balance) > 0 ? JRMData.formatINR(h.balance) : '0'}
                  </td>
                  <td>
                    <span class="status-pill status-${h.status || (Number(h.balance) > 0 ? 'pending' : 'paid')}">
                      ${Number(h.balance) === 0 ? 'Paid ✅' : 'Pending ❌'}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="window.JRMApp.viewReceipt('${h.id}')">
                      📄 View / Print Receipt
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="background: var(--bg-subtle); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px; margin-top: 20px;">
          <h4 style="font-size: 0.85rem; margin-bottom: 6px;">Mahana Mehfil Kharcha Transparency</h4>
          <p style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 10px;">
            Aapke diye gaye fund se is mahine hone wale kul kharchat:
          </p>
          <button class="btn btn-outline btn-sm" onclick="window.JRMApp.switchView('public-transparency')">
            View Complete Program Expenses
          </button>
        </div>
      </div>
    `;
  }

  function previewMemberStatement(name) {
    if (state.role === 'admin' || state.role === 'superadmin') {
      state.loggedMember = { name: name };
      renderStatementView();
    }
  }

  // ==========================================================================
  // VIEW 4: ADMIN DASHBOARD (KPIs & Quick Management)
  // ==========================================================================
  function renderAdminDashboard() {
    const container = document.getElementById('adminDashboardKPIs');
    if (!container) return;

    const metrics = JRMData.getMetrics(state.currentProgramId);

    container.innerHTML = `
      <div class="metric-card">
        <span class="metric-label">Total Fund Collected</span>
        <div class="metric-value" style="color: var(--status-paid);">${JRMData.formatINR(metrics.totalCollected)}</div>
        <span class="metric-sub">From ${metrics.totalMembers} community members</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Total Management Expenses</span>
        <div class="metric-value" style="color: var(--status-pending);">${JRMData.formatINR(metrics.totalExpenses)}</div>
        <span class="metric-sub">Nazrana, Rent, Niyaz, Sound, Media</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Balance In Hand</span>
        <div class="metric-value" style="color: ${metrics.netBalance >= 0 ? 'var(--brand-green)' : 'var(--status-pending)'};">
          ${JRMData.formatINR(metrics.netBalance)}
        </div>
        <span class="metric-sub">Net surplus fund</span>
      </div>
      <div class="metric-card">
        <span class="metric-label">Pending Balances</span>
        <div class="metric-value" style="color: var(--status-pending);">${JRMData.formatINR(metrics.totalPendingBalance)}</div>
        <span class="metric-sub">${metrics.pendingCount} members pending in Call Book</span>
      </div>
    `;

    // Dashboard Recent Lists
    const recentColContainer = document.getElementById('dashboardRecentCollections');
    const recentExpContainer = document.getElementById('dashboardRecentExpenses');

    if (recentColContainer) {
      const recentCols = JRMData.getCollections(state.currentProgramId).slice(-6).reverse();
      recentColContainer.innerHTML = recentCols.map(c => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 0.82rem;">
          <div>
            <div style="font-weight: 700;">${escapeHTML(c.name)}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${escapeHTML(c.date)} • ${escapeHTML(c.mode || 'Cash')}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; color: ${Number(c.balance) > 0 ? 'var(--status-pending)' : 'var(--status-paid)'};">
              ${JRMData.formatINR(c.paid)}
            </div>
            ${Number(c.balance) > 0 ? `<div style="font-size: 0.7rem; color: var(--status-pending);">BAL ${JRMData.formatINR(c.balance)} ❌</div>` : ''}
          </div>
        </div>
      `).join('');
    }

    if (recentExpContainer) {
      const recentExps = JRMData.getExpenses(state.currentProgramId).slice(-6).reverse();
      recentExpContainer.innerHTML = recentExps.map(e => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 0.82rem;">
          <div>
            <div style="font-weight: 700;">${escapeHTML(e.title)}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">${escapeHTML(e.category)} • ${escapeHTML(e.date)}</div>
          </div>
          <div style="font-weight: 800; color: var(--status-pending);">${JRMData.formatINR(e.amount)}</div>
        </div>
      `).join('');
    }
  }

  // ==========================================================================
  // VIEW 5: COLLECTIONS REGISTER (Admin Only)
  // ==========================================================================
  function renderCollectionsTable() {
    const container = document.getElementById('collectionsTableContainer');
    const countDisplay = document.getElementById('collectionCountDisplay');
    if (!container) return;

    let list = JRMData.getCollections(state.currentProgramId);

    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase().trim();
      list = list.filter(c =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q)) ||
        (c.token && c.token.toLowerCase().includes(q))
      );
    }

    if (state.statusFilter === 'paid') {
      list = list.filter(c => Number(c.balance) === 0);
    } else if (state.statusFilter === 'pending') {
      list = list.filter(c => Number(c.balance) > 0);
    }

    if (state.modeFilter !== 'all') {
      list = list.filter(c => (c.mode || '').toLowerCase().includes(state.modeFilter));
    }

    if (countDisplay) {
      countDisplay.textContent = `Showing ${list.length} records`;
    }

    if (list.length === 0) {
      container.innerHTML = `<p style="padding: 20px; text-align: center; color: var(--text-muted);">Koi record nahi mila.</p>`;
      return;
    }

    container.innerHTML = `
      <div style="overflow-x: auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Member Name</th>
              <th>Phone</th>
              <th>Paid Amount</th>
              <th>Balance</th>
              <th>Mode</th>
              <th>Tareekh</th>
              <th>Receipt Token</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(c => `
              <tr>
                <td>${c.memberNo || ''}</td>
                <td><strong>${escapeHTML(c.name)}</strong></td>
                <td>${escapeHTML(c.phone || '-')}</td>
                <td style="font-weight: 700; color: var(--status-paid);">${JRMData.formatINR(c.paid)}</td>
                <td style="font-weight: 700; color: ${Number(c.balance) > 0 ? 'var(--status-pending)' : 'var(--text-muted)'};">
                  ${Number(c.balance) > 0 ? `${JRMData.formatINR(c.balance)} ❌` : '0 ✅'}
                </td>
                <td><span class="user-session-pill" style="font-size: 0.72rem;">${escapeHTML(c.mode || 'Cash')}</span></td>
                <td>${escapeHTML(c.date)}</td>
                <td><code>${escapeHTML(c.token || '')}</code></td>
                <td>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn btn-outline btn-sm" onclick="window.JRMApp.viewReceipt('${c.id}')" title="View Receipt">📄</button>
                    <button class="btn btn-outline btn-sm" onclick="window.JRMApp.openEditCollectionModal('${c.id}')" title="Edit Entry">✏️</button>
                    <button class="btn btn-whatsapp btn-sm" onclick="window.JRMApp.sendWhatsAppReceipt('${c.id}')" title="Send Receipt">📱</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================================================
  // VIEW 6: EXPENSES REGISTER (Admin Only)
  // ==========================================================================
  function renderExpensesTable() {
    const container = document.getElementById('expensesTableContainer');
    const totalDisplay = document.getElementById('expenseTotalDisplay');
    if (!container) return;

    const list = JRMData.getExpenses(state.currentProgramId);
    const total = list.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    if (totalDisplay) {
      totalDisplay.textContent = `Total: ${JRMData.formatINR(total)} (${list.length} items)`;
    }

    if (list.length === 0) {
      container.innerHTML = `<p style="padding: 20px; text-align: center; color: var(--text-muted);">Koi expense logged nahi hai.</p>`;
      return;
    }

    container.innerHTML = `
      <div style="overflow-x: auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Expense Title / Head</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Paid To</th>
              <th>Mode</th>
              <th>Date</th>
              <th>Voucher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(e => `
              <tr>
                <td>${e.itemNo || ''}</td>
                <td><strong>${escapeHTML(e.title)}</strong></td>
                <td><span class="user-session-pill" style="font-size: 0.72rem;">${escapeHTML(e.category)}</span></td>
                <td style="font-weight: 800; color: var(--status-pending);">${JRMData.formatINR(e.amount)}</td>
                <td>${escapeHTML(e.paidTo || '-')}</td>
                <td>${escapeHTML(e.mode || 'Cash')}</td>
                <td>${escapeHTML(e.date)}</td>
                <td><code>${escapeHTML(e.voucherNo || '')}</code></td>
                <td>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn btn-outline btn-sm" onclick="window.JRMApp.openEditExpenseModal('${e.id}')">✏️</button>
                    <button class="btn btn-outline btn-sm" style="color: var(--status-pending);" onclick="window.JRMApp.deleteExpenseEntry('${e.id}')">🗑️</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================================================
  // VIEW 7: CALL BOOK CRM (Pending Balances)
  // ==========================================================================
  function renderCallBook() {
    const container = document.getElementById('callBookGridContainer');
    const countDisplay = document.getElementById('callBookCountDisplay');
    if (!container) return;

    const all = JRMData.getCollections(state.currentProgramId);
    const pendingList = all.filter(c => Number(c.balance) > 0);

    if (countDisplay) {
      countDisplay.textContent = `${pendingList.length} members with pending balance`;
    }

    if (pendingList.length === 0) {
      container.innerHTML = `
        <div style="padding: 30px; text-align: center; background: var(--bg-subtle); border-radius: var(--radius-sm);">
          <div style="font-size: 2rem;">✅</div>
          <h4 style="color: var(--status-paid); margin: 6px 0;">Alhamdulillah! Koi Pending Balance Nahi Hai</h4>
          <p style="font-size: 0.82rem; color: var(--text-muted);">Sabhi members ke accounts clear hain.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = pendingList.map(c => `
      <div class="callbook-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">${escapeHTML(c.name)}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Phone: ${escapeHTML(c.phone || 'Phone not set')}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Balance Due</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--status-pending);">${JRMData.formatINR(c.balance)}</div>
          </div>
        </div>

        <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px;">
          ${c.phone ? `
            <a href="tel:${escapeHTML(c.phone.replace(/\s+/g, ''))}" class="btn btn-outline btn-sm">
              📞 Direct Call
            </a>
          ` : `
            <button class="btn btn-outline btn-sm" onclick="window.JRMApp.openEditCollectionModal('${c.id}')">
              + Add Phone
            </button>
          `}
          <button class="btn btn-whatsapp btn-sm" onclick="window.JRMApp.sendWhatsAppReminder('${c.id}')">
            💬 WhatsApp Reminder
          </button>
          <button class="btn btn-primary btn-sm" onclick="window.JRMApp.quickSettleModal('${c.id}')">
            ✓ Receive Payment
          </button>
        </div>
      </div>
    `).join('');
  }

  function sendWhatsAppReminder(id) {
    const c = JRMData.getCollectionById(id);
    const settings = JRMData.getSettings();
    const prog = JRMData.getActiveProgram();
    if (!c) return;

    const text =
      `Assalamu Alaikum *${c.name}* Bhai,\n\n` +
      `Jamat Raza-e-Mustafa Antophill Mumbai *${prog ? prog.title : 'Mahana Mehfil'}* ke silsile me aapka contribution balance *${JRMData.formatINR(c.balance)}* baki hai.\n\n` +
      `Meharbani karke Cash ya Bank UPI ke zariye apna hisab jama kara dein taaki program intezamat me asani ho sake.\n\n` +
      `Aap apna statement online bhi dekh sakte hain:\n` +
      `https://${settings.domain}/#verify/${c.token}\n\n` +
      `JazakAllah Khair.\n` +
      `*Zain & Zimmedaran Committee — JRM Antophill*`;

    const phoneClean = (c.phone || '').replace(/[^0-9]/g, '');
    const phoneParam = phoneClean ? `phone=${phoneClean.length === 10 ? '91' + phoneClean : phoneClean}&` : '';
    const url = `https://api.whatsapp.com/send?${phoneParam}text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  function quickSettleModal(id) {
    const c = JRMData.getCollectionById(id);
    if (!c) return;

    const amountStr = prompt(`Receive payment for ${c.name}\nCurrent Balance: ₹${c.balance}\nEnter amount paid now:`, c.balance);
    if (!amountStr) return;

    const paidNow = Number(amountStr);
    if (isNaN(paidNow) || paidNow <= 0) {
      alert('Sahi amount daalein.');
      return;
    }

    const newBalance = Math.max(0, (Number(c.balance) || 0) - paidNow);
    c.paid = (Number(c.paid) || 0) + paidNow;
    c.balance = newBalance;
    c.status = newBalance === 0 ? 'paid' : 'pending';
    c.notes = (c.notes ? c.notes + ' | ' : '') + `Paid ₹${paidNow} on ${getISTISODate()} (IST)`;

    JRMData.saveCollection(c);
    renderAll();
    showToast(`Payment of ₹${paidNow} recorded for ${c.name}`);
  }

  // ==========================================================================
  // VIEW 8: WHATSAPP REPORTS GENERATOR (Separated Collection & Expense)
  // ==========================================================================
  function setWhatsAppTab(tab) {
    state.activeWhatsAppTab = tab;
    const tabCol = document.getElementById('tabWhatsAppCollection');
    const tabExp = document.getElementById('tabWhatsAppExpense');

    if (tabCol) tabCol.classList.toggle('active', tab === 'collection');
    if (tabExp) tabExp.classList.toggle('active', tab === 'expense');

    renderWhatsAppPreview();
  }

  function generateWhatsAppCollectionMessage() {
    const prog = JRMData.getActiveProgram();
    const collections = JRMData.getCollections(prog ? prog.id : null);
    const settings = JRMData.getSettings();
    const metrics = JRMData.getMetrics(prog ? prog.id : null);

    let text = `*${prog ? prog.title : '(40) MAHANA SUNNI DEENI NASHISHT MEHFIL'} (Collection)*\n`;
    text += `*Jamat Raza-e-Mustafa Antophill Mumbai*\n\n`;
    text += `*Date :${prog ? prog.date : getISTISODate()}/*\n\n`;
    text += `*👇Team Member Collection 👇*\n\n`;

    collections.forEach((c) => {
      const isPaid = Number(c.balance) === 0 && Number(c.paid) > 0;
      const isPending = Number(c.balance) > 0;
      const sr = c.memberNo || '';

      if (isPaid) {
        text += `*${sr}/${c.name} paid ${c.paid} ✅*\n`;
      } else if (isPending) {
        if (Number(c.paid) > 0) {
          text += `*${sr}/${c.name} BAL ${c.balance}*✅\n`;
        } else {
          text += `*${sr}/${c.name} BAL ${c.balance} ❌*\n`;
        }
      } else {
        text += `*${sr}/${c.name} BAL 0*\n`;
      }
    });

    text += `\n______________________________\n`;
    text += `*Total Collection* =           *${metrics.totalCollected.toLocaleString('en-IN')}*₹\n\n`;
    text += `*Online Verified Records:* https://${settings.domain}\n`;
    text += `*Zain & Zimmedaran Committee — JRM Antophill Mumbai*`;

    return text;
  }

  function generateWhatsAppExpenseMessage() {
    const prog = JRMData.getActiveProgram();
    const expenses = JRMData.getExpenses(prog ? prog.id : null);
    const settings = JRMData.getSettings();
    const metrics = JRMData.getMetrics(prog ? prog.id : null);

    let text = `*Jamat Raza e Mustafa Antophill Mumbai*\n\n`;
    text += `*MAAHANA SUNNI DEENI NASHIST PROGRAM MANAGEMENT EXPENSES*\n`;
    text += `*${prog ? prog.day : 'Monday'}(${prog ? prog.month : 'September'}) ${prog ? prog.date : getISTISODate()}*\n\n`;

    expenses.forEach((e) => {
      const sr = e.itemNo || '';
      const cat = e.title.toUpperCase();
      text += `*${sr}:-${cat}= ${e.amount}*\n`;
    });

    text += `\n*COLLECTION RECEIVED IN MONTH OF ${prog ? (prog.month || '').toUpperCase() : 'PROGRAM'} TOTAL ${metrics.totalCollected}*\n\n`;
    text += `*EXPENSE=${metrics.totalExpenses.toLocaleString('en-IN')}*\n`;
    text += `*NET BALANCE IN HAND=${metrics.netBalance.toLocaleString('en-IN')}₹*\n\n`;
    text += `*Official Portal:* https://${settings.domain}\n`;
    text += `*Zain & Committee Zimmedaran*`;

    return text;
  }

  function renderWhatsAppPreview() {
    const preview = document.getElementById('whatsappMessagePreview');
    if (!preview) return;

    if (state.activeWhatsAppTab === 'collection') {
      preview.textContent = generateWhatsAppCollectionMessage();
    } else {
      preview.textContent = generateWhatsAppExpenseMessage();
    }
  }

  function shareCurrentWhatsApp() {
    const text = state.activeWhatsAppTab === 'collection'
      ? generateWhatsAppCollectionMessage()
      : generateWhatsAppExpenseMessage();

    const url = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
  }

  function copyCurrentWhatsApp() {
    const text = state.activeWhatsAppTab === 'collection'
      ? generateWhatsAppCollectionMessage()
      : generateWhatsAppExpenseMessage();

    navigator.clipboard.writeText(text).then(() => {
      showToast('WhatsApp message copied to clipboard!');
    }).catch(() => {
      showToast('Clipboard copy failed.');
    });
  }

  // ==========================================================================
  // VIEW 9: PROGRAM & POSTER MANAGER
  // ==========================================================================
  function renderProgramManagerForm() {
    const prog = JRMData.getActiveProgram();
    const settings = JRMData.getSettings();
    if (!prog) return;

    const titleIn = document.getElementById('progTitleInput');
    const monthIn = document.getElementById('progMonthInput');
    const yearIn = document.getElementById('progYearInput');
    const dayIn = document.getElementById('progDayInput');
    const dateIn = document.getElementById('progDateInput');
    const timeIn = document.getElementById('progTimeInput');
    const venueIn = document.getElementById('progVenueInput');
    const posterIn = document.getElementById('progPosterUrlInput');
    const announcementIn = document.getElementById('progAnnouncementInput');

    if (titleIn) titleIn.value = prog.title || '';
    if (monthIn) monthIn.value = prog.month || '';
    if (yearIn) yearIn.value = prog.year || 2026;
    if (dayIn) dayIn.value = prog.day || '';
    if (dateIn) dateIn.value = prog.date || '';
    if (timeIn) timeIn.value = prog.time || '08:30 PM (IST)';
    if (venueIn) venueIn.value = prog.venue || '';
    if (posterIn) posterIn.value = prog.posterUrl || settings.activePosterUrl || '';
    if (announcementIn) announcementIn.value = prog.posterAnnouncement || settings.posterAnnouncement || '';
  }

  function saveProgramPoster(e) {
    e.preventDefault();
    const prog = JRMData.getActiveProgram();
    if (!prog) return;

    const fileInput = document.getElementById('progPosterFileInput');
    const title = document.getElementById('progTitleInput').value.trim();
    const month = document.getElementById('progMonthInput').value.trim();
    const year = Number(document.getElementById('progYearInput').value) || 2026;
    const day = document.getElementById('progDayInput').value.trim();
    const date = document.getElementById('progDateInput').value.trim();
    const time = document.getElementById('progTimeInput').value.trim();
    const venue = document.getElementById('progVenueInput').value.trim();
    const posterUrl = document.getElementById('progPosterUrlInput').value.trim();
    const announcement = document.getElementById('progAnnouncementInput').value.trim();

    function finalize(imgUrl) {
      prog.title = title;
      prog.month = month;
      prog.year = year;
      prog.day = day;
      prog.date = date;
      prog.time = time;
      prog.venue = venue;
      prog.posterUrl = imgUrl;
      prog.posterAnnouncement = announcement;

      JRMData.saveProgram(prog);
      JRMData.saveSettings({
        activePosterUrl: imgUrl,
        posterAnnouncement: announcement
      });

      renderAll();
      showToast('Upcoming Program & Poster updated successfully!');
      switchView('public-home');
    }

    if (fileInput && fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => finalize(ev.target.result);
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      finalize(posterUrl);
    }
  }

  // ==========================================================================
  // VIEW 10: SUPER ADMIN MASTER SETTINGS (Zain Only)
  // ==========================================================================
  function renderSuperSettings() {
    const settings = JRMData.getSettings();

    const superPinIn = document.getElementById('settingSuperPin');
    const adminPinIn = document.getElementById('settingAdminPin');
    if (superPinIn) superPinIn.value = settings.superAdminPin || '9999';
    if (adminPinIn) adminPinIn.value = settings.adminPin || '7860';

    // Bio links
    const bio = settings.bioLinks || {};
    const bioWa = document.getElementById('bioLinkWhatsApp');
    const bioIg = document.getElementById('bioLinkInstagram');
    const bioYt = document.getElementById('bioLinkYouTube');
    const bioMap = document.getElementById('bioLinkMaps');
    const bioHelp = document.getElementById('bioLinkHelpline');

    if (bioWa) bioWa.value = bio.whatsapp || '';
    if (bioIg) bioIg.value = bio.instagram || '';
    if (bioYt) bioYt.value = bio.youtube || '';
    if (bioMap) bioMap.value = bio.maps || '';
    if (bioHelp) bioHelp.value = bio.helpline || '';

    // Sheets config
    const sheetUrlIn = document.getElementById('sheetUrlInput');
    const sheetKeyIn = document.getElementById('sheetKeyInput');
    if (sheetUrlIn) sheetUrlIn.value = settings.googleSheetUrl || '';
    if (sheetKeyIn) sheetKeyIn.value = settings.googleSheetApiKey || '';

    renderMemberCredentialsTable();
    renderAuditLogsTable();
  }

  function renderMemberCredentialsTable() {
    const container = document.getElementById('memberCredentialsTableContainer');
    if (!container) return;

    const list = JRMData.getCollections();

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Member Name</th>
            <th>Registered Phone</th>
            <th>4-Digit PIN</th>
            <th>Receipt Token</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(c => `
            <tr>
              <td><strong>${escapeHTML(c.name)}</strong></td>
              <td>${escapeHTML(c.phone || 'Not registered')}</td>
              <td><code>${escapeHTML(c.pin || '1234')}</code></td>
              <td><code>${escapeHTML(c.token || '')}</code></td>
              <td>
                <button class="btn btn-outline btn-sm" onclick="window.JRMApp.openMemberPinModal('${c.id}')">
                  🔑 Edit PIN & Phone
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function renderAuditLogsTable() {
    const container = document.getElementById('auditLogsContainer');
    if (!container) return;

    const logs = JRMData.getLogs(60);

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>IST Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${logs.map(l => `
            <tr>
              <td style="white-space: nowrap; font-size: 0.75rem;"><strong>${l.istTime || getISTDateTime(new Date(l.timestamp))}</strong></td>
              <td>${escapeHTML(l.user)}</td>
              <td><code>${escapeHTML(l.action)}</code></td>
              <td style="font-size: 0.8rem;">${escapeHTML(l.details)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function saveSecurityPins(e) {
    e.preventDefault();
    const superPin = document.getElementById('settingSuperPin').value.trim();
    const adminPin = document.getElementById('settingAdminPin').value.trim();

    if (!superPin || !adminPin) {
      alert('Dono PINs zaroori hain.');
      return;
    }

    JRMData.saveSettings({
      superAdminPin: superPin,
      adminPin: adminPin
    });

    JRMData.log('SECURITY_PIN_CHANGE', 'Super Admin updated access PINs.');
    showToast('Security PINs updated successfully!');
  }

  function saveBioLinks(e) {
    e.preventDefault();
    const bioLinks = {
      whatsapp: document.getElementById('bioLinkWhatsApp').value.trim(),
      instagram: document.getElementById('bioLinkInstagram').value.trim(),
      youtube: document.getElementById('bioLinkYouTube').value.trim(),
      maps: document.getElementById('bioLinkMaps').value.trim(),
      helpline: document.getElementById('bioLinkHelpline').value.trim()
    };

    JRMData.saveSettings({ bioLinks });
    JRMData.log('BIO_LINKS_UPDATE', 'Updated official community bio links.');
    renderPublicHome();
    showToast('Official Bio Links updated!');
  }

  function saveSheetSettings() {
    const url = document.getElementById('sheetUrlInput').value.trim();
    const key = document.getElementById('sheetKeyInput').value.trim();
    JRMData.saveSettings({
      googleSheetUrl: url,
      googleSheetApiKey: key
    });
    showToast('Google Sheets configuration saved.');
  }

  async function syncGoogleSheets() {
    const settings = JRMData.getSettings();
    if (!settings.googleSheetUrl) {
      alert('Kripya pehle Google Apps Script Web App URL save karein.');
      return;
    }

    const btn = document.getElementById('syncSheetsBtn');
    if (btn) btn.textContent = 'Syncing...';

    try {
      const payload = {
        action: 'sync',
        apiKey: settings.googleSheetApiKey,
        collections: JRMData.getCollections(),
        expenses: JRMData.getExpenses(),
        programs: JRMData.getPrograms()
      };

      const resp = await fetch(settings.googleSheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const res = await resp.json();
      if (res && res.success) {
        showToast('Google Sheets sync successful!');
        JRMData.log('SHEETS_SYNC', `Synchronized records with Google Sheets at ${getISTDateTime()}`);
      } else {
        throw new Error(res.error || 'Failed to sync');
      }
    } catch (err) {
      showToast('Sheets Sync Error: ' + err.message);
    } finally {
      if (btn) btn.textContent = 'Sync with Google Sheets';
    }
  }

  function exportJSONBackup() {
    const json = JRMData.exportFullBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `JRM_Database_Backup_IST_${getISTISODate()}.json`;
    link.click();
    showToast('JSON Backup downloaded.');
  }

  function triggerJSONImport() {
    const fileIn = document.getElementById('jsonImportInput');
    if (fileIn) fileIn.click();
  }

  function handleJSONImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = JRMData.importFullBackup(ev.target.result);
      if (res.success) {
        renderAll();
        showToast('Database successfully restored from JSON!');
      } else {
        alert('Invalid backup file: ' + res.error);
      }
    };
    reader.readAsText(file);
  }

  function resetDatabase() {
    if (confirm('CAUTION: Kya aap poore database ko factory default par reset karna chahte hain?')) {
      JRMData.resetToDefault();
      renderAll();
      showToast('Database reset to factory default.');
    }
  }

  // ==========================================================================
  // RECEIPT & VERIFY ENGINE
  // ==========================================================================
  function searchReceipt(e) {
    e.preventDefault();
    const input = document.getElementById('receiptSearchInput');
    if (!input) return;
    performReceiptSearch(input.value);
  }

  function performReceiptSearch(query) {
    const resultBox = document.getElementById('receiptLookupResult');
    if (!resultBox) return;

    if (!query || !query.trim()) {
      resultBox.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">Token enter karein.</p>`;
      return;
    }

    const clean = query.trim().toUpperCase();
    const all = JRMData.getCollections();
    const matches = all.filter(c =>
      (c.token && c.token.toUpperCase().includes(clean)) ||
      (c.name && c.name.toUpperCase().includes(clean))
    );

    if (matches.length === 0) {
      resultBox.innerHTML = `
        <div style="background: var(--status-pending-bg); border: 1px solid var(--status-pending); padding: 14px; border-radius: var(--radius-sm); color: var(--status-pending); font-size: 0.85rem;">
          ❌ Koi verified record nahi mila: <strong>${escapeHTML(query)}</strong>.
        </div>
      `;
      return;
    }

    resultBox.innerHTML = matches.map(r => `
      <div style="background: var(--bg-surface); border: 1px solid var(--border); padding: 14px; border-radius: var(--radius-sm); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div>
          <div style="font-weight: 700; font-size: 0.95rem;">${escapeHTML(r.name)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Receipt Token: <code>${escapeHTML(r.token || '')}</code> • Date: ${escapeHTML(r.date)} (IST)</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="font-weight: 800; color: var(--status-paid); font-size: 1.1rem;">${JRMData.formatINR(r.paid)}</div>
          <button class="btn btn-primary btn-sm" onclick="window.JRMApp.viewReceipt('${r.id}')">View Official Receipt</button>
        </div>
      </div>
    `).join('');
  }

  function viewReceipt(id) {
    const c = JRMData.getCollectionById(id);
    const settings = JRMData.getSettings();
    const prog = JRMData.getActiveProgram();
    if (!c) return;

    const modalContent = document.getElementById('receiptModalContent');
    if (!modalContent) return;

    modalContent.innerHTML = `
      <div class="receipt-paper">
        <div class="receipt-head">
          <div class="receipt-org">${escapeHTML(settings.orgFull)}</div>
          <div class="receipt-sub">${escapeHTML(settings.orgBranch)} • Jamat Raza-e-Mustafa</div>
          <div style="font-size: 0.7rem; font-weight: 700; color: var(--brand-green); margin-top: 4px; letter-spacing: 0.5px;">OFFICIAL DONATION RECEIPT • IST VERIFIED</div>
        </div>

        <div class="receipt-grid">
          <div>
            <span class="receipt-label">Receipt No. / Token</span>
            <span class="receipt-val"><code>${escapeHTML(c.token || '')}</code></span>
          </div>
          <div>
            <span class="receipt-label">Date (IST)</span>
            <span class="receipt-val">${escapeHTML(c.date)}</span>
          </div>
          <div>
            <span class="receipt-label">Received From (Member)</span>
            <span class="receipt-val"><strong>${escapeHTML(c.name)}</strong></span>
          </div>
          <div>
            <span class="receipt-label">Payment Mode</span>
            <span class="receipt-val">${escapeHTML(c.mode || 'Cash')}</span>
          </div>
          <div>
            <span class="receipt-label">Program Purpose</span>
            <span class="receipt-val">${escapeHTML(prog ? prog.title : 'Mahana Sunni Deeni Nashisht')}</span>
          </div>
          <div>
            <span class="receipt-label">Amount Received</span>
            <span class="receipt-val" style="font-size: 1.1rem; color: var(--brand-green);">${JRMData.formatINR(c.paid)}</span>
          </div>
        </div>

        <div style="background: #F8FBF9; border: 1px dashed #BAC7BE; padding: 10px; border-radius: 4px; margin-bottom: 14px; font-size: 0.8rem;">
          <strong>Amount in Words:</strong> ${JRMData.numberToWordsINR(c.paid)}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #DDD; padding-top: 10px; font-size: 0.72rem; color: #777;">
          <div>
            Verified Digital Record • Indian Standard Time (IST)<br>
            Developed by esitesz • jrmantophill.esitesz.com
          </div>
          <div style="text-align: center; border-top: 1px dashed #999; width: 140px; padding-top: 2px;">
            Authorized Signatory<br>
            <strong>Zain / Zimmedaran</strong>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 14px;" class="no-print">
        <button class="btn btn-outline" onclick="window.print()">🖨️ Print Receipt</button>
        <button class="btn btn-whatsapp" onclick="window.JRMApp.sendWhatsAppReceipt('${c.id}')">📱 Send on WhatsApp</button>
      </div>
    `;

    openModal('receiptModal');
  }

  function sendWhatsAppReceipt(id) {
    const c = JRMData.getCollectionById(id);
    const settings = JRMData.getSettings();
    const prog = JRMData.getActiveProgram();
    if (!c) return;

    const text =
      `*JAMAT RAZA-E-MUSTAFA ANTOPHILL MUMBAI*\n` +
      `*OFFICIAL DONATION RECEIPT*\n\n` +
      `Assalamu Alaikum *${c.name}* Bhai,\n` +
      `Aapka mehfil fund Alhamdulillah received ho gaya hai:\n\n` +
      `*Program:* ${prog ? prog.title : 'Mahana Sunni Deeni Nashisht'}\n` +
      `*Receipt No:* ${c.token}\n` +
      `*Amount Received:* ${JRMData.formatINR(c.paid)}\n` +
      `*Payment Mode:* ${c.mode || 'Cash'}\n` +
      `*Date (IST):* ${c.date} (Indian Standard Time)\n` +
      `${c.balance > 0 ? `*Balance Pending:* ${JRMData.formatINR(c.balance)}\n` : `*Status:* Paid in full ✅\n`}\n` +
      `Aap apni official digital receipt aur apna personal statement online dekh sakte hain:\n` +
      `https://${settings.domain}/#verify/${c.token}\n\n` +
      `JazakAllah Khair.\n` +
      `*Zain & Zimmedaran — Jamat Raza e Mustafa Antophill Mumbai*`;

    const phoneClean = (c.phone || '').replace(/[^0-9]/g, '');
    const phoneParam = phoneClean ? `phone=${phoneClean.length === 10 ? '91' + phoneClean : phoneClean}&` : '';
    const url = `https://api.whatsapp.com/send?${phoneParam}text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  // ==========================================================================
  // MODALS & AUTHENTICATION HANDLERS
  // ==========================================================================
  function openAccessPortalModal(defaultTab = 'member') {
    switchLoginTab(defaultTab);
    openModal('accessPortalModal');
  }

  function switchLoginTab(tab) {
    const tabMember = document.getElementById('loginTabMember');
    const tabAdmin = document.getElementById('loginTabAdmin');
    const tabSuper = document.getElementById('loginTabSuper');

    const formMember = document.getElementById('memberAuthForm');
    const formAdmin = document.getElementById('adminAuthForm');
    const formSuper = document.getElementById('superAuthForm');

    if (tabMember) tabMember.classList.toggle('active', tab === 'member');
    if (tabAdmin) tabAdmin.classList.toggle('active', tab === 'admin');
    if (tabSuper) tabSuper.classList.toggle('active', tab === 'super');

    if (formMember) formMember.style.display = tab === 'member' ? 'block' : 'none';
    if (formAdmin) formAdmin.style.display = tab === 'admin' ? 'block' : 'none';
    if (formSuper) formSuper.style.display = tab === 'super' ? 'block' : 'none';
  }

  function handleMemberLogin(e) {
    e.preventDefault();
    const id = document.getElementById('memberLoginIdentifier').value.trim();
    const pin = document.getElementById('memberLoginPin').value.trim();

    const res = JRMData.loginMember(id, pin);
    if (res.success) {
      closeModal('accessPortalModal');
      syncSessionState();
      switchView('statement');
      renderAll();
      showToast(`Welcome ${res.member.name}! Statement unlocked.`);
    } else {
      alert(res.error);
    }
  }

  function handleAdminLogin(e) {
    e.preventDefault();
    const pin = document.getElementById('adminLoginPin').value.trim();

    const res = JRMData.loginAdmin(pin);
    if (res.success) {
      closeModal('accessPortalModal');
      syncSessionState();
      switchView('admin-dashboard');
      renderAll();
      showToast('Committee Admin mode unlocked.');
    } else {
      alert(res.error);
    }
  }

  function handleSuperLogin(e) {
    e.preventDefault();
    const pin = document.getElementById('superLoginPin').value.trim();

    const res = JRMData.loginSuperAdmin(pin);
    if (res.success) {
      closeModal('accessPortalModal');
      syncSessionState();
      switchView('admin-dashboard');
      renderAll();
      showToast('👑 Zain Super Admin Master mode unlocked.');
    } else {
      alert(res.error);
    }
  }

  // Member PIN Edit Modal (Super Admin / Admin)
  function openMemberPinModal(memberId) {
    const member = JRMData.getCollectionById(memberId);
    if (!member) return;

    document.getElementById('editMemberId').value = member.id;
    document.getElementById('editMemberName').value = member.name;
    document.getElementById('editMemberPhone').value = member.phone || '';
    document.getElementById('editMemberPin').value = member.pin || '1234';

    openModal('memberPinModal');
  }

  function saveMemberPinEdit(e) {
    e.preventDefault();
    const id = document.getElementById('editMemberId').value;
    const phone = document.getElementById('editMemberPhone').value.trim();
    const pin = document.getElementById('editMemberPin').value.trim();

    const res = JRMData.updateMemberCredentials(id, pin, phone);
    if (res.success) {
      closeModal('memberPinModal');
      renderAll();
      showToast('Member credentials and 4-digit PIN updated successfully.');
    } else {
      alert(res.error);
    }
  }

  // Collection Entry Modals
  function openAddCollectionModal() {
    document.getElementById('collectionForm').reset();
    document.getElementById('collectionId').value = '';
    document.getElementById('collectionDate').value = getISTISODate();
    openModal('collectionModal');
  }

  function openEditCollectionModal(id) {
    const c = JRMData.getCollectionById(id);
    if (!c) return;

    document.getElementById('collectionId').value = c.id;
    document.getElementById('collectionName').value = c.name;
    document.getElementById('collectionPhone').value = c.phone || '';
    document.getElementById('collectionPaid').value = c.paid;
    document.getElementById('collectionBalance').value = c.balance || 0;
    document.getElementById('collectionMode').value = c.mode || 'Cash';
    document.getElementById('collectionDate').value = c.date || getISTISODate();
    document.getElementById('collectionNotes').value = c.notes || '';

    openModal('collectionModal');
  }

  function saveCollectionEntry(e) {
    e.preventDefault();
    const id = document.getElementById('collectionId').value;
    const name = document.getElementById('collectionName').value.trim();
    const phone = document.getElementById('collectionPhone').value.trim();
    const paid = Number(document.getElementById('collectionPaid').value) || 0;
    const balance = Number(document.getElementById('collectionBalance').value) || 0;
    const mode = document.getElementById('collectionMode').value;
    const date = document.getElementById('collectionDate').value;
    const notes = document.getElementById('collectionNotes').value.trim();
    const prog = JRMData.getActiveProgram();

    const existing = id ? JRMData.getCollectionById(id) : null;

    const entry = {
      id: id || undefined,
      name,
      phone,
      paid,
      balance,
      mode,
      date,
      notes,
      programId: prog ? prog.id : 'prog-oct-2026',
      status: balance === 0 ? 'paid' : 'pending',
      token: existing?.token,
      pin: existing?.pin || '1234'
    };

    JRMData.saveCollection(entry);
    closeModal('collectionModal');
    renderAll();
    showToast(`Collection record saved for ${name}`);
  }

  // Expense Entry Modals
  function openAddExpenseModal() {
    document.getElementById('expenseForm').reset();
    document.getElementById('expenseId').value = '';
    document.getElementById('expenseDate').value = getISTISODate();
    openModal('expenseModal');
  }

  function openEditExpenseModal(id) {
    const e = JRMData.getExpenses().find(item => item.id === id);
    if (!e) return;

    document.getElementById('expenseId').value = e.id;
    document.getElementById('expenseTitle').value = e.title;
    document.getElementById('expenseCategory').value = e.category || 'Nazrana';
    document.getElementById('expenseAmount').value = e.amount;
    document.getElementById('expensePaidTo').value = e.paidTo || '';
    document.getElementById('expenseDate').value = e.date || getISTISODate();
    document.getElementById('expenseNotes').value = e.notes || '';

    openModal('expenseModal');
  }

  function saveExpenseEntry(e) {
    e.preventDefault();
    const id = document.getElementById('expenseId').value;
    const title = document.getElementById('expenseTitle').value.trim();
    const category = document.getElementById('expenseCategory').value;
    const amount = Number(document.getElementById('expenseAmount').value) || 0;
    const paidTo = document.getElementById('expensePaidTo').value.trim();
    const date = document.getElementById('expenseDate').value;
    const notes = document.getElementById('expenseNotes').value.trim();
    const prog = JRMData.getActiveProgram();

    const entry = {
      id: id || undefined,
      title,
      category,
      amount,
      paidTo,
      date,
      notes,
      programId: prog ? prog.id : 'prog-sep-2026'
    };

    JRMData.saveExpense(entry);
    closeModal('expenseModal');
    renderAll();
    showToast(`Expense logged: ${title}`);
  }

  function deleteExpenseEntry(id) {
    if (confirm('Kya aap is expense ko delete karna chahte hain?')) {
      JRMData.deleteExpense(id);
      renderAll();
      showToast('Expense entry deleted.');
    }
  }

  function downloadCSV(type) {
    const content = type === 'collections'
      ? JRMData.exportCollectionsCSV(state.currentProgramId)
      : JRMData.exportExpensesCSV(state.currentProgramId);

    const filename = `JRM_${type}_IST_${getISTISODate()}.csv`;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    showToast(`Exported ${filename}`);
  }

  // Generic Modal Helpers
  function openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.add('active');
  }

  function closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove('active');
  }

  function showToast(msg) {
    if (!el.toastContainer) return;
    const t = document.createElement('div');
    t.className = 'toast-msg';
    t.textContent = msg;
    el.toastContainer.appendChild(t);
    setTimeout(() => {
      t.remove();
    }, 3200);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function goHome() {
    switchView('public-home');
  }

  // Public API Export
  window.JRMApp = {
    goHome,
    switchView,
    openAccessPortalModal,
    switchLoginTab,
    handleMemberLogin,
    handleAdminLogin,
    handleSuperLogin,
    logoutCurrent,
    openMemberPinModal,
    saveMemberPinEdit,
    previewMemberStatement,
    openAddCollectionModal,
    openEditCollectionModal,
    saveCollectionEntry,
    openAddExpenseModal,
    openEditExpenseModal,
    saveExpenseEntry,
    deleteExpenseEntry,
    sendWhatsAppReminder,
    quickSettleModal,
    setWhatsAppTab,
    shareCurrentWhatsApp,
    copyCurrentWhatsApp,
    saveProgramPoster,
    saveSecurityPins,
    saveBioLinks,
    saveSheetSettings,
    syncGoogleSheets,
    exportJSONBackup,
    triggerJSONImport,
    handleJSONImport,
    resetDatabase,
    searchReceipt,
    viewReceipt,
    sendWhatsAppReceipt,
    shareProgramInfo,
    downloadCSV,
    openModal,
    closeModal,
    handleProgramChange
  };

})(window, document);
