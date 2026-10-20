/**
 * JRM Antophill — Deeni Mehfil & Fund Portal
 * Application Controller (Minimal, Anti-AI-Slop, IST Timestamped)
 * Organization: Jamat Raza-e-Mustafa Antophill Mumbai
 * Developed by esitesz (jrmantophill.esitesz.com)
 */

(function () {
  'use strict';

  const state = {
    currentView: 'dashboard',
    activeProgramId: 'prog-oct-2026',
    isAdmin: false,
    loggedMember: null,
    searchQuery: '',
    statusFilter: 'all',
    modeFilter: 'all',
    activeWhatsAppTab: 'collection'
  };

  const el = {};

  // Indian Standard Time Helpers
  function getISTDateTime(dateObj = new Date()) {
    return dateObj.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) + ' IST';
  }

  function getISTDate(dateObj = new Date()) {
    return dateObj.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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

  // Live IST Clock update
  function updateISTClock() {
    const clockEl = document.getElementById('istLiveClock');
    if (clockEl) {
      clockEl.textContent = getISTDateTime();
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    initTheme();
    initState();
    initPWA();
    initNavigation();
    bindEvents();
    renderAll();

    // Start live IST clock
    updateISTClock();
    setInterval(updateISTClock, 30000);
  });

  function cacheElements() {
    el.themeToggle = document.getElementById('themeToggle');
    el.userRoleDisplay = document.getElementById('userRoleDisplay');
    el.loginActionBtn = document.getElementById('loginActionBtn');
    el.views = document.querySelectorAll('.app-view');
    el.navTabs = document.querySelectorAll('.nav-tab');
    el.toastContainer = document.getElementById('toastContainer');

    el.adminPinModal = document.getElementById('adminPinModal');
    el.adminPinInput = document.getElementById('adminPinInput');
    el.memberLoginModal = document.getElementById('memberLoginModal');
    el.memberSelectInput = document.getElementById('memberSelectInput');
    el.collectionModal = document.getElementById('collectionModal');
    el.expenseModal = document.getElementById('expenseModal');
    el.receiptModal = document.getElementById('receiptModal');
  }

  function initState() {
    state.isAdmin = JRMData.isAdminLoggedIn();
    state.loggedMember = JRMData.getLoggedInMember();

    const activeProg = JRMData.getActiveProgram();
    if (activeProg) state.activeProgramId = activeProg.id;

    updateHeaderUserPill();
    handleHashRoute();
    window.addEventListener('hashchange', handleHashRoute);
  }

  function handleHashRoute() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    if (hash.startsWith('verify/')) {
      const token = hash.replace('verify/', '');
      switchView('verify');
      const searchInput = document.getElementById('receiptSearchInput');
      if (searchInput) {
        searchInput.value = token;
        handleReceiptSearch(token);
      }
    } else if (['dashboard', 'statement', 'collections', 'expenses', 'callbook', 'whatsapp', 'verify', 'sheets', 'logs'].includes(hash)) {
      switchView(hash);
    }
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

  // Header Session UI
  function updateHeaderUserPill() {
    if (!el.userRoleDisplay || !el.loginActionBtn) return;

    if (state.isAdmin) {
      el.userRoleDisplay.className = 'user-session-pill admin-badge';
      el.userRoleDisplay.innerHTML = `<span>Zain (Admin)</span>`;
      el.loginActionBtn.textContent = 'Logout';
      el.loginActionBtn.onclick = logoutCurrent;
      document.querySelectorAll('.admin-only').forEach(n => n.style.display = '');
    } else if (state.loggedMember) {
      el.userRoleDisplay.className = 'user-session-pill';
      el.userRoleDisplay.innerHTML = `<span>👤 ${escapeHTML(state.loggedMember.name)}</span>`;
      el.loginActionBtn.textContent = 'Logout';
      el.loginActionBtn.onclick = logoutCurrent;
      document.querySelectorAll('.admin-only').forEach(n => n.style.display = 'none');
    } else {
      el.userRoleDisplay.className = 'user-session-pill';
      el.userRoleDisplay.innerHTML = `<span>Public View</span>`;
      el.loginActionBtn.textContent = 'Login';
      el.loginActionBtn.onclick = openLoginPicker;
      document.querySelectorAll('.admin-only').forEach(n => n.style.display = 'none');
    }
  }

  function openLoginPicker() {
    const choice = confirm("Press OK for Member Login (Apna hisab dekhne ke liye)\nPress Cancel for Admin Login (Zain / Zimmedaran)");
    if (choice) {
      openMemberLoginModal();
    } else {
      openAdminPinModal();
    }
  }

  function logoutCurrent() {
    if (state.isAdmin) {
      if (confirm('Zain (Admin) mode se logout karna chahte hain?')) {
        JRMData.logoutAdmin();
        state.isAdmin = false;
        updateHeaderUserPill();
        renderAll();
        showToast('Logged out of Admin mode.');
      }
    } else if (state.loggedMember) {
      JRMData.logoutMember();
      state.loggedMember = null;
      updateHeaderUserPill();
      renderAll();
      showToast('Logged out of Member session.');
    }
  }

  function openAdminPinModal() {
    if (!el.adminPinModal) return;
    el.adminPinInput.value = '';
    el.adminPinModal.classList.add('active');
    setTimeout(() => el.adminPinInput.focus(), 100);
  }

  function submitAdminPin() {
    const pin = (el.adminPinInput.value || '').trim();
    const res = JRMData.loginAdmin(pin);
    if (res.success) {
      state.isAdmin = true;
      state.loggedMember = null;
      JRMData.logoutMember();
      el.adminPinModal.classList.remove('active');
      updateHeaderUserPill();
      renderAll();
      showToast('Zain (Admin) logged in successfully.');
    } else {
      showToast(res.error || 'Galat PIN', 'danger');
      el.adminPinInput.value = '';
      el.adminPinInput.focus();
    }
  }

  function openMemberLoginModal() {
    if (!el.memberLoginModal) return;
    const select = document.getElementById('memberSelectInput');
    if (select) {
      const collections = JRMData.getCollections();
      const seen = new Set();
      const distinct = [];
      collections.forEach(c => {
        if (!seen.has(c.name)) {
          seen.add(c.name);
          distinct.push(c);
        }
      });
      distinct.sort((a, b) => a.name.localeCompare(b.name));
      select.innerHTML = `<option value="">-- Apna Naam Chunein --</option>` +
        distinct.map(m => `<option value="${escapeHTML(m.name)}">${escapeHTML(m.name)}${m.phone ? ` (${m.phone})` : ''}</option>`).join('');
    }
    el.memberLoginModal.classList.add('active');
  }

  function submitMemberLogin() {
    const select = document.getElementById('memberSelectInput');
    const manualInput = document.getElementById('memberManualInput');
    const val = (select && select.value) ? select.value : (manualInput ? manualInput.value : '');

    const res = JRMData.loginMember(val);
    if (res.success) {
      state.loggedMember = res.member;
      state.isAdmin = false;
      JRMData.logoutAdmin();
      el.memberLoginModal.classList.remove('active');
      updateHeaderUserPill();
      switchView('statement');
      renderAll();
      showToast(`Welcome, ${state.loggedMember.name}!`);
    } else {
      showToast(res.error || 'Member record nahi mila', 'danger');
    }
  }

  // Navigation
  function initNavigation() {
    el.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        switchView(tab.getAttribute('data-view'));
      });
    });
  }

  function switchView(viewName) {
    state.currentView = viewName;
    window.location.hash = viewName;

    el.navTabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-view') === viewName);
    });

    el.views.forEach(view => {
      view.classList.toggle('active', view.id === `view-${viewName}`);
    });

    if (viewName === 'dashboard') renderDashboard();
    else if (viewName === 'statement') renderStatementView();
    else if (viewName === 'collections') renderCollections();
    else if (viewName === 'expenses') renderExpenses();
    else if (viewName === 'callbook') renderCallBook();
    else if (viewName === 'whatsapp') renderWhatsAppView();
    else if (viewName === 'verify') renderVerifyView();
    else if (viewName === 'sheets') renderSheetsView();
    else if (viewName === 'logs') renderLogsView();
  }

  function renderAll() {
    renderProgramStrip();
    renderPendingBadge();
    switchView(state.currentView);
  }

  function renderProgramStrip() {
    const prog = JRMData.getProgramById(state.activeProgramId) || JRMData.getActiveProgram();
    const banner = document.getElementById('activeProgramStrip');
    if (!banner || !prog) return;

    banner.innerHTML = `
      <div>
        <h2>${escapeHTML(prog.title)}</h2>
        <p>${escapeHTML(prog.day)}, ${escapeHTML(prog.date)} (${escapeHTML(prog.month)} ${prog.year}) • Antophill, Mumbai • Timezone: Asia/Kolkata (IST)</p>
      </div>
      <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <span class="user-session-pill" style="font-size: 0.72rem; color: var(--brand-green);">
          🇮🇳 IST: <strong id="istLiveClock">${getISTDateTime()}</strong>
        </span>
        <select id="programSelector" class="form-input" style="width: auto; padding: 4px 8px; font-size: 0.82rem;">
          ${JRMData.getPrograms().map(p => `
            <option value="${p.id}" ${p.id === prog.id ? 'selected' : ''}>${escapeHTML(p.title)} (${p.month} ${p.year})</option>
          `).join('')}
        </select>
        ${!state.loggedMember && !state.isAdmin ? `
          <button class="btn btn-outline btn-sm" onclick="window.JRMApp.openMemberLoginModal()">Member Login</button>
        ` : ''}
      </div>
    `;

    const selector = document.getElementById('programSelector');
    if (selector) {
      selector.addEventListener('change', (e) => {
        state.activeProgramId = e.target.value;
        renderAll();
      });
    }
  }

  function renderPendingBadge() {
    const badge = document.getElementById('pendingNavBadge');
    if (!badge) return;
    const pending = JRMData.getPendingMembers(state.activeProgramId);
    badge.textContent = pending.length;
    badge.style.display = pending.length > 0 ? 'inline-block' : 'none';
  }

  // Dashboard
  function renderDashboard() {
    const metrics = JRMData.getMetrics(state.activeProgramId);
    const container = document.getElementById('dashboardKPIs');
    if (!container) return;

    container.innerHTML = `
      <div class="metric-card">
        <div class="metric-title">Total Fund Collection</div>
        <div class="metric-number" style="color: var(--brand-green);">${JRMData.formatINR(metrics.totalCollected)}</div>
        <div class="metric-note">${metrics.paidCount} of ${metrics.totalMembers} members contributed</div>
      </div>

      <div class="metric-card">
        <div class="metric-title">Total Management Expenses</div>
        <div class="metric-number">${JRMData.formatINR(metrics.totalExpenses)}</div>
        <div class="metric-note">Nazrana, Rent, Niyaz, Sound, Parchun</div>
      </div>

      <div class="metric-card">
        <div class="metric-title">Net Balance in Hand</div>
        <div class="metric-number" style="color: ${metrics.netBalance >= 0 ? 'var(--brand-green)' : 'var(--status-pending)'};">
          ${JRMData.formatINR(metrics.netBalance)}
        </div>
        <div class="metric-note">Cash: ${JRMData.formatINR(metrics.cashCollected)} | Bank: ${JRMData.formatINR(metrics.bankCollected)}</div>
      </div>

      <div class="metric-card">
        <div class="metric-title">Pending Balance</div>
        <div class="metric-number" style="color: var(--status-pending);">${JRMData.formatINR(metrics.totalPendingBalance)}</div>
        <div class="metric-note">${metrics.pendingCount} members pending follow-up</div>
      </div>
    `;

    renderRecentDashboardCollections();
    renderRecentDashboardExpenses();
  }

  function renderRecentDashboardCollections() {
    const listContainer = document.getElementById('dashboardRecentCollections');
    if (!listContainer) return;
    const collections = JRMData.getCollections(state.activeProgramId).slice(0, 8);

    listContainer.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Member Name</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Mode</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            ${collections.map(c => `
              <tr>
                <td><strong>${c.memberNo || ''}</strong></td>
                <td>${escapeHTML(c.name)}</td>
                <td style="font-weight: 700; color: var(--status-paid);">${JRMData.formatINR(c.paid)}</td>
                <td style="color: ${c.balance > 0 ? 'var(--status-pending)' : 'var(--text-muted)'}; font-weight: 600;">
                  ${c.balance > 0 ? JRMData.formatINR(c.balance) : '—'}
                </td>
                <td><span class="status-pill mode">${escapeHTML(c.mode || 'Cash')}</span></td>
                <td>
                  <button class="btn btn-outline btn-sm" onclick="window.JRMApp.openReceipt('${c.id}')">Receipt</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderRecentDashboardExpenses() {
    const listContainer = document.getElementById('dashboardRecentExpenses');
    if (!listContainer) return;
    const expenses = JRMData.getExpenses().slice(0, 6);

    listContainer.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Head</th>
              <th>Amount</th>
              <th>Paid To</th>
            </tr>
          </thead>
          <tbody>
            ${expenses.map(e => `
              <tr>
                <td><strong>${escapeHTML(e.title)}</strong></td>
                <td><span class="status-pill mode">${escapeHTML(e.category)}</span></td>
                <td style="font-weight: 700;">${JRMData.formatINR(e.amount)}</td>
                <td>${escapeHTML(e.paidTo || '—')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Member Statement & Ledger View (Personal History & Month Fund Transparency)
  function renderStatementView() {
    const container = document.getElementById('memberStatementContainer');
    if (!container) return;

    if (!state.loggedMember) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-md);">
          <h3 style="margin-bottom: 8px;">Member Statement & Ledger Access</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 16px;">
            Apna naam chunein taaki aap dekh sakein aapne kab kitna fund diya (with IST Date & Time), receipt download karein, aur us month ka kul fund & kharcha transparently check karein.
          </p>
          <button class="btn btn-primary" onclick="window.JRMApp.openMemberLoginModal()">Apna Member Account Kholein</button>
        </div>
      `;
      return;
    }

    const memberName = state.loggedMember.name;
    const ledger = JRMData.getMemberLedger(memberName);
    const metrics = JRMData.getMetrics(state.activeProgramId);
    const expenses = JRMData.getExpenses();

    const totalMemberPaid = ledger.reduce((acc, c) => acc + (Number(c.paid) || 0), 0);
    const totalMemberBal = ledger.reduce((acc, c) => acc + (Number(c.balance) || 0), 0);

    container.innerHTML = `
      <!-- Member Overview -->
      <div style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 18px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; border-bottom: 1px solid var(--border); padding-bottom: 10px;">
          <div>
            <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Member Personal Account • India Standard Time (IST)</span>
            <h2 style="font-size: 1.2rem; font-weight: 800; color: var(--text-main);">${escapeHTML(memberName)}</h2>
            ${state.loggedMember.phone ? `<p style="font-size: 0.8rem; color: var(--text-muted);">Phone: ${escapeHTML(state.loggedMember.phone)}</p>` : ''}
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline btn-sm" onclick="window.print()">🖨️ Print Statement</button>
            <button class="btn btn-outline btn-sm" onclick="window.JRMApp.logoutCurrent()">Change Member</button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 14px;">
          <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border);">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">AAPKA KUL YOGDAN (PAID)</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: var(--status-paid); margin-top: 2px;">${JRMData.formatINR(totalMemberPaid)}</div>
          </div>
          <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border);">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">BAKI RAKAM (PENDING BAL)</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: ${totalMemberBal > 0 ? 'var(--status-pending)' : 'var(--text-muted)'}; margin-top: 2px;">${JRMData.formatINR(totalMemberBal)}</div>
          </div>
          <div style="background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border);">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">VERIFIED STATUS</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--brand-green); margin-top: 4px;">Verified Member (IST Logged)</div>
          </div>
        </div>

        <h3 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 10px;">Aapka Payment History (Kab Kitna Diya)</h3>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date (IST)</th>
                <th>Program / Mehfil</th>
                <th>Amount Paid</th>
                <th>Balance</th>
                <th>Mode</th>
                <th>Receipt Token</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${ledger.map(c => `
                <tr>
                  <td><strong>${escapeHTML(c.date)} (IST)</strong></td>
                  <td>Mahana Sunni Deeni Nashisht</td>
                  <td style="font-weight: 700; color: var(--status-paid);">${JRMData.formatINR(c.paid)}</td>
                  <td style="color: ${c.balance > 0 ? 'var(--status-pending)' : 'var(--text-muted)'}; font-weight: 600;">
                    ${c.balance > 0 ? JRMData.formatINR(c.balance) : 'Nil'}
                  </td>
                  <td><span class="status-pill mode">${escapeHTML(c.mode || 'Cash')}</span></td>
                  <td><code>${escapeHTML(c.token || '')}</code></td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="window.JRMApp.openReceipt('${c.id}')">View Receipt</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Month Transparency & Fund Breakdown for Member -->
      <div style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 18px;">
        <div class="content-box-header">
          <div>
            <h3>Us Mahine Ka Total Fund & Kharcha (Full Transparency)</h3>
            <span style="font-size: 0.78rem; color: var(--text-muted);">Mahana Mehfil ke kul hisab ki jankari har member ke liye</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 18px;">
          <div style="border: 1px solid var(--border); padding: 12px; border-radius: var(--radius-sm);">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">KUL FUND COLLECTION</div>
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--brand-green); margin-top: 2px;">${JRMData.formatINR(metrics.totalCollected)}</div>
          </div>
          <div style="border: 1px solid var(--border); padding: 12px; border-radius: var(--radius-sm);">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">KUL PROGRAM KHARCHA</div>
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--text-main); margin-top: 2px;">${JRMData.formatINR(metrics.totalExpenses)}</div>
          </div>
          <div style="border: 1px solid var(--border); padding: 12px; border-radius: var(--radius-sm);">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">NET BACHAT IN HAND</div>
            <div style="font-size: 1.3rem; font-weight: 800; color: var(--status-paid); margin-top: 2px;">${JRMData.formatINR(metrics.netBalance)}</div>
          </div>
        </div>

        <h4 style="font-size: 0.88rem; font-weight: 700; margin-bottom: 10px; color: var(--text-muted); text-transform: uppercase;">Kahan Kahan Kharcha Hua (Expense Breakdown):</h4>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Head</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Recipient / Notes</th>
              </tr>
            </thead>
            <tbody>
              ${expenses.map(e => `
                <tr>
                  <td><strong>${escapeHTML(e.title)}</strong></td>
                  <td><span class="status-pill mode">${escapeHTML(e.category)}</span></td>
                  <td style="font-weight: 700;">${JRMData.formatINR(e.amount)}</td>
                  <td>${escapeHTML(e.paidTo || '')} ${e.notes ? `• <small style="color: var(--text-muted);">${escapeHTML(e.notes)}</small>` : ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // Collections View
  function renderCollections() {
    const listContainer = document.getElementById('collectionsTableContainer');
    if (!listContainer) return;

    let collections = JRMData.getCollections(state.activeProgramId);

    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      collections = collections.filter(c =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q)) ||
        (c.token && c.token.toLowerCase().includes(q))
      );
    }
    if (state.statusFilter === 'paid') {
      collections = collections.filter(c => (Number(c.paid) || 0) > 0 && (Number(c.balance) || 0) === 0);
    } else if (state.statusFilter === 'pending') {
      collections = collections.filter(c => (Number(c.balance) || 0) > 0 || (Number(c.paid) || 0) === 0);
    }

    if (state.modeFilter !== 'all') {
      collections = collections.filter(c => (c.mode || '').toLowerCase().includes(state.modeFilter.toLowerCase()));
    }

    const countSpan = document.getElementById('collectionCountDisplay');
    if (countSpan) {
      const totalSum = collections.reduce((acc, c) => acc + (Number(c.paid) || 0), 0);
      countSpan.textContent = `${collections.length} members (Total: ${JRMData.formatINR(totalSum)})`;
    }

    listContainer.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Member Name</th>
              <th>Contact</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Token</th>
              <th>Date (IST)</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${collections.map(c => `
              <tr>
                <td>${c.memberNo || ''}</td>
                <td>
                  <strong>${escapeHTML(c.name)}</strong>
                  ${c.notes ? `<div style="font-size: 0.72rem; color: var(--text-muted);">${escapeHTML(c.notes)}</div>` : ''}
                </td>
                <td>${c.phone ? `<a href="tel:${escapeHTML(c.phone)}" style="color: var(--brand-green);">${escapeHTML(c.phone)}</a>` : '—'}</td>
                <td style="font-weight: 700; color: var(--status-paid);">${JRMData.formatINR(c.paid)}</td>
                <td style="color: ${c.balance > 0 ? 'var(--status-pending)' : 'var(--text-muted)'}; font-weight: 600;">
                  ${c.balance > 0 ? JRMData.formatINR(c.balance) : '0'}
                </td>
                <td><span class="status-pill mode">${escapeHTML(c.mode || 'Cash')}</span></td>
                <td>
                  ${c.paid > 0 ? `<span class="status-pill paid">Paid</span>` : `<span class="status-pill pending">BAL</span>`}
                </td>
                <td><code>${escapeHTML(c.token || '')}</code></td>
                <td style="font-size: 0.78rem; white-space: nowrap;">${escapeHTML(c.date || '')}</td>
                <td style="text-align: right; white-space: nowrap;">
                  <button class="btn btn-outline btn-sm" onclick="window.JRMApp.openReceipt('${c.id}')">Receipt</button>
                  <button class="btn btn-whatsapp btn-sm" onclick="window.JRMApp.shareMemberReceiptWhatsApp('${c.id}')">WA</button>
                  ${state.isAdmin ? `
                    <button class="btn btn-outline btn-sm" onclick="window.JRMApp.openEditCollectionModal('${c.id}')">Edit</button>
                  ` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Expenses View
  function renderExpenses() {
    const listContainer = document.getElementById('expensesTableContainer');
    if (!listContainer) return;
    const expenses = JRMData.getExpenses();
    const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

    const totalDisplay = document.getElementById('expenseTotalDisplay');
    if (totalDisplay) totalDisplay.textContent = `Total: ${JRMData.formatINR(totalExpenses)}`;

    listContainer.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Voucher</th>
              <th>Expense Head</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Paid To</th>
              <th>Mode</th>
              <th>Date (IST)</th>
              ${state.isAdmin ? `<th style="text-align: right;">Action</th>` : ''}
            </tr>
          </thead>
          <tbody>
            ${expenses.map((e, idx) => `
              <tr>
                <td>${e.itemNo || idx + 1}</td>
                <td><code>${escapeHTML(e.voucherNo || '')}</code></td>
                <td><strong>${escapeHTML(e.title)}</strong></td>
                <td><span class="status-pill mode">${escapeHTML(e.category)}</span></td>
                <td style="font-weight: 700; color: var(--text-main);">${JRMData.formatINR(e.amount)}</td>
                <td>${escapeHTML(e.paidTo || '—')}</td>
                <td>${escapeHTML(e.mode || 'Cash')}</td>
                <td>${escapeHTML(e.date || '')} (IST)</td>
                ${state.isAdmin ? `
                  <td style="text-align: right;">
                    <button class="btn btn-outline btn-sm" onclick="window.JRMApp.openEditExpenseModal('${e.id}')">Edit</button>
                  </td>
                ` : ''}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Call Book CRM
  function renderCallBook() {
    const gridContainer = document.getElementById('callBookGridContainer');
    if (!gridContainer) return;
    const pending = JRMData.getPendingMembers(state.activeProgramId);
    const countDisplay = document.getElementById('callBookCountDisplay');
    const totalPending = pending.reduce((acc, c) => acc + (Number(c.balance) || 0), 0);

    if (countDisplay) {
      countDisplay.textContent = `${pending.length} Members Pending Follow-up (Total: ${JRMData.formatINR(totalPending)})`;
    }

    if (pending.length === 0) {
      gridContainer.innerHTML = `<p style="padding: 24px; color: var(--text-muted); text-align: center;">Sabhi members ka fund clear hai.</p>`;
      return;
    }

    gridContainer.innerHTML = pending.map(c => `
      <div class="callbook-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-weight: 700;">${c.memberNo ? `${c.memberNo}. ` : ''}${escapeHTML(c.name)}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${c.phone ? `📞 ${escapeHTML(c.phone)}` : 'Phone: Not entered'}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.68rem; color: var(--status-pending); font-weight: 700;">BALANCE DUE</div>
            <div style="font-size: 1.1rem; font-weight: 800; color: var(--status-pending);">${JRMData.formatINR(c.balance || c.paid || 0)}</div>
          </div>
        </div>

        <div style="display: flex; gap: 6px; margin-top: 4px;">
          ${c.phone ? `
            <a href="tel:${escapeHTML(c.phone)}" class="btn btn-outline btn-sm" style="flex: 1;">📞 Call</a>
          ` : `
            <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="window.JRMApp.promptAddPhone('${c.id}')">+ Add Phone</button>
          `}
          <button class="btn btn-whatsapp btn-sm" style="flex: 1.4;" onclick="window.JRMApp.sendWhatsAppReminder('${c.id}')">📱 Reminder</button>
          ${state.isAdmin ? `
            <button class="btn btn-outline btn-sm" onclick="window.JRMApp.quickSettleModal('${c.id}')">Receive</button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  // Separated WhatsApp Messages (Collection & Expense)
  function generateCollectionWhatsAppMessage() {
    const prog = JRMData.getProgramById(state.activeProgramId) || JRMData.getActiveProgram();
    const collections = JRMData.getCollections(state.activeProgramId);
    const metrics = JRMData.getMetrics(state.activeProgramId);

    let dateStr = '19--10--2026';
    if (prog && prog.date) {
      const parts = prog.date.split('-');
      if (parts.length === 3) dateStr = `${parts[2]}--${parts[1]}--${parts[0]}`;
    }

    let text = `*(${collections.length}) MAHANA SUNNI DEENI NASHISHT MEHFIL (Collection) ${prog ? prog.month : 'October'}) In Sha Allah Program Hoga*\n\n`;
    text += `*Date :${dateStr}/*\n\n`;
    text += `*👇Team Member Collection 👇*\n\n`;

    collections.forEach(c => {
      const num = c.memberNo || '';
      const name = c.name || '';
      if ((Number(c.paid) || 0) > 0) {
        text += `*${num}/${name} paid ${c.paid} ✅*\n`;
      } else {
        text += `*${num}/${name} BAL ${c.balance || 0} ❌*\n`;
      }
    });

    text += `\n______________________________\n`;
    text += `*Total Collection* =           *${metrics.totalCollected.toLocaleString('en-IN')}*₹\n`;
    text += `*Total Pending Balance* =      *${metrics.totalPendingBalance.toLocaleString('en-IN')}*₹\n`;
    text += `______________________________\n\n`;
    text += `*Jamat Raza e Mustafa Antophill Mumbai*\n`;
    text += `*Report Generated at:* ${getISTDateTime()}\n`;
    text += `*Official Portal:* https://jrmantophill.esitesz.com\n`;

    return text;
  }

  function generateExpenseWhatsAppMessage() {
    const prog = JRMData.getProgramById(state.activeProgramId) || JRMData.getActiveProgram();
    const expenses = JRMData.getExpenses();
    const metrics = JRMData.getMetrics(state.activeProgramId);

    let text = `*Jamat Raza e Mustafa Antophill Mumbai*\n\n`;
    text += `*MAAHANA SUNNI DEENI NASHIST PROGRAM* *MANAGEMENT EXPENSES*\n`;
    text += `*Monday(September) 21-09-2026*\n\n`;

    expenses.forEach((e, i) => {
      text += `*${i + 1}:-${e.title.toUpperCase()}= ${e.amount}*\n`;
    });

    text += `\n______________________________\n`;
    text += `*EXPENSE=${metrics.totalExpenses.toLocaleString('en-IN')}*₹\n`;
    text += `*COLLECTION RECEIVED IN MONTH OF ${prog ? prog.month : 'October'} TOTAL ${metrics.totalCollected.toLocaleString('en-IN')}*₹\n`;
    text += `*NET BALANCE IN HAND=${metrics.netBalance.toLocaleString('en-IN')}*₹\n`;
    text += `______________________________\n\n`;
    text += `*Report Generated at:* ${getISTDateTime()}\n`;
    text += `*Zain & Zimmedaran — Jamat Raza e Mustafa Antophill*\n`;
    text += `*Online Verified Records:* https://jrmantophill.esitesz.com\n`;

    return text;
  }

  function renderWhatsAppView() {
    const previewBox = document.getElementById('whatsappMessagePreview');
    const tabCollection = document.getElementById('tabWhatsAppCollection');
    const tabExpense = document.getElementById('tabWhatsAppExpense');

    if (tabCollection) tabCollection.classList.toggle('active', state.activeWhatsAppTab === 'collection');
    if (tabExpense) tabExpense.classList.toggle('active', state.activeWhatsAppTab === 'expense');

    if (!previewBox) return;

    if (state.activeWhatsAppTab === 'collection') {
      previewBox.textContent = generateCollectionWhatsAppMessage();
    } else {
      previewBox.textContent = generateExpenseWhatsAppMessage();
    }
  }

  function setWhatsAppTab(tabName) {
    state.activeWhatsAppTab = tabName;
    renderWhatsAppView();
  }

  function shareCurrentWhatsApp() {
    const text = state.activeWhatsAppTab === 'collection'
      ? generateCollectionWhatsAppMessage()
      : generateExpenseWhatsAppMessage();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  function copyCurrentWhatsApp() {
    const text = state.activeWhatsAppTab === 'collection'
      ? generateCollectionWhatsAppMessage()
      : generateExpenseWhatsAppMessage();
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${state.activeWhatsAppTab === 'collection' ? 'Collection' : 'Expense'} message copied!`);
    }).catch(() => {
      showToast('Could not copy automatically.', 'danger');
    });
  }

  // Receipt Verification (Public)
  function renderVerifyView() {}

  function handleReceiptSearch(query) {
    const container = document.getElementById('receiptLookupResult');
    if (!container) return;
    if (!query || !query.trim()) {
      container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">Contributor name ya token daalein.</p>`;
      return;
    }

    const results = JRMData.searchCollections(query);
    if (results.length === 0) {
      container.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted);">No verified record found matching "${escapeHTML(query)}".</div>`;
      return;
    }

    container.innerHTML = results.map(r => `
      <div style="background: var(--bg-surface); border: 1px solid var(--border); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div>
          <div style="font-weight: 700;">${escapeHTML(r.name)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Token: <code>${escapeHTML(r.token || '')}</code> • Date: ${escapeHTML(r.date)} (IST)</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="font-weight: 800; color: var(--status-paid);">${JRMData.formatINR(r.paid)}</div>
          <button class="btn btn-outline btn-sm" onclick="window.JRMApp.openReceipt('${r.id}')">View Receipt</button>
        </div>
      </div>
    `).join('');
  }

  // Official Receipt Print View
  function openReceipt(collectionId) {
    const c = JRMData.getCollectionById(collectionId);
    if (!c || !el.receiptModal) return;

    const prog = JRMData.getProgramById(c.programId) || JRMData.getActiveProgram();
    const settings = JRMData.getSettings();
    const body = document.getElementById('receiptModalContent');
    if (!body) return;

    const formattedIST = c.date ? `${c.date} (Asia/Kolkata IST)` : getISTDateTime();

    body.innerHTML = `
      <div class="receipt-paper">
        <div class="receipt-head">
          <div class="receipt-org">${escapeHTML(settings.orgFull)}</div>
          <div class="receipt-sub">${escapeHTML(settings.orgBranch)} • Jamat Raza-e-Mustafa</div>
          <div style="font-size: 0.7rem; font-weight: 700; color: var(--brand-green); margin-top: 4px; letter-spacing: 0.5px;">OFFICIAL DONATION RECEIPT • IST VERIFIED</div>
        </div>

        <div class="receipt-grid">
          <div><strong>Receipt No:</strong> ${escapeHTML(c.token || '')}</div>
          <div style="text-align: right;"><strong>Date & Time:</strong> ${escapeHTML(formattedIST)}</div>
          <div><strong>Program:</strong> ${escapeHTML(prog ? prog.title : 'Mahana Mehfil')}</div>
          <div style="text-align: right;"><strong>Payment Mode:</strong> ${escapeHTML(c.mode || 'Cash')}</div>
        </div>

        <div class="receipt-amt">
          <div style="font-size: 0.72rem; color: #555; text-transform: uppercase;">Amount Received with Thanks</div>
          <div class="receipt-amt-num">${JRMData.formatINR(c.paid)}</div>
          <div class="receipt-amt-txt">${JRMData.numberToWordsINR(c.paid)}</div>
        </div>

        <table style="width: 100%; font-size: 0.82rem; margin-bottom: 14px; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0; color: #666;">Received From:</td>
            <td style="padding: 4px 0; text-align: right; font-weight: 700;">${escapeHTML(c.name)}</td>
          </tr>
          ${c.phone ? `
            <tr>
              <td style="padding: 4px 0; color: #666;">Contact No:</td>
              <td style="padding: 4px 0; text-align: right;">${escapeHTML(c.phone)}</td>
            </tr>
          ` : ''}
          <tr>
            <td style="padding: 4px 0; color: #666;">Purpose:</td>
            <td style="padding: 4px 0; text-align: right;">Mahana Sunni Deeni Nashisht Fund</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #666;">Balance Status:</td>
            <td style="padding: 4px 0; text-align: right; font-weight: 700;">${c.balance > 0 ? `Pending: ${JRMData.formatINR(c.balance)}` : 'Nil (Fully Settled)'}</td>
          </tr>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #DDD; padding-top: 10px; font-size: 0.72rem; color: #777;">
          <div>
            Verified Digital Record • Indian Standard Time (IST)<br>
            Developed by esitesz • jrmantophill.esitesz.com
          </div>
          <div style="text-align: center; border-top: 1px dashed #999; width: 140px; padding-top: 2px;">
            Zain & Zimmedaran<br>
            JRM Antophill Committee
          </div>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 16px; justify-content: flex-end;" class="no-print">
          <button class="btn btn-whatsapp btn-sm" onclick="window.JRMApp.shareMemberReceiptWhatsApp('${c.id}')">📱 Send via WhatsApp</button>
          <button class="btn btn-primary btn-sm" onclick="window.print()">🖨️ Print / Save PDF</button>
        </div>
      </div>
    `;

    el.receiptModal.classList.add('active');
  }

  function shareMemberReceiptWhatsApp(collectionId) {
    const c = JRMData.getCollectionById(collectionId);
    if (!c) return;
    const settings = JRMData.getSettings();
    const prog = JRMData.getProgramById(c.programId) || JRMData.getActiveProgram();

    const msg = `*Assalamu Alaikum ${c.name} Bhai,*\n\n` +
      `Jamat Raza e Mustafa (Antophill Mumbai) ke *${prog ? prog.title : 'Mahana Mehfil'}* ke silsile me aapka contribution verify ho gaya hai:\n\n` +
      `*Receipt No:* ${c.token}\n` +
      `*Amount Received:* ${JRMData.formatINR(c.paid)}\n` +
      `*Payment Mode:* ${c.mode || 'Cash'}\n` +
      `*Date (IST):* ${c.date} (Indian Standard Time)\n` +
      `${c.balance > 0 ? `*Balance Pending:* ${JRMData.formatINR(c.balance)}\n` : `*Status:* Paid in full ✅\n`}\n` +
      `Aap apni official digital receipt aur apna personal statement online dekh sakte hain:\n` +
      `https://${settings.domain}/#verify/${c.token}\n\n` +
      `JazakAllah Khair.\n` +
      `*Zain & Zimmedaran — Jamat Raza e Mustafa Antophill Mumbai*`;

    let targetUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    if (c.phone) {
      const cleanPhone = c.phone.replace(/[^0-9]/g, '');
      const fullPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
      targetUrl = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(msg)}`;
    }
    window.open(targetUrl, '_blank');
  }

  function sendWhatsAppReminder(collectionId) {
    const c = JRMData.getCollectionById(collectionId);
    if (!c) return;
    const settings = JRMData.getSettings();
    const prog = JRMData.getProgramById(c.programId) || JRMData.getActiveProgram();
    const balanceAmt = c.balance || 0;

    const msg = `*Assalamu Alaikum ${c.name} Bhai,*\n\n` +
      `Jamat Raza e Mustafa (Antophill) ke *${prog ? prog.title : 'Mahana Sunni Deeni Nashisht Mehfil'}* ke silsile me aapka *${JRMData.formatINR(balanceAmt)}* balance pending hai.\n\n` +
      `Meharbani karke Cash ya Bank UPI ke zariye jama kara dein taaki program intezamaat ba-aasani ho sakein.\n\n` +
      `JazakAllah Khair.\n` +
      `*Zain & Zimmedaran — Jamat Raza e Mustafa Antophill Mumbai*`;

    let targetUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    if (c.phone) {
      const cleanPhone = c.phone.replace(/[^0-9]/g, '');
      const fullPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
      targetUrl = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(msg)}`;
    }
    window.open(targetUrl, '_blank');
  }

  // Sheets Sync & Backup
  function renderSheetsView() {
    const settings = JRMData.getSettings();
    const urlInput = document.getElementById('sheetUrlInput');
    const keyInput = document.getElementById('sheetKeyInput');
    if (urlInput) urlInput.value = settings.googleSheetUrl || '';
    if (keyInput) keyInput.value = settings.googleSheetApiKey || '';
  }

  function saveSheetSettings() {
    const url = (document.getElementById('sheetUrlInput').value || '').trim();
    const key = (document.getElementById('sheetKeyInput').value || '').trim();
    JRMData.saveSettings({ googleSheetUrl: url, googleSheetApiKey: key });
    showToast('Google Sheets configuration saved.');
  }

  async function syncGoogleSheets() {
    const settings = JRMData.getSettings();
    if (!settings.googleSheetUrl) {
      showToast('Pehle Google Apps Script Web App URL enter karein.', 'danger');
      return;
    }

    const btn = document.getElementById('syncSheetsBtn');
    if (btn) btn.disabled = true;
    showToast('Syncing with Google Sheets...');

    try {
      const payload = {
        action: 'sync_all',
        apiKey: settings.googleSheetApiKey,
        user: state.isAdmin ? 'Zain (Admin)' : 'Portal Sync',
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
    } catch (e) {
      showToast('Error syncing: ' + e.message, 'danger');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function downloadCSV(type) {
    const content = type === 'collections' ? JRMData.exportCollectionsCSV() : JRMData.exportExpensesCSV();
    const filename = `JRM_${type}_IST_${getISTISODate()}.csv`;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Audit Logs View (IST Time)
  function renderLogsView() {
    const container = document.getElementById('auditLogsContainer');
    if (!container) return;
    const logs = JRMData.getLogs(100);

    container.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp (Indian Standard Time)</th>
              <th>User</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(l => `
              <tr>
                <td style="white-space: nowrap; font-family: var(--font-mono); font-size: 0.75rem;">
                  <strong>${l.istTime || getISTDateTime(new Date(l.timestamp))}</strong>
                </td>
                <td><strong>${escapeHTML(l.user)}</strong></td>
                <td><code>${escapeHTML(l.action)}</code></td>
                <td>${escapeHTML(l.details)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Modals & Form Handlers
  function openAddCollectionModal() {
    if (!state.isAdmin) {
      openAdminPinModal();
      return;
    }
    const form = document.getElementById('collectionForm');
    if (!form) return;
    form.reset();
    document.getElementById('collectionId').value = '';
    document.getElementById('collectionDate').value = getISTISODate();
    el.collectionModal.classList.add('active');
  }

  function openEditCollectionModal(id) {
    if (!state.isAdmin) return;
    const c = JRMData.getCollectionById(id);
    if (!c) return;

    document.getElementById('collectionId').value = c.id;
    document.getElementById('collectionName').value = c.name || '';
    document.getElementById('collectionPhone').value = c.phone || '';
    document.getElementById('collectionPaid').value = c.paid || 0;
    document.getElementById('collectionBalance').value = c.balance || 0;
    document.getElementById('collectionMode').value = c.mode || 'Cash';
    document.getElementById('collectionDate').value = c.date || getISTISODate();
    document.getElementById('collectionNotes').value = c.notes || '';

    el.collectionModal.classList.add('active');
  }

  function saveCollectionForm(e) {
    e.preventDefault();
    const id = document.getElementById('collectionId').value;
    const name = (document.getElementById('collectionName').value || '').trim();
    if (!name) return;

    const paid = Number(document.getElementById('collectionPaid').value) || 0;
    const balance = Number(document.getElementById('collectionBalance').value) || 0;
    const mode = document.getElementById('collectionMode').value || 'Cash';
    const phone = (document.getElementById('collectionPhone').value || '').trim();
    const date = document.getElementById('collectionDate').value || getISTISODate();
    const notes = (document.getElementById('collectionNotes').value || '').trim();

    const existing = id ? JRMData.getCollectionById(id) : null;
    const entry = {
      id: id || undefined,
      memberNo: existing ? existing.memberNo : undefined,
      name: name,
      phone: phone,
      programId: state.activeProgramId,
      paid: paid,
      balance: balance,
      mode: mode,
      status: paid > 0 && balance === 0 ? 'paid' : (balance > 0 ? 'pending' : 'paid'),
      token: existing ? existing.token : JRMData.generateVerificationToken(),
      date: date,
      notes: notes
    };

    const saved = JRMData.saveCollection(entry);
    el.collectionModal.classList.remove('active');
    renderAll();
    showToast(`Saved entry for ${name}.`);

    if (confirm(`Entry saved! ${name} ko WhatsApp receipt share karni hai?`)) {
      shareMemberReceiptWhatsApp(saved.id);
    }
  }

  function openAddExpenseModal() {
    if (!state.isAdmin) {
      openAdminPinModal();
      return;
    }
    const form = document.getElementById('expenseForm');
    if (!form) return;
    form.reset();
    document.getElementById('expenseId').value = '';
    document.getElementById('expenseDate').value = getISTISODate();
    el.expenseModal.classList.add('active');
  }

  function openEditExpenseModal(id) {
    if (!state.isAdmin) return;
    const ex = JRMData.getExpenses().find(e => e.id === id);
    if (!ex) return;

    document.getElementById('expenseId').value = ex.id;
    document.getElementById('expenseTitle').value = ex.title || '';
    document.getElementById('expenseCategory').value = ex.category || 'Parchun Kharcha';
    document.getElementById('expenseAmount').value = ex.amount || 0;
    document.getElementById('expensePaidTo').value = ex.paidTo || '';
    document.getElementById('expenseMode').value = ex.mode || 'Cash';
    document.getElementById('expenseVoucher').value = ex.voucherNo || '';
    document.getElementById('expenseDate').value = ex.date || getISTISODate();
    document.getElementById('expenseNotes').value = ex.notes || '';

    el.expenseModal.classList.add('active');
  }

  function saveExpenseForm(e) {
    e.preventDefault();
    const id = document.getElementById('expenseId').value;
    const title = (document.getElementById('expenseTitle').value || '').trim();
    if (!title) return;

    const amount = Number(document.getElementById('expenseAmount').value) || 0;
    const category = document.getElementById('expenseCategory').value || 'Parchun Kharcha';
    const paidTo = (document.getElementById('expensePaidTo').value || '').trim();
    const mode = document.getElementById('expenseMode').value || 'Cash';
    const voucherNo = (document.getElementById('expenseVoucher').value || '').trim();
    const date = document.getElementById('expenseDate').value || getISTISODate();
    const notes = (document.getElementById('expenseNotes').value || '').trim();

    JRMData.saveExpense({
      id: id || undefined,
      title: title,
      category: category,
      amount: amount,
      programId: state.activeProgramId,
      paidTo: paidTo,
      mode: mode,
      voucherNo: voucherNo,
      date: date,
      notes: notes
    });

    el.expenseModal.classList.remove('active');
    renderAll();
    showToast(`Logged expense: ${title} (${JRMData.formatINR(amount)})`);
  }

  function quickSettleModal(collectionId) {
    const c = JRMData.getCollectionById(collectionId);
    if (!c) return;

    const amt = prompt(`${c.name} se mili hui rakam enter karein (Current Balance: ${c.balance}):`, c.balance);
    if (amt === null) return;
    const paidNow = Number(amt) || 0;
    if (paidNow <= 0) return;

    const newBalance = Math.max(0, (c.balance || 0) - paidNow);
    c.paid = (c.paid || 0) + paidNow;
    c.balance = newBalance;
    c.status = newBalance === 0 ? 'paid' : 'pending';
    c.notes = (c.notes ? c.notes + ' | ' : '') + `Paid ₹${paidNow} on ${getISTISODate()} (IST)`;

    JRMData.saveCollection(c);
    renderAll();
    showToast(`Received ${JRMData.formatINR(paidNow)} from ${c.name}.`);

    if (confirm(`Receipt WhatsApp par bhejein?`)) {
      shareMemberReceiptWhatsApp(c.id);
    }
  }

  function promptAddPhone(collectionId) {
    const c = JRMData.getCollectionById(collectionId);
    if (!c) return;
    const phone = prompt(`${c.name} ka contact number enter karein:`, c.phone || '');
    if (phone !== null) {
      c.phone = phone.trim();
      JRMData.saveCollection(c);
      renderAll();
      showToast(`Updated phone for ${c.name}`);
    }
  }

  function showToast(msg, type = 'info') {
    if (!el.toastContainer) return;
    const t = document.createElement('div');
    t.className = 'toast-msg';
    t.textContent = msg;
    el.toastContainer.appendChild(t);
    setTimeout(() => {
      t.remove();
    }, 3200);
  }

  function bindEvents() {
    if (el.themeToggle) el.themeToggle.addEventListener('click', toggleTheme);

    const pinForm = document.getElementById('adminPinForm');
    if (pinForm) {
      pinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitAdminPin();
      });
    }

    const memberLoginForm = document.getElementById('memberLoginForm');
    if (memberLoginForm) {
      memberLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitMemberLogin();
      });
    }

    const colSearch = document.getElementById('collectionSearchInput');
    if (colSearch) colSearch.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderCollections();
    });

    const colStatus = document.getElementById('collectionStatusFilter');
    if (colStatus) colStatus.addEventListener('change', (e) => {
      state.statusFilter = e.target.value;
      renderCollections();
    });

    const colMode = document.getElementById('collectionModeFilter');
    if (colMode) colMode.addEventListener('change', (e) => {
      state.modeFilter = e.target.value;
      renderCollections();
    });

    const colForm = document.getElementById('collectionForm');
    if (colForm) colForm.addEventListener('submit', saveCollectionForm);

    const expForm = document.getElementById('expenseForm');
    if (expForm) expForm.addEventListener('submit', saveExpenseForm);

    const verifyForm = document.getElementById('receiptSearchForm');
    if (verifyForm) {
      verifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = (document.getElementById('receiptSearchInput').value || '').trim();
        handleReceiptSearch(q);
      });
    }

    document.querySelectorAll('.modal-close-btn').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.modal-layer').forEach(m => m.classList.remove('active'));
      });
    });

    document.querySelectorAll('.modal-layer').forEach(m => {
      m.addEventListener('click', (e) => {
        if (e.target === m) m.classList.remove('active');
      });
    });
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  window.JRMApp = {
    switchView,
    setWhatsAppTab,
    shareCurrentWhatsApp,
    copyCurrentWhatsApp,
    openAddCollectionModal,
    openEditCollectionModal,
    openAddExpenseModal,
    openEditExpenseModal,
    openReceipt,
    shareMemberReceiptWhatsApp,
    sendWhatsAppReminder,
    quickSettleModal,
    promptAddPhone,
    openMemberLoginModal,
    openAdminPinModal,
    logoutCurrent,
    saveSheetSettings,
    syncGoogleSheets,
    downloadCSV,
    showToast
  };

})();
