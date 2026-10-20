/**
 * Jamat Raza-E-Mustafa (JRM) Antophill, Wadala, Mumbai
 * Official Islamic Trust Branch of Jamat Raza-E-Mustafa Bareilly Sharif (Est. 1920)
 * Central Website: jamatrazaemustafa.org | Branch Portal: jrmantophill.esitesz.com
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    PROGRAMS: 'jrm_programs_trust_v1',
    COLLECTIONS: 'jrm_collections_trust_v1',
    EXPENSES: 'jrm_expenses_trust_v1',
    LOGS: 'jrm_audit_logs_trust_v1',
    SETTINGS: 'jrm_settings_trust_v1',
    MEDIA: 'jrm_media_trust_v1',
    PENDING_OTP: 'jrm_pending_otp_trust_v1',
    SUPER_ADMIN_SESSION: 'jrm_super_session_trust_v1',
    ADMIN_SESSION: 'jrm_admin_session_trust_v1',
    MEMBER_SESSION: 'jrm_member_session_trust_v1'
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

  // Official Central Trust & Branch Configuration
  const DEFAULT_SETTINGS = {
    orgName: 'Jamat Raza-E-Mustafa Antophill',
    orgShort: 'JRM Antophill',
    orgBranch: 'Antophill, Wadala, Mumbai Chapter',
    orgFull: 'Jamat Raza-E-Mustafa (JRM) Antophill, Wadala, Mumbai',
    centralOrgName: 'Jamat Raza-E-Mustafa (Central Bareilly Sharif)',
    centralWebsite: 'https://www.jamatrazaemustafa.org/',
    centralHQ: 'Dargah-e-Aala Hazrat, Saudagran, Bareilly Sharif, Uttar Pradesh (Founded 1920 by Ala Hazrat Imam Ahmed Raza Khan Bareilvi)',
    supremePatron: 'Huzoor Qaid-e-Millat Allama Asjad Raza Khan Qadri Madda Zillahul Aali (Chief Patron & President, Central JRM)',
    localAdministration: 'Supervised by Ulama-e-Ahle Sunnat • Administered by Zain & Committee Zimmedaran',
    domain: 'jrmantophill.esitesz.com',
    developerCredit: 'Developed by esitesz',
    developerUrl: 'https://esitesz.com',
    venueAddress: 'Akbar Suleman Compound (Bada Maidan), Antophill, Wadala East, Mumbai 400037, Maharashtra, India',
    officialEmail: 'jamatrazaemustafa313@gmail.com',
    centralEmail: 'contact@jamatrazaemustafa.org',
    officialPhone: '+91 85911 06632',
    superAdminPin: '9999', // Zain Master PIN
    adminPin: '7860',      // Committee Zimmedaran PIN
    defaultMemberPin: '1234',
    googleSheetUrl: '',
    googleSheetApiKey: '',
    currencySymbol: '₹',
    hijriDate: '1448 AH (Jumada al-Awwal)',
    bioLinks: {
      whatsapp: 'https://whatsapp.com/channel/0029VacNKL4DjiOgHMNQdp2j',
      instagram: 'https://www.instagram.com/jrmantophill?igsh=a2dzNDYxb2VycW04',
      facebook: 'https://www.facebook.com/share/19VizVNW9Q/',
      youtube: 'http://www.youtube.com/@jrmantophill-s8k',
      maps: 'https://maps.google.com/?q=Akbar+Suleman+Compound+Antophill+Wadala+Mumbai',
      helpline: '+91 85911 06632'
    },
    activePosterUrl: 'https://jrmantophill.esitesz.com/jrmantophill.jpeg',
    posterAnnouncement: '41st Mahana Sunni Deeni Nashisht Mehfil — In Sha Allah Monday, 16 November 2026 at Akbar Suleman Compound, Antophill, Wadala. All devotees and Ahle Sunnah community members are invited to attend with discipline.'
  };

  // Personalities of the Central Trust
  const DEFAULT_PERSONALITIES = [
    {
      id: 'pers-01',
      name: 'Imam Ahmed Raza Khan Fazil-e-Bareilvi (Aala Hazrat)',
      title: 'Founder of Jamat Raza-E-Mustafa (1920) • Mujaddid of the 14th Century',
      period: '1856 – 1921 CE / 1272 – 1340 AH',
      bio: 'Eminent Islamic jurist, theologian, philosopher, mathematician, and spiritual master. Authored monumental works including Fatawa Razaviyya (30 volumes) and Kanzul Iman. Founded Jamat Raza-e-Mustafa to preserve Sunni Islamic beliefs and social welfare.',
      icon: '🕌'
    },
    {
      id: 'pers-02',
      name: 'Huzoor Hujjat-ul-Islam Maulana Hamid Raza Khan Qadri',
      title: 'First Sajjada Nasheen of Bareilly Sharif • Eldest Son of Aala Hazrat',
      period: '1875 – 1943 CE / 1292 – 1362 AH',
      bio: 'Renowned scholar, debater, and spiritual successor. Led Jamat Raza-E-Mustafa across British India, championing religious education and social upliftment.',
      icon: '📖'
    },
    {
      id: 'pers-03',
      name: 'Huzoor Mufti-e-Azam Hind Maulana Mustafa Raza Khan',
      title: 'Grand Mufti of India • Second Son of Aala Hazrat',
      period: '1892 – 1981 CE / 1310 – 1402 AH',
      bio: 'Spiritual beacon of millions across the globe. Authored Fatawa Mustafawiyya and Saman-e-Bakhshish. Established Jamat Raza-e-Mustafa as a global voice for Ahle Sunnah wal Jama\'ah.',
      icon: '🌟'
    },
    {
      id: 'pers-04',
      name: 'Huzoor Tajushshariah Mufti Akhtar Raza Khan Azhari',
      title: 'Fakhr-e-Azhar • Chief Islamic Jurist & Spiritual Guide',
      period: '1943 – 2018 CE / 1362 – 1439 AH',
      bio: 'World-renowned Al-Azhar graduate, internationally ranked among the world\'s most influential Islamic personalities. Patronized Jamat Raza-E-Mustafa chapters across Mumbai, Maharashtra, and 40+ countries.',
      icon: '🎓'
    },
    {
      id: 'pers-05',
      name: 'Huzoor Qaid-e-Millat Allama Asjad Raza Khan Qadri',
      title: 'President & Supreme Patron, Jamat Raza-E-Mustafa',
      period: 'Present Leader',
      bio: 'Current spiritual head and President of Central Jamat Raza-E-Mustafa Bareilly Sharif. Inspiring youth mobilization, modern educational centers, and branch expansions worldwide, including the Antophill Wadala chapter.',
      icon: '👑'
    }
  ];

  // Programs — Spotlight Active (41st) + Past Archive (40th & 39th)
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
      description: '41st Monthly Sunni Deeni Nashisht spiritual & educational conference organized by Jamat Raza-E-Mustafa Antophill Wadala. Program includes Quranic recitation, Kalam-e-Raza, speeches by visiting Ulama-e-Ahle Sunnat on Islamic ethics and Shariah guidance, followed by Langar-e-Raza Tabarruk and collective Dua.',
      venue: 'Akbar Suleman Compound (Bada Maidan), Antophill, Wadala East, Mumbai 400037',
      posterUrl: 'https://jrmantophill.esitesz.com/jrmantophill.jpeg',
      posterAnnouncement: '41st Mahana Sunni Deeni Nashisht Mehfil — In Sha Allah Monday, 16 November 2026 at Akbar Suleman Compound. Community gathering open to all devotees of Ahle Sunnah.',
      rsvpCount: 174,
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
      description: '40th Monthly Sunni Deeni Nashisht gathering held at Akbar Suleman Compound, Antophill. Total verified member collection of ₹18,241 successfully gathered from 39 contributors.',
      venue: 'Akbar Suleman Compound (Bada Maidan), Antophill, Wadala, Mumbai 400037',
      posterUrl: '',
      posterAnnouncement: '40th Mahana Sunni Deeni Nashisht Mehfil concluded with community prayers and Ulama guidance.',
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
      description: 'Monthly Management & Program Gathering. Program management expenses audited at ₹17,800 (Nazrana for Ulama, Madrasa Premises Rent, Niyaz / Tabarruk, Sound Setup, Social Media Handling, and Miscellaneous).',
      venue: 'Antophill, Wadala, Mumbai 400037',
      posterUrl: '',
      posterAnnouncement: 'September 2026 Mehfil accounts audited and verified.',
      rsvpCount: 154,
      createdAt: '2026-09-01T10:00:00Z'
    }
  ];

  // Authentic Seed Collections (39 Members, ₹18,241 Total, with Email, Phone & 4-digit PIN)
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

  // Authentic Seed Expenses (September Management Expenses: ₹17,800)
  const DEFAULT_EXPENSES = [
    { id: 'exp-01', itemNo: 1, title: 'Nazrana (Visiting Ulama & Mashaikh)', category: 'Nazrana', amount: 4000, programId: 'prog-sep-2026', paidTo: 'Hazrat / Ulama-e-Kiram', mode: 'Cash', date: '2026-09-21', voucherNo: 'VCH-SEP-001', notes: 'Nazrana honorarium for Sunni Deeni Nashisht speakers' },
    { id: 'exp-02', itemNo: 2, title: 'Madrasa Premises Hall Rent', category: 'Madrasa Rent', amount: 1000, programId: 'prog-sep-2026', paidTo: 'Madrasa Hall Committee', mode: 'Cash', date: '2026-09-21', voucherNo: 'VCH-SEP-002', notes: 'Seating, electricity and hall premises' },
    { id: 'exp-03', itemNo: 3, title: 'Langar-e-Raza / Niyaz & Tabarruk', category: 'Niyaz', amount: 5800, programId: 'prog-sep-2026', paidTo: 'Catering & Tabarruk Khidmat', mode: 'Cash', date: '2026-09-21', voucherNo: 'VCH-SEP-003', notes: 'Hot tabarruk meal packets for all attendees' },
    { id: 'exp-04', itemNo: 4, title: 'High-Clarity Sound System & Microphones', category: 'Sound', amount: 3000, programId: 'prog-sep-2026', paidTo: 'Antophill Sound Service', mode: 'Cash', date: '2026-09-21', voucherNo: 'VCH-SEP-004', notes: 'Acoustic audio setup with wireless microphones' },
    { id: 'exp-05', itemNo: 5, title: 'Digital Media & Live Streaming Setup', category: 'Social Media', amount: 3000, programId: 'prog-sep-2026', paidTo: 'Media Khidmat Team', mode: 'Bank UPI', date: '2026-09-21', voucherNo: 'VCH-SEP-005', notes: 'YouTube, Facebook, and Instagram reels setup' },
    { id: 'exp-06', itemNo: 6, title: 'Miscellaneous (Parchun Kharcha)', category: 'Parchun Kharcha', amount: 1000, programId: 'prog-sep-2026', paidTo: 'Local Market Antophill', mode: 'Cash', date: '2026-09-21', voucherNo: 'VCH-SEP-006', notes: 'Carpets, stage banners, mineral water, and supplies' }
  ];

  // Rich Media Library (Speeches, Bayanats, Reels, Naats)
  const DEFAULT_MEDIA = [
    {
      id: 'med-01',
      type: 'youtube',
      category: 'Bayanat',
      title: 'Haqeeqat-e-Maslak-e-Ala Hazrat & Sunni Aqeedah',
      speaker: 'Ulama-e-Ahle Sunnat Delegations',
      date: '2026-10-19',
      duration: '48:20',
      channel: '@jrmantophill-s8k',
      url: 'http://www.youtube.com/@jrmantophill-s8k',
      videoId: 'sample1',
      description: 'Delivered at Akbar Suleman Compound, Antophill, Wadala. Comprehensive explanation of Ahle Sunnah wal Jama\'ah principles and moral character.',
      keywords: 'ala hazrat bareilly sharif sunni aqeedah mahana mehfil'
    },
    {
      id: 'med-02',
      type: 'youtube',
      category: 'Bayanat',
      title: 'Seerat-e-Mustafa ﷺ & Shariah Responsibility of Youth',
      speaker: 'Hazrat Allama Maulana Mufti Sahab',
      date: '2026-09-21',
      duration: '35:14',
      channel: '@jrmantophill-s8k',
      url: 'http://www.youtube.com/@jrmantophill-s8k',
      videoId: 'sample2',
      description: 'Inspiring address on educating Sunni Muslim youth in modern Mumbai, fostering Islamic ethics, and serving the community.',
      keywords: 'seerat un nabi youth education shariah guidance'
    },
    {
      id: 'med-03',
      type: 'naat',
      category: 'Kalam-e-Raza',
      title: 'Kalam-e-Raza: "Chamak Tujhse Paate Hain Sab Paane Waale"',
      speaker: 'Naat Khawan Team — JRM Antophill',
      date: '2026-10-19',
      duration: '12:45',
      channel: '@jrmantophill-s8k',
      url: 'http://www.youtube.com/@jrmantophill-s8k',
      videoId: 'sample3',
      description: 'Soulful recitation of Aala Hazrat\'s celebrated Manqabat and Naat during the 40th Deeni Nashisht.',
      keywords: 'kalam e raza naat shareef hadaiq e bakhshish'
    },
    {
      id: 'med-04',
      type: 'reel',
      category: 'Reels & Shorts',
      title: 'Moments of Durood-o-Salam & Dua — Bada Maidan',
      speaker: 'JRM Antophill Khuddam',
      date: '2026-10-19',
      duration: '00:58',
      channel: '@jrmantophill',
      url: 'https://www.instagram.com/jrmantophill?igsh=a2dzNDYxb2VycW04',
      videoId: '',
      description: 'Spiritual glimpses of the concluding collective Dua at Akbar Suleman Compound, Antophill Wadala.',
      keywords: 'instagram reel short video dua durood antophill'
    },
    {
      id: 'med-05',
      type: 'reel',
      category: 'Reels & Shorts',
      title: 'Langar-e-Raza Tabarruk Preparation & Volunteer Seva',
      speaker: 'Khuddam-e-Millat Committee',
      date: '2026-09-21',
      duration: '00:45',
      channel: '@jrmantophill',
      url: 'https://www.instagram.com/jrmantophill?igsh=a2dzNDYxb2VycW04',
      videoId: '',
      description: 'Behind the scenes: Volunteers preparing food boxes for distribution to all attendees in Wadala.',
      keywords: 'langar niyaz khidmat volunteer antophill'
    },
    {
      id: 'med-06',
      type: 'youtube',
      category: 'Conference',
      title: 'Legacy of Huzoor Tajushshariah & Global Mission of JRM',
      speaker: 'Senior Scholars of Jamat Raza-E-Mustafa',
      date: '2026-08-25',
      duration: '52:10',
      channel: '@jrmantophill-s8k',
      url: 'http://www.youtube.com/@jrmantophill-s8k',
      videoId: 'sample6',
      description: 'Commemorating the international service of Huzoor Tajushshariah Allama Akhtar Raza Khan Azhari in India and worldwide.',
      keywords: 'tajushshariah azhari miyan bareilly conference'
    }
  ];

  const DEFAULT_LOGS = [
    { id: 'log-01', timestamp: '2026-10-19T10:15:00Z', istTime: '19-10-2026, 03:45:00 PM IST', user: 'Zain (Super Admin)', action: 'INIT', details: 'Initialized JRM Antophill Islamic Trust Database with 39 Member Records and November 41st Mehfil.' },
    { id: 'log-02', timestamp: '2026-10-19T11:00:00Z', istTime: '19-10-2026, 04:30:00 PM IST', user: 'Zain (Super Admin)', action: 'AUDIT_VERIFIED', details: 'Audited ₹18,241 total collections for October Sunni Deeni Nashisht.' },
    { id: 'log-03', timestamp: '2026-10-19T11:30:00Z', istTime: '19-10-2026, 05:00:00 PM IST', user: 'Zain (Super Admin)', action: 'EXPENSE_AUDITED', details: 'Verified September Expenses: Nazrana, Madrasa Rent, Niyaz, Sound, Social Media, Parchun Kharcha (Total ₹17,800).' }
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

    getPersonalities() {
      return DEFAULT_PERSONALITIES;
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

    // Committee Admin Auth (Zimmedaran)
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

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpPayload = {
        memberId: member.id,
        otp: otpCode,
        identifier: input,
        expiresAt: Date.now() + (10 * 60 * 1000)
      };
      Storage.set(STORAGE_KEYS.PENDING_OTP, otpPayload);

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
        return { success: false, error: 'No active OTP request. Please request a new code.' };
      }

      if (Date.now() > pending.expiresAt) {
        Storage.remove(STORAGE_KEYS.PENDING_OTP);
        return { success: false, error: 'OTP has expired. Please request a new code.' };
      }

      if (!enteredOtp || enteredOtp.trim() !== pending.otp) {
        return { success: false, error: 'Incorrect 6-digit OTP code.' };
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

    loginMemberWithPIN(identifier, pin) {
      if (!identifier || !pin) return { success: false, error: 'Please enter identifier and 4-digit PIN.' };
      const cleanId = identifier.trim().toLowerCase();
      const cleanPin = pin.trim();
      const all = this.getCollections();

      const match = all.find(c =>
        (c.phone && c.phone === cleanId) ||
        (c.email && c.email.toLowerCase() === cleanId) ||
        (c.token && c.token.toLowerCase() === cleanId) ||
        (c.name && c.name.toLowerCase() === cleanId)
      );

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

    // Media & Speeches Feed (With Search & Category Filter)
    getMediaItems(query = '', category = 'all') {
      let list = Storage.get(STORAGE_KEYS.MEDIA, DEFAULT_MEDIA);
      if (category && category !== 'all') {
        list = list.filter(m => m.category.toLowerCase() === category.toLowerCase());
      }
      if (query && query.trim()) {
        const q = query.toLowerCase().trim();
        list = list.filter(m =>
          (m.title && m.title.toLowerCase().includes(q)) ||
          (m.speaker && m.speaker.toLowerCase().includes(q)) ||
          (m.keywords && m.keywords.toLowerCase().includes(q)) ||
          (m.category && m.category.toLowerCase().includes(q))
        );
      }
      return list;
    },
    saveMediaItem(item) {
      const list = Storage.get(STORAGE_KEYS.MEDIA, DEFAULT_MEDIA);
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

    // Collections
    getCollections(programId = null) {
      const all = Storage.get(STORAGE_KEYS.COLLECTIONS, DEFAULT_COLLECTIONS);
      if (!programId) return all;
      return all.filter(c => c.programId === programId);
    },
    getCollectionById(id) {
      return this.getCollections().find(c => c.id === id) || null;
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
      const filtered = list.filter(e => e.id !== id);
      Storage.set(STORAGE_KEYS.EXPENSES, filtered);
      this.log('EXPENSE_DELETE', `Deleted expense: ${id}`);
      return true;
    },

    // Public Transparency Data (Zero Private Member Names)
    getPublicTransparency(programId = null) {
      const collections = this.getCollections(programId);
      let expenses = this.getExpenses(programId);
      if (!expenses || expenses.length === 0) expenses = this.getExpenses();

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
        istTime,
        user: currentUser,
        action,
        details
      };
      logs.push(entry);
      if (logs.length > 500) logs.shift();
      Storage.set(STORAGE_KEYS.LOGS, logs);
      return entry;
    },

    getMetrics() {
      const collections = this.getCollections();
      const expenses = this.getExpenses();
      const totalCollected = collections.reduce((acc, c) => acc + (Number(c.paid) || 0), 0);
      const totalPendingBalance = collections.reduce((acc, c) => acc + (Number(c.balance) || 0), 0);
      const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
      const netBalance = totalCollected - totalExpenses;
      const pendingCount = collections.filter(c => Number(c.balance) > 0).length;

      return {
        totalCollected,
        totalPendingBalance,
        totalExpenses,
        netBalance,
        totalMembers: collections.length,
        pendingCount
      };
    },

    exportCollectionsCSV() {
      const rows = this.getCollections();
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

    exportExpensesCSV() {
      const rows = this.getExpenses();
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
        version: '4.0.0',
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
