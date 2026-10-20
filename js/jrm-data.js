/**
 * JRM Antophill — Deeni Mehfil & Fund Portal
 * Data Layer, Storage, Seed Data & Member Ledger Engine
 * Organization: Jamat Raza-e-Mustafa Antophill, Mumbai
 * Developed by esitesz (jrmantophill.esitesz.com)
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    PROGRAMS: 'jrm_programs_v1',
    COLLECTIONS: 'jrm_collections_v1',
    EXPENSES: 'jrm_expenses_v1',
    LOGS: 'jrm_audit_logs_v1',
    SETTINGS: 'jrm_settings_v1',
    ADMIN_SESSION: 'jrm_admin_session_v1',
    MEMBER_SESSION: 'jrm_member_session_v1'
  };

  function numberToWordsINR(num) {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    num = Math.floor(Math.abs(Number(num) || 0));
    if (num === 0) return 'Zero Rupees Only';

    function convertTens(n) {
      if (n < 20) return a[n];
      const digit = n % 10;
      return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : '');
    }

    function convertGroup(n, label) {
      if (n === 0) return '';
      let str = '';
      if (n >= 100) {
        str += a[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n > 0) {
        str += convertTens(n) + ' ';
      }
      return str + (label ? label + ' ' : '');
    }

    let words = '';
    const crore = Math.floor(num / 10000000);
    num %= 10000000;
    const lakh = Math.floor(num / 100000);
    num %= 100000;
    const thousand = Math.floor(num / 1000);
    num %= 1000;
    const remainder = num;

    if (crore) words += convertGroup(crore, 'Crore');
    if (lakh) words += convertGroup(lakh, 'Lakh');
    if (thousand) words += convertGroup(thousand, 'Thousand');
    if (remainder) words += convertGroup(remainder, '');

    return words.trim() + ' Rupees Only';
  }

  function formatINR(val) {
    const n = Number(val) || 0;
    return '₹' + n.toLocaleString('en-IN');
  }

  function generateVerificationToken(prefix = 'JRM') {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${year}${month}-${randomHex}`;
  }

  // Seed Programs
  const DEFAULT_PROGRAMS = [
    {
      id: 'prog-oct-2026',
      title: '(40) MAHANA SUNNI DEENI NASHISHT MEHFIL',
      month: 'October',
      year: 2026,
      date: '2026-10-19',
      day: 'Monday',
      status: 'active',
      targetCollection: 20000,
      description: 'Monthly Sunni Deeni Nashisht Program — Jamat Raza e Mustafa Antophill Mumbai',
      venue: 'Antophill, Wadala East, Mumbai 400037',
      createdAt: '2026-10-01T10:00:00Z'
    },
    {
      id: 'prog-sep-2026',
      title: 'MAAHANA SUNNI DEENI NASHIST PROGRAM (September)',
      month: 'September',
      year: 2026,
      date: '2026-09-21',
      day: 'Monday',
      status: 'completed',
      targetCollection: 18000,
      description: 'Monthly Management & Program Mehfil',
      venue: 'Antophill, Wadala East, Mumbai 400037',
      createdAt: '2026-09-01T10:00:00Z'
    }
  ];

  // Authentic Seed Collections
  const DEFAULT_COLLECTIONS = [
    { id: 'col-01', memberNo: 1, name: 'Sayed Yusuf', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-YUSUF', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-02', memberNo: 2, name: 'Sayed jalaluddin', phone: '', programId: 'prog-oct-2026', paid: 1000, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-JALAL', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-03', memberNo: 3, name: 'Sayed altamash', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-ALTAMASH', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-04', memberNo: 4, name: 'Sayed Asif', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-ASIF', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-05', memberNo: 5, name: 'Sayed Arshad', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-ARSHAD', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-06', memberNo: 6, name: 'Syed Abbas', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-ABBAS', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-07', memberNo: 7, name: 'Dr Seyd Yasin Ahmad', phone: '', programId: 'prog-oct-2026', paid: 1000, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-YASIN', date: '2026-10-19', notes: 'Special Mehfil Fund' },
    { id: 'col-08', memberNo: 8, name: 'Dr Abdul Karim', phone: '', programId: 'prog-oct-2026', paid: 1000, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-KARIM', date: '2026-10-19', notes: 'Special Mehfil Fund' },
    { id: 'col-09', memberNo: 9, name: 'Salim Bhai Azhari', phone: '', programId: 'prog-oct-2026', paid: 0, balance: 2000, mode: 'Pending', status: 'pending', token: 'JRM-2610-SALIM-AZ', date: '2026-10-19', notes: 'Previous dues pending' },
    { id: 'col-10', memberNo: 10, name: 'Salim Bhai Siraji', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-SALIM-SI', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-11', memberNo: 11, name: 'Imtiyaz Bhai', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-IMTIYAZ', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-12', memberNo: 12, name: 'Riyaz Bhai', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-RIYAZ', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-13', memberNo: 13, name: 'Firoz Bhai Best', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-FIROZ', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-14', memberNo: 14, name: 'Zuber Bhai', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-ZUBER', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-16', memberNo: 16, name: 'Khalid Bhai', phone: '', programId: 'prog-oct-2026', paid: 0, balance: 500, mode: 'Pending', status: 'pending', token: 'JRM-2610-KHALID', date: '2026-10-19', notes: 'Pending balance' },
    { id: 'col-17', memberNo: 17, name: 'Shahbaz Bhai', phone: '', programId: 'prog-oct-2026', paid: 300, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-SHAHBAZ', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-18', memberNo: 18, name: 'Sahil Bhai', phone: '', programId: 'prog-oct-2026', paid: 0, balance: 500, mode: 'Pending', status: 'pending', token: 'JRM-2610-SAHIL', date: '2026-10-19', notes: 'Pending balance' },
    { id: 'col-19', memberNo: 19, name: 'Afroz Razvi', phone: '', programId: 'prog-oct-2026', paid: 0, balance: 1100, mode: 'Pending', status: 'pending', token: 'JRM-2610-AFROZ', date: '2026-10-19', notes: 'Pending balance' },
    { id: 'col-20', memberNo: 20, name: 'Abdul Gaffar', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-GAFFAR1', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-21', memberNo: 21, name: 'Ammo Bhai', phone: '', programId: 'prog-oct-2026', paid: 0, balance: 500, mode: 'Pending', status: 'pending', token: 'JRM-2610-AMMO', date: '2026-10-19', notes: 'Pending balance' },
    { id: 'col-22', memberNo: 22, name: 'Zainuddin Razvi', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-ZAINUDDIN', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-23', memberNo: 23, name: 'Moshin Mansuri', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-MOSHIN-M', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-24', memberNo: 24, name: 'Shoaib Razvi', phone: '', programId: 'prog-oct-2026', paid: 300, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-SHOAIB-R', date: '2026-10-19', notes: 'Balance cleared' },
    { id: 'col-25', memberNo: 25, name: 'Anzar Bhai Maidan', phone: '', programId: 'prog-oct-2026', paid: 0, balance: 500, mode: 'Pending', status: 'pending', token: 'JRM-2610-ANZAR', date: '2026-10-19', notes: 'Pending balance' },
    { id: 'col-26', memberNo: 26, name: 'Asif Arab', phone: '', programId: 'prog-oct-2026', paid: 1000, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-ASIF-ARAB', date: '2026-10-19', notes: 'Balance cleared' },
    { id: 'col-27', memberNo: 27, name: 'Rafiq Bhai', phone: '', programId: 'prog-oct-2026', paid: 0, balance: 500, mode: 'Pending', status: 'pending', token: 'JRM-2610-RAFIQ', date: '2026-10-19', notes: 'Pending balance' },
    { id: 'col-28', memberNo: 28, name: 'Rahan Razvi', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-RAHAN', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-29', memberNo: 29, name: 'Sameer Razvi', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-SAMEER', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-30', memberNo: 30, name: 'Imran Bhai Maidan', phone: '', programId: 'prog-oct-2026', paid: 1000, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-IMRAN', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-31', memberNo: 31, name: 'Hussain Razvi', phone: '', programId: 'prog-oct-2026', paid: 511, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-HUSSAIN', date: '2026-10-19', notes: 'Mehfil Niyaz Contribution' },
    { id: 'col-32', memberNo: 32, name: 'Ahmed Bhai', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-AHMED', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-33', memberNo: 33, name: 'Abdul Gaffar Bhai', phone: '', programId: 'prog-oct-2026', paid: 1000, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-GAFFAR2', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-34', memberNo: 34, name: 'Shoaib Bhai maidan', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-SHOAIB-M', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-35', memberNo: 35, name: 'Afridi Razvi', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-AFRIDI', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-36', memberNo: 36, name: 'Moshin Azhari', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-MOSHIN-A', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-37', memberNo: 37, name: 'Naaim Bhai group', phone: '', programId: 'prog-oct-2026', paid: 630, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-NAAIM-GRP', date: '2026-10-19', notes: 'Group fund balance cleared' },
    { id: 'col-38', memberNo: 38, name: 'Mohd Azad Bhai', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-AZAD', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-40', memberNo: 40, name: 'Sajid bhai maidan', phone: '', programId: 'prog-oct-2026', paid: 0, balance: 0, mode: 'Settled', status: 'paid', token: 'JRM-2610-SAJID', date: '2026-10-19', notes: 'Balance settled 0' },
    { id: 'col-41', memberNo: 41, name: 'Shadab Bhai maidan', phone: '', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-SHADAB', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' }
  ];

  // Authentic Seed Expenses
  const DEFAULT_EXPENSES = [
    { id: 'exp-01', itemNo: 1, title: 'Nazrana (Ulama & Mashaikh)', category: 'Nazrana', amount: 4000, programId: 'prog-sep-2026', paidTo: 'Hazrat / Ulama-e-Kiram', mode: 'Cash', date: '2026-09-21', voucherNo: 'VCH-SEP-001', notes: 'Nazrana for Sunni Deeni Nashisht Mehfil' },
    { id: 'exp-02', itemNo: 2, title: 'Madrasa Rent', category: 'Madrasa Rent', amount: 1000, programId: 'prog-sep-2026', paidTo: 'Madrasa Committee', mode: 'Cash', date: '2026-09-21', voucherNo: 'VCH-SEP-002', notes: 'Hall / Madrasa premises charges' },
    { id: 'exp-03', itemNo: 3, title: 'Niyaz / Tabarruk', category: 'Niyaz', amount: 5800, programId: 'prog-sep-2026', paidTo: 'Catering / Niyaz Khidmat', mode: 'Cash', date: '2026-09-21', voucherNo: 'VCH-SEP-003', notes: 'Tabarruk & Niyaz arrangements for attendees' },
    { id: 'exp-04', itemNo: 4, title: 'Sound & Audio Setup', category: 'Sound', amount: 3000, programId: 'prog-sep-2026', paidTo: 'Antophill Sound Service', mode: 'Cash', date: '2026-09-21', voucherNo: 'VCH-SEP-004', notes: 'High-clarity sound system & microphones' },
    { id: 'exp-05', itemNo: 5, title: 'Social Media Handling & Media', category: 'Social Media', amount: 3000, programId: 'prog-sep-2026', paidTo: 'Social Media Khidmat Team', mode: 'Bank UPI', date: '2026-09-21', voucherNo: 'VCH-SEP-005', notes: 'Live streaming, poster graphic & social media' },
    { id: 'exp-06', itemNo: 6, title: 'Parchun Kharcha (Miscellaneous)', category: 'Parchun Kharcha', amount: 1000, programId: 'prog-sep-2026', paidTo: 'Local Market Antophill', mode: 'Cash', date: '2026-09-21', voucherNo: 'VCH-SEP-006', notes: 'Water bottles, seating, stationery and incidentals' }
  ];

  const DEFAULT_LOGS = [
    { id: 'log-01', timestamp: '2026-10-19T10:15:00Z', user: 'Zain (Admin)', action: 'INIT', details: 'Initialized JRM Antophill Database with 39 Member Records and September Program Expenses.' },
    { id: 'log-02', timestamp: '2026-10-19T11:00:00Z', user: 'Zain (Admin)', action: 'COLLECTION_VERIFY', details: 'Verified ₹18,241 total collections for October Mahana Sunni Deeni Nashisht.' },
    { id: 'log-03', timestamp: '2026-10-19T11:30:00Z', user: 'Zain (Admin)', action: 'EXPENSE_RECORD', details: 'Audited September Expenses: Nazrana, Madrasa Rent, Niyaz, Sound, Social Media, Parchun Kharcha (Total ₹17,800).' }
  ];

  const DEFAULT_SETTINGS = {
    orgName: 'Jamat Raza-e-Mustafa',
    orgBranch: 'Antophill, Mumbai',
    orgFull: 'Jamat Raza-e-Mustafa Antophill Mumbai',
    adminLead: 'Zain',
    domain: 'jrmantophill.esitesz.com',
    developerCredit: 'Developed by esitesz',
    developerUrl: 'https://esitesz.com',
    adminPin: '7860',
    googleSheetUrl: '',
    googleSheetApiKey: '',
    autoSync: false,
    currencySymbol: '₹'
  };

  const Storage = {
    get(key, defaultValue) {
      try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
      } catch (e) {
        return defaultValue;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  const JRMData = {
    init() {
      if (!Storage.get(STORAGE_KEYS.PROGRAMS)) Storage.set(STORAGE_KEYS.PROGRAMS, DEFAULT_PROGRAMS);
      if (!Storage.get(STORAGE_KEYS.COLLECTIONS)) Storage.set(STORAGE_KEYS.COLLECTIONS, DEFAULT_COLLECTIONS);
      if (!Storage.get(STORAGE_KEYS.EXPENSES)) Storage.set(STORAGE_KEYS.EXPENSES, DEFAULT_EXPENSES);
      if (!Storage.get(STORAGE_KEYS.LOGS)) Storage.set(STORAGE_KEYS.LOGS, DEFAULT_LOGS);
      if (!Storage.get(STORAGE_KEYS.SETTINGS)) Storage.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    },

    getSettings() {
      return Object.assign({}, DEFAULT_SETTINGS, Storage.get(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS));
    },
    saveSettings(newSettings) {
      const merged = Object.assign({}, this.getSettings(), newSettings);
      Storage.set(STORAGE_KEYS.SETTINGS, merged);
      return merged;
    },

    // Admin Auth
    isAdminLoggedIn() {
      const session = Storage.get(STORAGE_KEYS.ADMIN_SESSION, null);
      if (!session) return false;
      if (session.expiresAt && Date.now() < session.expiresAt) return true;
      Storage.remove(STORAGE_KEYS.ADMIN_SESSION);
      return false;
    },
    loginAdmin(pin) {
      const settings = this.getSettings();
      if (pin && pin.trim() === settings.adminPin.trim()) {
        const session = {
          loggedIn: true,
          adminName: 'Zain',
          loggedInAt: Date.now(),
          expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
        };
        Storage.set(STORAGE_KEYS.ADMIN_SESSION, session);
        this.log('ADMIN_LOGIN', 'Zain (Admin) logged in.');
        return { success: true };
      }
      return { success: false, error: 'Galat PIN. Kripya sahi PIN daalein.' };
    },
    logoutAdmin() {
      Storage.remove(STORAGE_KEYS.ADMIN_SESSION);
      this.log('ADMIN_LOGOUT', 'Admin logged out.');
      return true;
    },

    // Member Session
    getLoggedInMember() {
      return Storage.get(STORAGE_KEYS.MEMBER_SESSION, null);
    },
    loginMember(identifier) {
      if (!identifier) return { success: false, error: 'Member chunein ya naam daalein.' };
      const clean = identifier.toString().trim().toLowerCase();
      const all = this.getCollections();
      const match = all.find(c =>
        (c.id && c.id.toLowerCase() === clean) ||
        (c.name && c.name.toLowerCase() === clean) ||
        (c.name && c.name.toLowerCase().includes(clean)) ||
        (c.token && c.token.toLowerCase() === clean) ||
        (c.phone && c.phone.includes(clean))
      );

      if (match) {
        Storage.set(STORAGE_KEYS.MEMBER_SESSION, {
          memberId: match.id,
          name: match.name,
          phone: match.phone || '',
          token: match.token,
          loggedInAt: Date.now()
        });
        this.log('MEMBER_LOGIN', `Member logged in: ${match.name}`);
        return { success: true, member: match };
      }
      return { success: false, error: 'Member record nahi mila.' };
    },
    logoutMember() {
      Storage.remove(STORAGE_KEYS.MEMBER_SESSION);
      return true;
    },

    // Member Specific History & Statement
    getMemberLedger(memberName) {
      if (!memberName) return [];
      const clean = memberName.trim().toLowerCase();
      return this.getCollections().filter(c => c.name && c.name.toLowerCase() === clean);
    },

    // Programs
    getPrograms() {
      return Storage.get(STORAGE_KEYS.PROGRAMS, DEFAULT_PROGRAMS);
    },
    getProgramById(id) {
      return this.getPrograms().find(p => p.id === id) || null;
    },
    getActiveProgram() {
      const progs = this.getPrograms();
      return progs.find(p => p.status === 'active') || progs[0] || null;
    },
    saveProgram(program) {
      const progs = this.getPrograms();
      if (!program.id) {
        program.id = 'prog-' + Date.now();
        program.createdAt = new Date().toISOString();
        progs.unshift(program);
      } else {
        const idx = progs.findIndex(p => p.id === program.id);
        if (idx >= 0) progs[idx] = Object.assign({}, progs[idx], program);
      }
      Storage.set(STORAGE_KEYS.PROGRAMS, progs);
      return program;
    },

    // Collections
    getCollections(programId = null) {
      const all = Storage.get(STORAGE_KEYS.COLLECTIONS, DEFAULT_COLLECTIONS);
      if (!programId) return all;
      return all.filter(c => c.programId === programId);
    },
    getCollectionById(id) {
      return this.getCollections().find(c => c.id === id) || null;
    },
    getCollectionByToken(token) {
      if (!token) return null;
      const clean = token.trim().toUpperCase();
      return this.getCollections().find(c => (c.token && c.token.toUpperCase() === clean)) || null;
    },
    searchCollections(query) {
      if (!query || !query.trim()) return this.getCollections();
      const q = query.toLowerCase().trim();
      return this.getCollections().filter(c => {
        return (c.name && c.name.toLowerCase().includes(q)) ||
               (c.phone && c.phone.includes(q)) ||
               (c.token && c.token.toLowerCase().includes(q)) ||
               (c.notes && c.notes.toLowerCase().includes(q));
      });
    },
    saveCollection(entry) {
      const list = this.getCollections();
      if (!entry.id) {
        entry.id = 'col-' + Date.now();
        entry.token = entry.token || generateVerificationToken();
        entry.date = entry.date || new Date().toISOString().split('T')[0];
        entry.memberNo = entry.memberNo || (list.length + 1);
        list.push(entry);
        this.log('COLLECTION_ADD', `Added collection: ${entry.name} ₹${entry.paid}`);
      } else {
        const idx = list.findIndex(c => c.id === entry.id);
        if (idx >= 0) {
          list[idx] = Object.assign({}, list[idx], entry);
          this.log('COLLECTION_UPDATE', `Updated collection: ${entry.name} ₹${entry.paid}`);
        } else {
          list.push(entry);
        }
      }
      Storage.set(STORAGE_KEYS.COLLECTIONS, list);
      return entry;
    },
    deleteCollection(id) {
      const list = this.getCollections();
      const item = list.find(c => c.id === id);
      const filtered = list.filter(c => c.id !== id);
      Storage.set(STORAGE_KEYS.COLLECTIONS, filtered);
      if (item) this.log('COLLECTION_DELETE', `Deleted entry: ${item.name}`);
      return true;
    },

    // Expenses
    getExpenses(programId = null) {
      const all = Storage.get(STORAGE_KEYS.EXPENSES, DEFAULT_EXPENSES);
      if (!programId) return all;
      return all.filter(e => e.programId === programId);
    },
    saveExpense(entry) {
      const list = this.getExpenses();
      if (!entry.id) {
        entry.id = 'exp-' + Date.now();
        entry.voucherNo = entry.voucherNo || ('VCH-' + Date.now().toString().slice(-4));
        entry.date = entry.date || new Date().toISOString().split('T')[0];
        entry.itemNo = entry.itemNo || (list.length + 1);
        list.push(entry);
        this.log('EXPENSE_ADD', `Logged expense: ${entry.title} ₹${entry.amount}`);
      } else {
        const idx = list.findIndex(e => e.id === entry.id);
        if (idx >= 0) {
          list[idx] = Object.assign({}, list[idx], entry);
          this.log('EXPENSE_UPDATE', `Updated expense: ${entry.title} ₹${entry.amount}`);
        } else {
          list.push(entry);
        }
      }
      Storage.set(STORAGE_KEYS.EXPENSES, list);
      return entry;
    },
    deleteExpense(id) {
      const list = this.getExpenses();
      const item = list.find(e => e.id === id);
      const filtered = list.filter(e => e.id !== id);
      Storage.set(STORAGE_KEYS.EXPENSES, filtered);
      if (item) this.log('EXPENSE_DELETE', `Deleted expense: ${item.title}`);
      return true;
    },

    // Audit Logs
    getLogs(limit = 100) {
      const logs = Storage.get(STORAGE_KEYS.LOGS, DEFAULT_LOGS);
      return logs.slice(-limit).reverse();
    },
    log(action, details) {
      const logs = Storage.get(STORAGE_KEYS.LOGS, DEFAULT_LOGS);
      const entry = {
        id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        timestamp: new Date().toISOString(),
        user: this.isAdminLoggedIn() ? 'Zain (Admin)' : 'Member',
        action: action,
        details: details
      };
      logs.push(entry);
      if (logs.length > 500) logs.shift();
      Storage.set(STORAGE_KEYS.LOGS, logs);
      return entry;
    },
    clearLogs() {
      Storage.set(STORAGE_KEYS.LOGS, []);
      return true;
    },

    // Metrics
    getMetrics(programId = null) {
      const collections = this.getCollections(programId);
      let expenses = this.getExpenses(programId);
      if (!expenses || expenses.length === 0) {
        expenses = this.getExpenses();
      }

      const totalCollected = collections.reduce((acc, c) => acc + (Number(c.paid) || 0), 0);
      const totalPendingBalance = collections.reduce((acc, c) => acc + (Number(c.balance) || 0), 0);
      const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
      const netBalance = totalCollected - totalExpenses;

      const cashCollected = collections
        .filter(c => (c.mode || '').toLowerCase().includes('cash'))
        .reduce((acc, c) => acc + (Number(c.paid) || 0), 0);

      const bankCollected = collections
        .filter(c => {
          const m = (c.mode || '').toLowerCase();
          return m.includes('bank') || m.includes('upi') || m.includes('online');
        })
        .reduce((acc, c) => acc + (Number(c.paid) || 0), 0);

      const paidCount = collections.filter(c => (Number(c.paid) || 0) > 0).length;
      const pendingCount = collections.filter(c => (Number(c.balance) || 0) > 0).length;

      return {
        totalCollected,
        totalPendingBalance,
        totalExpenses,
        netBalance,
        cashCollected,
        bankCollected,
        totalMembers: collections.length,
        paidCount,
        pendingCount
      };
    },

    getPendingMembers(programId = null) {
      const collections = this.getCollections(programId);
      return collections.filter(c => (Number(c.balance) || 0) > 0 || c.status === 'pending');
    },

    exportCollectionsCSV() {
      const collections = this.getCollections();
      const headers = ['Member No', 'Name', 'Phone', 'Paid (INR)', 'Balance (INR)', 'Payment Mode', 'Status', 'Date', 'Verification Token', 'Notes'];
      const rows = collections.map(c => [
        c.memberNo || '',
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${c.phone || ''}"`,
        c.paid || 0,
        c.balance || 0,
        `"${c.mode || 'Cash'}"`,
        c.status || 'paid',
        c.date || '',
        `"${c.token || ''}"`,
        `"${(c.notes || '').replace(/"/g, '""')}"`
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    },
    exportExpensesCSV() {
      const expenses = this.getExpenses();
      const headers = ['Item No', 'Title', 'Category', 'Amount (INR)', 'Paid To', 'Payment Mode', 'Date', 'Voucher No', 'Notes'];
      const rows = expenses.map(e => [
        e.itemNo || '',
        `"${(e.title || '').replace(/"/g, '""')}"`,
        `"${e.category || ''}"`,
        e.amount || 0,
        `"${(e.paidTo || '').replace(/"/g, '""')}"`,
        `"${e.mode || 'Cash'}"`,
        e.date || '',
        `"${e.voucherNo || ''}"`,
        `"${(e.notes || '').replace(/"/g, '""')}"`
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    },

    numberToWordsINR,
    formatINR,
    generateVerificationToken
  };

  JRMData.init();
  window.JRMData = JRMData;

})(window);
