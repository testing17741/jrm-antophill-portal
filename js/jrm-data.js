/**
 * JRM Antophill — Official Deeni Portal & Organization Platform
 * Organization: Jamat Raza-E-Mustafa Antophill, Wadala, Mumbai
 * Affiliation: Ahle Sunnah wal Jama'ah (Under guidance of Huzoor Qaid-e-Millat)
 * Developed by esitesz (jrmantophill.esitesz.com)
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    PROGRAMS: 'jrm_programs_v3',
    COLLECTIONS: 'jrm_collections_v3',
    EXPENSES: 'jrm_expenses_v3',
    LOGS: 'jrm_audit_logs_v3',
    SETTINGS: 'jrm_settings_v3',
    MEDIA: 'jrm_media_v3',
    PENDING_OTP: 'jrm_pending_otp_v3',
    SUPER_ADMIN_SESSION: 'jrm_super_session_v3',
    ADMIN_SESSION: 'jrm_admin_session_v3',
    MEMBER_SESSION: 'jrm_member_session_v3'
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

  // Official Organization Settings
  const DEFAULT_SETTINGS = {
    orgName: 'Jamat Raza-E-Mustafa Antophill',
    orgShort: 'JRM Antophill',
    orgBranch: 'Antophill, Wadala, Mumbai',
    orgFull: 'Jamat Raza-E-Mustafa (JRM) Antophill, Wadala, Mumbai',
    centralHQ: 'Bareilly Sharif, Uttar Pradesh (Founded 1920 by Ala Hazrat Imam Ahmed Raza Khan Bareilvi)',
    supervision: 'Under the spiritual guidance of Huzoor Qaid-e-Millat Madda Zillahul Aali',
    localLeadership: 'Administered by Zain & JRM Antophill Committee Zimmedaran',
    domain: 'jrmantophill.esitesz.com',
    developerCredit: 'Developed by esitesz',
    developerUrl: 'https://esitesz.com',
    venueAddress: 'Akbar Suleman Compound (Bada Maidan), Antophill, Wadala, Mumbai 400037, Maharashtra, India',
    officialEmail: 'jamatrazaemustafa313@gmail.com',
    officialPhone: '+91 85911 06632',
    superAdminPin: '9999', // Zain Master PIN
    adminPin: '7860',      // Committee Zimmedaran PIN
    defaultMemberPin: '1234',
    googleSheetUrl: '',
    googleSheetApiKey: '',
    currencySymbol: '₹',
    bioLinks: {
      whatsapp: 'https://whatsapp.com/channel/0029VacNKL4DjiOgHMNQdp2j',
      instagram: 'https://www.instagram.com/jrmantophill?igsh=a2dzNDYxb2VycW04',
      facebook: 'https://www.facebook.com/share/19VizVNW9Q/',
      youtube: 'http://www.youtube.com/@jrmantophill-s8k',
      maps: 'https://maps.google.com/?q=Akbar+Suleman+Compound+Antophill+Wadala+Mumbai',
      helpline: '+91 85911 06632'
    },
    activePosterUrl: 'https://jrmantophill.esitesz.com/jrmantophill.jpeg',
    posterAnnouncement: '41st Mahana Sunni Deeni Nashisht Mehfil — In Sha Allah Monday, 16 November 2026 at Akbar Suleman Compound, Antophill, Wadala. All devotees are cordially invited to attend with discipline.'
  };

  // Programs — Active Upcoming Program Promoted + Past Mehfils Archived
  const DEFAULT_PROGRAMS = [
    {
      id: 'prog-nov-2026',
      title: '(41) MAHANA SUNNI DEENI NASHISHT MEHFIL',
      month: 'November',
      year: 2026,
      date: '2026-11-16',
      day: 'Monday',
      time: '08:30 PM (IST)',
      status: 'upcoming',
      targetCollection: 22000,
      description: 'The 41st Monthly Sunni Deeni Nashisht spiritual & educational gathering of Jamat Raza-e-Mustafa Antophill Mumbai. Featuring Tilawat-e-Quran, Kalam-e-Raza, speeches by renowned Ulama-e-Ahle Sunnat, Tabarruk distribution, and collective Dua for peace and unity.',
      venue: 'Akbar Suleman Compound (Bada Maidan), Antophill, Wadala, Mumbai 400037',
      posterUrl: 'https://jrmantophill.esitesz.com/jrmantophill.jpeg',
      posterAnnouncement: '41st Mahana Sunni Deeni Nashisht Mehfil — In Sha Allah Monday, 16 November 2026. Join us for an evening of spiritual enlightenment and Shariah guidance under the supervision of Ulama-e-Kiram.',
      rsvpCount: 168,
      createdAt: '2026-10-20T10:00:00Z'
    },
    {
      id: 'prog-oct-2026',
      title: '(40) MAHANA SUNNI DEENI NASHISHT MEHFIL',
      month: 'October',
      year: 2026,
      date: '2026-10-19',
      day: 'Monday',
      time: '08:30 PM (IST)',
      status: 'completed',
      targetCollection: 20000,
      description: '40th Monthly Sunni Deeni Nashisht Program held at Antophill, Wadala. Verified total collection of ₹18,241 received from 39 members.',
      venue: 'Akbar Suleman Compound (Bada Maidan), Antophill, Wadala, Mumbai 400037',
      posterUrl: '',
      posterAnnouncement: '40th Mahana Sunni Deeni Nashisht Mehfil concluded successfully with community blessings and Ulama guidance.',
      rsvpCount: 195,
      createdAt: '2026-10-01T10:00:00Z'
    },
    {
      id: 'prog-sep-2026',
      title: 'MAAHANA SUNNI DEENI NASHIST PROGRAM (September)',
      month: 'September',
      year: 2026,
      date: '2026-09-21',
      day: 'Monday',
      time: '08:30 PM (IST)',
      status: 'completed',
      targetCollection: 18000,
      description: 'Monthly Management & Program Mehfil. Management expenses audited at ₹17,800 (Nazrana, Rent, Niyaz, Sound, Social Media, Miscellaneous).',
      venue: 'Antophill, Wadala, Mumbai 400037',
      posterUrl: '',
      posterAnnouncement: 'September 2026 Mehfil management accounts fully cleared and verified.',
      rsvpCount: 154,
      createdAt: '2026-09-01T10:00:00Z'
    }
  ];

  // Authentic Seed Collections with Email, Phone & 4-digit PIN
  const DEFAULT_COLLECTIONS = [
    { id: 'col-01', memberNo: 1, name: 'Sayed Yusuf', phone: '9820011001', email: 'sayed.yusuf@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-YUSUF', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-02', memberNo: 2, name: 'Sayed jalaluddin', phone: '9820011002', email: 'jalaluddin@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 1000, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-JALAL', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-03', memberNo: 3, name: 'Sayed altamash', phone: '9820011003', email: 'altamash@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-ALTAMASH', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-04', memberNo: 4, name: 'Sayed Asif', phone: '9820011004', email: 'asif.sayed@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-ASIF', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-05', memberNo: 5, name: 'Sayed Arshad', phone: '9820011005', email: 'arshad.sayed@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-ARSHAD', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-06', memberNo: 6, name: 'Syed Abbas', phone: '9820011006', email: 'abbas.syed@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-ABBAS', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-07', memberNo: 7, name: 'Dr Seyd Yasin Ahmad', phone: '9820011007', email: 'dr.yasin@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 1000, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-YASIN', date: '2026-10-19', notes: 'Special Mehfil Fund' },
    { id: 'col-08', memberNo: 8, name: 'Dr Abdul Karim', phone: '9820011008', email: 'dr.karim@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 1000, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-KARIM', date: '2026-10-19', notes: 'Special Mehfil Fund' },
    { id: 'col-09', memberNo: 9, name: 'Salim Bhai Azhari', phone: '9820011009', email: 'salim.azhari@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 0, balance: 2000, mode: 'Pending', status: 'pending', token: 'JRM-2610-SALIM-AZ', date: '2026-10-19', notes: 'Previous dues pending' },
    { id: 'col-10', memberNo: 10, name: 'Salim Bhai Siraji', phone: '9820011010', email: 'salim.siraji@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-SALIM-SI', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-11', memberNo: 11, name: 'Imtiyaz Bhai', phone: '9820011011', email: 'imtiyaz@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-IMTIYAZ', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-12', memberNo: 12, name: 'Riyaz Bhai', phone: '9820011012', email: 'riyaz@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-RIYAZ', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-13', memberNo: 13, name: 'Firoz Bhai Best', phone: '9820011013', email: 'firoz.best@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-FIROZ', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-14', memberNo: 14, name: 'Zuber Bhai', phone: '9820011014', email: 'zuber@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-ZUBER', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-16', memberNo: 16, name: 'Khalid Bhai', phone: '9820011016', email: 'khalid@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 0, balance: 500, mode: 'Pending', status: 'pending', token: 'JRM-2610-KHALID', date: '2026-10-19', notes: 'Pending balance' },
    { id: 'col-17', memberNo: 17, name: 'Shahbaz Bhai', phone: '9820011017', email: 'shahbaz@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 300, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-SHAHBAZ', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-18', memberNo: 18, name: 'Sahil Bhai', phone: '9820011018', email: 'sahil@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 0, balance: 500, mode: 'Pending', status: 'pending', token: 'JRM-2610-SAHIL', date: '2026-10-19', notes: 'Pending balance' },
    { id: 'col-19', memberNo: 19, name: 'Afroz Razvi', phone: '9820011019', email: 'afroz.razvi@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 0, balance: 1100, mode: 'Pending', status: 'pending', token: 'JRM-2610-AFROZ', date: '2026-10-19', notes: 'Pending balance' },
    { id: 'col-20', memberNo: 20, name: 'Abdul Gaffar', phone: '9820011020', email: 'gaffar1@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-GAFFAR1', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-21', memberNo: 21, name: 'Ammo Bhai', phone: '9820011021', email: 'ammo@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 0, balance: 500, mode: 'Pending', status: 'pending', token: 'JRM-2610-AMMO', date: '2026-10-19', notes: 'Pending balance' },
    { id: 'col-22', memberNo: 22, name: 'Zainuddin Razvi', phone: '9820011022', email: 'zainuddin.razvi@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-ZAINUDDIN', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-23', memberNo: 23, name: 'Moshin Mansuri', phone: '9820011023', email: 'moshin.mansuri@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-MOSHIN-M', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-24', memberNo: 24, name: 'Shoaib Razvi', phone: '9820011024', email: 'shoaib.razvi@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 300, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-SHOAIB-R', date: '2026-10-19', notes: 'Balance cleared' },
    { id: 'col-25', memberNo: 25, name: 'Anzar Bhai Maidan', phone: '9820011025', email: 'anzar.maidan@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 0, balance: 500, mode: 'Pending', status: 'pending', token: 'JRM-2610-ANZAR', date: '2026-10-19', notes: 'Pending balance' },
    { id: 'col-26', memberNo: 26, name: 'Asif Arab', phone: '9820011026', email: 'asif.arab@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 1000, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-ASIF-ARAB', date: '2026-10-19', notes: 'Balance cleared' },
    { id: 'col-27', memberNo: 27, name: 'Rafiq Bhai', phone: '9820011027', email: 'rafiq@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 0, balance: 500, mode: 'Pending', status: 'pending', token: 'JRM-2610-RAFIQ', date: '2026-10-19', notes: 'Pending balance' },
    { id: 'col-28', memberNo: 28, name: 'Rahan Razvi', phone: '9820011028', email: 'rahan.razvi@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-RAHAN', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-29', memberNo: 29, name: 'Sameer Razvi', phone: '9820011029', email: 'sameer.razvi@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-SAMEER', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-30', memberNo: 30, name: 'Imran Bhai Maidan', phone: '9820011030', email: 'imran.maidan@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 1000, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-IMRAN', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-31', memberNo: 31, name: 'Hussain Razvi', phone: '9820011031', email: 'hussain.razvi@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 511, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-HUSSAIN', date: '2026-10-19', notes: 'Mehfil Niyaz Contribution' },
    { id: 'col-32', memberNo: 32, name: 'Ahmed Bhai', phone: '9820011032', email: 'ahmed@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-AHMED', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-33', memberNo: 33, name: 'Abdul Gaffar Bhai', phone: '9820011033', email: 'gaffar.bhai@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 1000, balance: 0, mode: 'Bank UPI', status: 'paid', token: 'JRM-2610-GAFFAR2', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-34', memberNo: 34, name: 'Shoaib Bhai maidan', phone: '9820011034', email: 'shoaib.maidan@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-SHOAIB-M', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-35', memberNo: 35, name: 'Afridi Razvi', phone: '9820011035', email: 'afridi.razvi@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-AFRIDI', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-36', memberNo: 36, name: 'Moshin Azhari', phone: '9820011036', email: 'moshin.azhari@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-MOSHIN-A', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-37', memberNo: 37, name: 'Naaim Bhai group', phone: '9820011037', email: 'naaim.group@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 630, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-NAAIM-GRP', date: '2026-10-19', notes: 'Group fund balance cleared' },
    { id: 'col-38', memberNo: 38, name: 'Mohd Azad Bhai', phone: '9820011038', email: 'azad.bhai@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-AZAD', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' },
    { id: 'col-40', memberNo: 40, name: 'Sajid bhai maidan', phone: '9820011040', email: 'sajid.maidan@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 0, balance: 0, mode: 'Settled', status: 'paid', token: 'JRM-2610-SAJID', date: '2026-10-19', notes: 'Balance settled 0' },
    { id: 'col-41', memberNo: 41, name: 'Shadab Bhai maidan', phone: '9820011041', email: 'shadab.maidan@jrmantophill.org', pin: '1234', programId: 'prog-oct-2026', paid: 500, balance: 0, mode: 'Cash', status: 'paid', token: 'JRM-2610-SHADAB', date: '2026-10-19', notes: 'Monthly Mehfil Contribution' }
  ];

  // Authentic Seed Expenses
  const DEFAULT_EXPENSES = [
    { id: 'exp-01', itemNo: 1, title: 'Nazrana (Ulama & Mashaikh)', category: 'Nazrana', amount: 4000, programId: 'prog-sep-2026', paidTo: 'Hazrat / Ulama-e-Kiram', mode: 'Cash', date: '2026-09-21', voucherNo: 'VCH-SEP-001', notes: 'Nazrana honorarium for visiting Ulama' },
    { id: 'exp-02', itemNo: 2, title: 'Madrasa Premises Rent', category: 'Madrasa Rent', amount: 1000, programId: 'prog-sep-2026', paidTo: 'Madrasa Hall Committee', mode: 'Cash', date: '2026-09-21', voucherNo: 'VCH-SEP-002', notes: 'Seating & hall arrangements' },
    { id: 'exp-03', itemNo: 3, title: 'Niyaz / Tabarruk Distribution', category: 'Niyaz', amount: 5800, programId: 'prog-sep-2026', paidTo: 'Catering & Tabarruk Khidmat', mode: 'Cash', date: '2026-09-21', voucherNo: 'VCH-SEP-003', notes: 'Tabarruk distribution for all participants' },
    { id: 'exp-04', itemNo: 4, title: 'High-Clarity Sound System & Mics', category: 'Sound', amount: 3000, programId: 'prog-sep-2026', paidTo: 'Antophill Sound Service', mode: 'Cash', date: '2026-09-21', voucherNo: 'VCH-SEP-004', notes: 'Audio setup and acoustic monitoring' },
    { id: 'exp-05', itemNo: 5, title: 'Social Media Broadcast & Live Stream', category: 'Social Media', amount: 3000, programId: 'prog-sep-2026', paidTo: 'Digital Media Khidmat Team', mode: 'Bank UPI', date: '2026-09-21', voucherNo: 'VCH-SEP-005', notes: 'YouTube, Facebook and Instagram broadcast setup' },
    { id: 'exp-06', itemNo: 6, title: 'Miscellaneous (Parchun Kharcha)', category: 'Parchun Kharcha', amount: 1000, programId: 'prog-sep-2026', paidTo: 'Local Market Antophill', mode: 'Cash', date: '2026-09-21', voucherNo: 'VCH-SEP-006', notes: 'Bottled water, stationery, banners and carpets' }
  ];

  // Dynamic Media & Bayanats Feed
  const DEFAULT_MEDIA = [
    {
      id: 'med-01',
      type: 'youtube',
      title: 'Monthly Sunni Deeni Nashisht: Haqeeqat-e-Maslak-e-Ala Hazrat',
      speaker: 'Ulama-e-Ahle Sunnat',
      date: '2026-10-19',
      channel: '@jrmantophill-s8k',
      url: 'http://www.youtube.com/@jrmantophill-s8k',
      embedId: '',
      description: 'Recorded live at Akbar Suleman Compound, Antophill, Wadala. Spiritual discourse on Islamic ethics and Shariah guidance.'
    },
    {
      id: 'med-02',
      type: 'youtube',
      title: 'Seerat-e-Mustafa ﷺ & Importance of Islamic Education for Youth',
      speaker: 'Guest Ulama Delegation',
      date: '2026-09-21',
      channel: '@jrmantophill-s8k',
      url: 'http://www.youtube.com/@jrmantophill-s8k',
      embedId: '',
      description: 'Comprehensive lecture on youth empowerment and the legacy of Huzoor Mufti-e-Azam Hind.'
    },
    {
      id: 'med-03',
      type: 'reel',
      title: 'Mehfil Gathering Highlights — Akbar Suleman Compound',
      speaker: 'JRM Antophill Khuddam',
      date: '2026-10-19',
      channel: '@jrmantophill',
      url: 'https://www.instagram.com/jrmantophill?igsh=a2dzNDYxb2VycW04',
      description: 'Short video glimpses of attendees reciting Durood Shareef and Naat.'
    },
    {
      id: 'med-04',
      type: 'reel',
      title: 'Kalam-e-Raza Recitation & Tabarruk Distribution',
      speaker: 'Naat Khawan Team',
      date: '2026-10-19',
      channel: '@jrmantophill',
      url: 'https://www.instagram.com/jrmantophill?igsh=a2dzNDYxb2VycW04',
      description: 'Heartfelt recitations of Ala Hazrat Imam Ahmad Raza Khan Bareilvi.'
    }
  ];

  const DEFAULT_LOGS = [
    { id: 'log-01', timestamp: '2026-10-19T10:15:00Z', istTime: '19-10-2026, 03:45:00 PM IST', user: 'Zain (Super Admin)', action: 'INIT', details: 'Initialized JRM Antophill Database with 39 Member Records and November Upcoming Mehfil.' },
    { id: 'log-02', timestamp: '2026-10-19T11:00:00Z', istTime: '19-10-2026, 04:30:00 PM IST', user: 'Zain (Super Admin)', action: 'COLLECTION_VERIFY', details: 'Audited ₹18,241 total collections for October Sunni Deeni Nashisht.' },
    { id: 'log-03', timestamp: '2026-10-19T11:30:00Z', istTime: '19-10-2026, 05:00:00 PM IST', user: 'Zain (Super Admin)', action: 'EXPENSE_RECORD', details: 'Verified September Expenses: Nazrana, Madrasa Rent, Niyaz, Sound, Social Media, Parchun Kharcha (Total ₹17,800).' }
  ];

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
      if (!Storage.get(STORAGE_KEYS.MEDIA)) Storage.set(STORAGE_KEYS.MEDIA, DEFAULT_MEDIA);
    },

    getSettings() {
      return Object.assign({}, DEFAULT_SETTINGS, Storage.get(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS));
    },
    saveSettings(newSettings) {
      const merged = Object.assign({}, this.getSettings(), newSettings);
      Storage.set(STORAGE_KEYS.SETTINGS, merged);
      return merged;
    },

    getRole() {
      if (this.isSuperAdminLoggedIn()) return 'superadmin';
      if (this.isAdminLoggedIn()) return 'admin';
      if (this.isMemberLoggedIn()) return 'member';
      return 'public';
    },

    // Super Admin Auth (Zain Master)
    isSuperAdminLoggedIn() {
      const session = Storage.get(STORAGE_KEYS.SUPER_ADMIN_SESSION, null);
      if (!session) return false;
      if (session.expiresAt && Date.now() < session.expiresAt) return true;
      Storage.remove(STORAGE_KEYS.SUPER_ADMIN_SESSION);
      return false;
    },
    loginSuperAdmin(pin) {
      const settings = this.getSettings();
      if (pin && pin.trim() === settings.superAdminPin.trim()) {
        const session = {
          loggedIn: true,
          role: 'superadmin',
          name: 'Zain (Super Admin)',
          loggedInAt: Date.now(),
          expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
        };
        Storage.set(STORAGE_KEYS.SUPER_ADMIN_SESSION, session);
        Storage.remove(STORAGE_KEYS.MEMBER_SESSION);
        this.log('SUPER_ADMIN_LOGIN', 'Zain logged in with Super Admin master privileges.');
        return { success: true };
      }
      return { success: false, error: 'Incorrect Super Admin PIN.' };
    },
    logoutSuperAdmin() {
      Storage.remove(STORAGE_KEYS.SUPER_ADMIN_SESSION);
      this.log('SUPER_ADMIN_LOGOUT', 'Super Admin logged out.');
      return true;
    },

    // Committee Admin Auth
    isAdminLoggedIn() {
      if (this.isSuperAdminLoggedIn()) return true;
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
          role: 'admin',
          name: 'Committee Admin',
          loggedInAt: Date.now(),
          expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
        };
        Storage.set(STORAGE_KEYS.ADMIN_SESSION, session);
        Storage.remove(STORAGE_KEYS.MEMBER_SESSION);
        this.log('ADMIN_LOGIN', 'Committee Admin logged in.');
        return { success: true };
      }
      return { success: false, error: 'Incorrect Committee Admin PIN.' };
    },
    logoutAdmin() {
      Storage.remove(STORAGE_KEYS.ADMIN_SESSION);
      Storage.remove(STORAGE_KEYS.SUPER_ADMIN_SESSION);
      this.log('ADMIN_LOGOUT', 'Admin session logged out.');
      return true;
    },

    // Member Authentication — Email / Mobile OTP Based
    isMemberLoggedIn() {
      const session = Storage.get(STORAGE_KEYS.MEMBER_SESSION, null);
      if (!session) return false;
      if (session.expiresAt && Date.now() < session.expiresAt) return true;
      Storage.remove(STORAGE_KEYS.MEMBER_SESSION);
      return false;
    },
    getLoggedInMember() {
      return Storage.get(STORAGE_KEYS.MEMBER_SESSION, null);
    },

    requestMemberOTP(emailOrPhone) {
      if (!emailOrPhone || !emailOrPhone.trim()) {
        return { success: false, error: 'Please enter your registered email address or mobile number.' };
      }

      const input = emailOrPhone.trim().toLowerCase();
      const all = this.getCollections();

      const member = all.find(c => {
        const byEmail = c.email && c.email.toLowerCase() === input;
        const byPhone = c.phone && c.phone.trim() === input;
        const byToken = c.token && c.token.toLowerCase() === input;
        const byName = c.name && c.name.toLowerCase() === input;
        return byEmail || byPhone || byToken || byName;
      });

      if (!member) {
        return { success: false, error: 'No member record found matching this email or phone.' };
      }

      // Generate a 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpPayload = {
        memberId: member.id,
        otp: otpCode,
        identifier: input,
        expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
      };
      Storage.set(STORAGE_KEYS.PENDING_OTP, otpPayload);

      // Mask identifier for user display
      const isEmail = input.includes('@');
      let masked = input;
      if (isEmail) {
        const parts = input.split('@');
        masked = parts[0].slice(0, 2) + '***@' + parts[1];
      } else if (input.length >= 10) {
        masked = input.slice(0, 2) + '******' + input.slice(-2);
      }

      this.log('OTP_REQUESTED', `OTP requested for member: ${member.name}`);
      return {
        success: true,
        member: member,
        otp: otpCode,
        maskedTarget: masked
      };
    },

    verifyMemberOTP(enteredOtp) {
      const pending = Storage.get(STORAGE_KEYS.PENDING_OTP, null);
      if (!pending) {
        return { success: false, error: 'No active OTP request. Please request a new OTP code.' };
      }

      if (Date.now() > pending.expiresAt) {
        Storage.remove(STORAGE_KEYS.PENDING_OTP);
        return { success: false, error: 'OTP has expired. Please request a new code.' };
      }

      if (!enteredOtp || enteredOtp.trim() !== pending.otp) {
        return { success: false, error: 'Incorrect 6-digit OTP code. Please check and re-enter.' };
      }

      const member = this.getCollectionById(pending.memberId);
      if (!member) {
        return { success: false, error: 'Member not found.' };
      }

      const session = {
        memberId: member.id,
        name: member.name,
        email: member.email || '',
        phone: member.phone || '',
        token: member.token,
        loggedInAt: Date.now(),
        expiresAt: Date.now() + (14 * 24 * 60 * 60 * 1000)
      };

      Storage.set(STORAGE_KEYS.MEMBER_SESSION, session);
      Storage.remove(STORAGE_KEYS.PENDING_OTP);
      this.log('MEMBER_LOGIN_OTP', `Member authenticated via OTP: ${member.name}`);
      return { success: true, member };
    },

    // Direct PIN Fallback Login
    loginMemberWithPIN(identifier, pin) {
      if (!identifier || !pin) {
        return { success: false, error: 'Please enter identifier and 4-digit PIN.' };
      }
      const cleanId = identifier.trim().toLowerCase();
      const cleanPin = pin.trim();
      const all = this.getCollections();

      const match = all.find(c => {
        return (c.phone && c.phone === cleanId) ||
               (c.email && c.email.toLowerCase() === cleanId) ||
               (c.token && c.token.toLowerCase() === cleanId) ||
               (c.name && c.name.toLowerCase() === cleanId);
      });

      if (!match) return { success: false, error: 'Member record not found.' };
      const expected = (match.pin && match.pin.trim()) || '1234';
      if (cleanPin !== expected) return { success: false, error: 'Invalid PIN.' };

      const session = {
        memberId: match.id,
        name: match.name,
        email: match.email || '',
        phone: match.phone || '',
        token: match.token,
        loggedInAt: Date.now(),
        expiresAt: Date.now() + (14 * 24 * 60 * 60 * 1000)
      };
      Storage.set(STORAGE_KEYS.MEMBER_SESSION, session);
      this.log('MEMBER_LOGIN_PIN', `Member logged in with PIN: ${match.name}`);
      return { success: true, member: match };
    },

    logoutMember() {
      Storage.remove(STORAGE_KEYS.MEMBER_SESSION);
      return true;
    },
    logoutAll() {
      Storage.remove(STORAGE_KEYS.SUPER_ADMIN_SESSION);
      Storage.remove(STORAGE_KEYS.ADMIN_SESSION);
      Storage.remove(STORAGE_KEYS.MEMBER_SESSION);
      return true;
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
      return progs.find(p => p.status === 'upcoming') || progs.find(p => p.status === 'active') || progs[0] || null;
    },
    saveProgram(program) {
      const progs = this.getPrograms();
      if (!program.id) {
        program.id = 'prog-' + Date.now();
        program.createdAt = new Date().toISOString();
        progs.unshift(program);
        this.log('PROGRAM_ADD', `Created program: ${program.title}`);
      } else {
        const idx = progs.findIndex(p => p.id === program.id);
        if (idx >= 0) {
          progs[idx] = Object.assign({}, progs[idx], program);
          this.log('PROGRAM_UPDATE', `Updated program: ${program.title}`);
        } else {
          progs.push(program);
        }
      }
      Storage.set(STORAGE_KEYS.PROGRAMS, progs);
      return program;
    },

    // Media & Reels Feed
    getMediaItems() {
      return Storage.get(STORAGE_KEYS.MEDIA, DEFAULT_MEDIA);
    },
    saveMediaItem(item) {
      const list = this.getMediaItems();
      if (!item.id) {
        item.id = 'med-' + Date.now();
        list.unshift(item);
      } else {
        const idx = list.findIndex(m => m.id === item.id);
        if (idx >= 0) list[idx] = Object.assign({}, list[idx], item);
        else list.push(item);
      }
      Storage.set(STORAGE_KEYS.MEDIA, list);
      return item;
    },
    deleteMediaItem(id) {
      const list = this.getMediaItems().filter(m => m.id !== id);
      Storage.set(STORAGE_KEYS.MEDIA, list);
      return true;
    },

    // Member Collections
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
    saveCollection(entry) {
      const list = this.getCollections();
      if (!entry.id) {
        entry.id = 'col-' + Date.now();
        entry.token = entry.token || generateVerificationToken();
        entry.date = entry.date || new Date().toISOString().split('T')[0];
        entry.pin = entry.pin || '1234';
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
    updateMemberCredentials(memberId, newPin, newPhone, newEmail) {
      const list = this.getCollections();
      const member = list.find(c => c.id === memberId);
      if (!member) return { success: false, error: 'Member not found' };

      if (newPin && newPin.trim()) member.pin = newPin.trim();
      if (newPhone !== undefined) member.phone = newPhone.trim();
      if (newEmail !== undefined) member.email = newEmail.trim();

      Storage.set(STORAGE_KEYS.COLLECTIONS, list);
      this.log('MEMBER_UPDATE', `Updated credentials for ${member.name}.`);
      return { success: true, member };
    },

    // Member Specific Ledger
    getMemberLedger(memberName) {
      if (!memberName) return [];
      const clean = memberName.trim().toLowerCase();
      return this.getCollections().filter(c => c.name && c.name.toLowerCase() === clean);
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

    // Public Transparency Breakdown (Zero Private Member Names)
    getPublicTransparency(programId = null) {
      const collections = this.getCollections(programId);
      let expenses = this.getExpenses(programId);
      if (!expenses || expenses.length === 0) {
        expenses = this.getExpenses();
      }

      const totalCollected = collections.reduce((acc, c) => acc + (Number(c.paid) || 0), 0);
      const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
      const netBalance = totalCollected - totalExpenses;

      return {
        totalCollected,
        totalExpenses,
        netBalance,
        expensesList: expenses.map(e => ({
          title: e.title,
          category: e.category,
          amount: e.amount,
          date: e.date,
          paidTo: e.paidTo
        }))
      };
    },

    // Audit Logs (IST)
    getLogs(limit = 100) {
      const logs = Storage.get(STORAGE_KEYS.LOGS, DEFAULT_LOGS);
      return logs.slice(-limit).reverse();
    },
    log(action, details) {
      const logs = Storage.get(STORAGE_KEYS.LOGS, DEFAULT_LOGS);
      const now = new Date();
      const istTime = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
      let currentUser = 'Public';
      if (this.isSuperAdminLoggedIn()) currentUser = 'Zain (Super Admin)';
      else if (this.isAdminLoggedIn()) currentUser = 'Committee Admin';
      else if (this.isMemberLoggedIn()) currentUser = (this.getLoggedInMember()?.name || 'Member');

      const entry = {
        id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        timestamp: now.toISOString(),
        istTime: istTime,
        user: currentUser,
        action: action,
        details: details
      };
      logs.push(entry);
      if (logs.length > 500) logs.shift();
      Storage.set(STORAGE_KEYS.LOGS, logs);
      return entry;
    },

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
        .filter(c => (c.mode || '').toLowerCase().includes('bank') || (c.mode || '').toLowerCase().includes('upi'))
        .reduce((acc, c) => acc + (Number(c.paid) || 0), 0);

      const pendingCount = collections.filter(c => Number(c.balance) > 0).length;

      return {
        totalCollected,
        totalPendingBalance,
        totalExpenses,
        netBalance,
        cashCollected,
        bankCollected,
        totalMembers: collections.length,
        pendingCount
      };
    },

    exportCollectionsCSV(programId = null) {
      const rows = this.getCollections(programId);
      const headers = ['Sr', 'Name', 'Phone', 'Email', 'Paid (INR)', 'Balance (INR)', 'Mode', 'Date (IST)', 'Receipt Token', 'Notes'];
      const lines = [headers.join(',')];
      rows.forEach(r => {
        lines.push([
          r.memberNo || '',
          `"${(r.name || '').replace(/"/g, '""')}"`,
          `"${r.phone || ''}"`,
          `"${r.email || ''}"`,
          r.paid || 0,
          r.balance || 0,
          `"${r.mode || 'Cash'}"`,
          r.date || '',
          r.token || '',
          `"${(r.notes || '').replace(/"/g, '""')}"`
        ].join(','));
      });
      return lines.join('\n');
    },

    exportExpensesCSV(programId = null) {
      const rows = this.getExpenses(programId);
      const headers = ['Sr', 'Title', 'Category', 'Amount (INR)', 'Paid To', 'Mode', 'Date (IST)', 'Voucher No', 'Notes'];
      const lines = [headers.join(',')];
      rows.forEach(e => {
        lines.push([
          e.itemNo || '',
          `"${(e.title || '').replace(/"/g, '""')}"`,
          `"${e.category || ''}"`,
          e.amount || 0,
          `"${(e.paidTo || '').replace(/"/g, '""')}"`,
          `"${e.mode || 'Cash'}"`,
          e.date || '',
          e.voucherNo || '',
          `"${(e.notes || '').replace(/"/g, '""')}"`
        ].join(','));
      });
      return lines.join('\n');
    },

    exportFullBackup() {
      return JSON.stringify({
        version: '3.0.0',
        exportedAt: new Date().toISOString(),
        programs: this.getPrograms(),
        collections: this.getCollections(),
        expenses: this.getExpenses(),
        media: this.getMediaItems(),
        settings: this.getSettings(),
        logs: this.getLogs(500)
      }, null, 2);
    },

    importFullBackup(jsonString) {
      try {
        const data = JSON.parse(jsonString);
        if (data.programs) Storage.set(STORAGE_KEYS.PROGRAMS, data.programs);
        if (data.collections) Storage.set(STORAGE_KEYS.COLLECTIONS, data.collections);
        if (data.expenses) Storage.set(STORAGE_KEYS.EXPENSES, data.expenses);
        if (data.media) Storage.set(STORAGE_KEYS.MEDIA, data.media);
        if (data.settings) Storage.set(STORAGE_KEYS.SETTINGS, data.settings);
        if (data.logs) Storage.set(STORAGE_KEYS.LOGS, data.logs);
        this.log('DATA_IMPORT', 'Database restored from JSON backup.');
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },

    resetToDefault() {
      Storage.set(STORAGE_KEYS.PROGRAMS, DEFAULT_PROGRAMS);
      Storage.set(STORAGE_KEYS.COLLECTIONS, DEFAULT_COLLECTIONS);
      Storage.set(STORAGE_KEYS.EXPENSES, DEFAULT_EXPENSES);
      Storage.set(STORAGE_KEYS.LOGS, DEFAULT_LOGS);
      Storage.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      Storage.set(STORAGE_KEYS.MEDIA, DEFAULT_MEDIA);
      return true;
    },

    formatINR,
    numberToWordsINR,
    generateVerificationToken
  };

  JRMData.init();
  window.JRMData = JRMData;

})(window);
