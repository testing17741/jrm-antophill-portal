/**
 * Jamat Raza-e-Mustafa (JRM) Antophill, Mumbai — Google Sheets Backend
 * 100% Free Cloud Database for JRM Antophill PWA Portal
 * Developed by esitesz (jrmantophill.esitesz.com)
 *
 * Instructions:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Extensions -> Apps Script -> Paste this code entirely
 * 3. Run setup() once to create tabs & seed initial data
 * 4. Deploy -> New Deployment -> Web App -> Execute as "Me", Who has access: "Anyone"
 * 5. Copy the Web App URL (ends in /exec) and paste into JRM Portal -> Settings -> Google Sheets URL
 */

const SCRIPT_PROP = PropertiesService.getScriptProperties();

// Tab names
const TABS = {
  COLLECTIONS: 'JRM_Collections',
  EXPENSES: 'JRM_Expenses',
  PROGRAMS: 'JRM_Programs',
  LOGS: 'JRM_Logs'
};

/**
 * Setup function: Creates all tabs, headers, styling, and seeds initial data
 */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Collections Tab
  let colSheet = ss.getSheetByName(TABS.COLLECTIONS);
  if (!colSheet) {
    colSheet = ss.insertSheet(TABS.COLLECTIONS);
  }
  colSheet.clear();
  colSheet.appendRow(['ID', 'Member No', 'Name', 'Phone', 'Program ID', 'Paid (INR)', 'Balance (INR)', 'Payment Mode', 'Status', 'Verification Token', 'Date', 'Notes', 'Created At']);
  formatHeaderRow(colSheet);

  // 2. Expenses Tab
  let expSheet = ss.getSheetByName(TABS.EXPENSES);
  if (!expSheet) {
    expSheet = ss.insertSheet(TABS.EXPENSES);
  }
  expSheet.clear();
  expSheet.appendRow(['ID', 'Item No', 'Expense Title', 'Category', 'Amount (INR)', 'Program ID', 'Paid To', 'Payment Mode', 'Date', 'Voucher No', 'Notes', 'Created At']);
  formatHeaderRow(expSheet);

  // 3. Programs Tab
  let progSheet = ss.getSheetByName(TABS.PROGRAMS);
  if (!progSheet) {
    progSheet = ss.insertSheet(TABS.PROGRAMS);
  }
  progSheet.clear();
  progSheet.appendRow(['Program ID', 'Title', 'Month', 'Year', 'Date', 'Day', 'Status', 'Target Collection (INR)', 'Description', 'Venue']);
  formatHeaderRow(progSheet);

  // 4. Audit Logs Tab
  let logSheet = ss.getSheetByName(TABS.LOGS);
  if (!logSheet) {
    logSheet = ss.insertSheet(TABS.LOGS);
  }
  logSheet.clear();
  logSheet.appendRow(['Log ID', 'Timestamp', 'User', 'Action', 'Details']);
  formatHeaderRow(logSheet);

  // Seed Initial Programs
  progSheet.appendRow(['prog-oct-2026', '(40) MAHANA SUNNI DEENI NASHISHT MEHFIL', 'October', 2026, '2026-10-19', 'Monday', 'active', 20000, 'Monthly Sunni Deeni Nashisht Program — Jamat Raza e Mustafa Antophill Mumbai', 'Antophill, Wadala East, Mumbai 400037']);
  progSheet.appendRow(['prog-sep-2026', 'MAAHANA SUNNI DEENI NASHIST PROGRAM (September)', 'September', 2026, '2026-09-21', 'Monday', 'completed', 18000, 'Monthly Management & Program Mehfil', 'Antophill, Wadala East, Mumbai 400037']);

  // Seed Initial Expenses (Prompt Data)
  const initialExpenses = [
    ['exp-01', 1, 'Nazrana (Ulama & Mashaikh)', 'Nazrana', 4000, 'prog-sep-2026', 'Hazrat / Ulama-e-Kiram', 'Cash', '2026-09-21', 'VCH-SEP-001', 'Nazrana for Sunni Deeni Nashisht Mehfil', new Date().toISOString()],
    ['exp-02', 2, 'Madrasa Rent', 'Madrasa Rent', 1000, 'prog-sep-2026', 'Madrasa Committee', 'Cash', '2026-09-21', 'VCH-SEP-002', 'Hall / Madrasa premises charges', new Date().toISOString()],
    ['exp-03', 3, 'Niyaz / Tabarruk', 'Niyaz', 5800, 'prog-sep-2026', 'Catering / Niyaz Khidmat', 'Cash', '2026-09-21', 'VCH-SEP-003', 'Tabarruk & Niyaz arrangements', new Date().toISOString()],
    ['exp-04', 4, 'Sound & Audio Setup', 'Sound', 3000, 'prog-sep-2026', 'Antophill Sound Service', 'Cash', '2026-09-21', 'VCH-SEP-004', 'High-clarity sound system', new Date().toISOString()],
    ['exp-05', 5, 'Social Media Handling & Media', 'Social Media', 3000, 'prog-sep-2026', 'Social Media Team', 'Bank UPI', '2026-09-21', 'VCH-SEP-005', 'Live stream & graphics', new Date().toISOString()],
    ['exp-06', 6, 'Parchun Kharcha (Miscellaneous)', 'Parchun Kharcha', 1000, 'prog-sep-2026', 'Local Market Antophill', 'Cash', '2026-09-21', 'VCH-SEP-006', 'Incidentals and water', new Date().toISOString()]
  ];
  initialExpenses.forEach(r => expSheet.appendRow(r));

  // Seed Initial Collections (Exact prompt records)
  const initialMembers = [
    ['col-01', 1, 'Sayed Yusuf', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-YUSUF', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-02', 2, 'Sayed jalaluddin', '', 'prog-oct-2026', 1000, 0, 'Bank UPI', 'paid', 'JRM-2610-JALAL', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-03', 3, 'Sayed altamash', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-ALTAMASH', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-04', 4, 'Sayed Asif', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-ASIF', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-05', 5, 'Sayed Arshad', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-ARSHAD', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-06', 6, 'Syed Abbas', '', 'prog-oct-2026', 500, 0, 'Bank UPI', 'paid', 'JRM-2610-ABBAS', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-07', 7, 'Dr Seyd Yasin Ahmad', '', 'prog-oct-2026', 1000, 0, 'Bank UPI', 'paid', 'JRM-2610-YASIN', '2026-10-19', 'Special Mehfil Fund', new Date().toISOString()],
    ['col-08', 8, 'Dr Abdul Karim', '', 'prog-oct-2026', 1000, 0, 'Bank UPI', 'paid', 'JRM-2610-KARIM', '2026-10-19', 'Special Mehfil Fund', new Date().toISOString()],
    ['col-09', 9, 'Salim Bhai Azhari', '', 'prog-oct-2026', 0, 2000, 'Pending', 'pending', 'JRM-2610-SALIM-AZ', '2026-10-19', 'Previous dues pending', new Date().toISOString()],
    ['col-10', 10, 'Salim Bhai Siraji', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-SALIM-SI', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-11', 11, 'Imtiyaz Bhai', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-IMTIYAZ', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-12', 12, 'Riyaz Bhai', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-RIYAZ', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-13', 13, 'Firoz Bhai Best', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-FIROZ', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-14', 14, 'Zuber Bhai', '', 'prog-oct-2026', 500, 0, 'Bank UPI', 'paid', 'JRM-2610-ZUBER', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-16', 16, 'Khalid Bhai', '', 'prog-oct-2026', 0, 500, 'Pending', 'pending', 'JRM-2610-KHALID', '2026-10-19', 'Pending balance', new Date().toISOString()],
    ['col-17', 17, 'Shahbaz Bhai', '', 'prog-oct-2026', 300, 0, 'Cash', 'paid', 'JRM-2610-SHAHBAZ', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-18', 18, 'Sahil Bhai', '', 'prog-oct-2026', 0, 500, 'Pending', 'pending', 'JRM-2610-SAHIL', '2026-10-19', 'Pending balance', new Date().toISOString()],
    ['col-19', 19, 'Afroz Razvi', '', 'prog-oct-2026', 0, 1100, 'Pending', 'pending', 'JRM-2610-AFROZ', '2026-10-19', 'Pending balance', new Date().toISOString()],
    ['col-20', 20, 'Abdul Gaffar', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-GAFFAR1', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-21', 21, 'Ammo Bhai', '', 'prog-oct-2026', 0, 500, 'Pending', 'pending', 'JRM-2610-AMMO', '2026-10-19', 'Pending balance', new Date().toISOString()],
    ['col-22', 22, 'Zainuddin Razvi', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-ZAINUDDIN', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-23', 23, 'Moshin Mansuri', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-MOSHIN-M', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-24', 24, 'Shoaib Razvi', '', 'prog-oct-2026', 300, 0, 'Cash', 'paid', 'JRM-2610-SHOAIB-R', '2026-10-19', 'Balance cleared', new Date().toISOString()],
    ['col-25', 25, 'Anzar Bhai Maidan', '', 'prog-oct-2026', 0, 500, 'Pending', 'pending', 'JRM-2610-ANZAR', '2026-10-19', 'Pending balance', new Date().toISOString()],
    ['col-26', 26, 'Asif Arab', '', 'prog-oct-2026', 1000, 0, 'Bank UPI', 'paid', 'JRM-2610-ASIF-ARAB', '2026-10-19', 'Balance cleared', new Date().toISOString()],
    ['col-27', 27, 'Rafiq Bhai', '', 'prog-oct-2026', 0, 500, 'Pending', 'pending', 'JRM-2610-RAFIQ', '2026-10-19', 'Pending balance', new Date().toISOString()],
    ['col-28', 28, 'Rahan Razvi', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-RAHAN', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-29', 29, 'Sameer Razvi', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-SAMEER', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-30', 30, 'Imran Bhai Maidan', '', 'prog-oct-2026', 1000, 0, 'Bank UPI', 'paid', 'JRM-2610-IMRAN', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-31', 31, 'Hussain Razvi', '', 'prog-oct-2026', 511, 0, 'Cash', 'paid', 'JRM-2610-HUSSAIN', '2026-10-19', 'Mehfil Niyaz Contribution', new Date().toISOString()],
    ['col-32', 32, 'Ahmed Bhai', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-AHMED', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-33', 33, 'Abdul Gaffar Bhai', '', 'prog-oct-2026', 1000, 0, 'Bank UPI', 'paid', 'JRM-2610-GAFFAR2', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-34', 34, 'Shoaib Bhai maidan', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-SHOAIB-M', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-35', 35, 'Afridi Razvi', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-AFRIDI', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-36', 36, 'Moshin Azhari', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-MOSHIN-A', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-37', 37, 'Naaim Bhai group', '', 'prog-oct-2026', 630, 0, 'Cash', 'paid', 'JRM-2610-NAAIM-GRP', '2026-10-19', 'Group fund cleared', new Date().toISOString()],
    ['col-38', 38, 'Mohd Azad Bhai', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-AZAD', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()],
    ['col-40', 40, 'Sajid bhai maidan', '', 'prog-oct-2026', 0, 0, 'Settled', 'paid', 'JRM-2610-SAJID', '2026-10-19', 'Balance settled 0', new Date().toISOString()],
    ['col-41', 41, 'Shadab Bhai maidan', '', 'prog-oct-2026', 500, 0, 'Cash', 'paid', 'JRM-2610-SHADAB', '2026-10-19', 'Monthly Mehfil Contribution', new Date().toISOString()]
  ];
  initialMembers.forEach(r => colSheet.appendRow(r));

  // Seed Log
  logSheet.appendRow(['log-01', new Date().toISOString(), 'System', 'SETUP', 'Initialized JRM Antophill Google Sheets database tabs and verified seed dataset.']);
}

function formatHeaderRow(sheet) {
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  header.setBackground('#0E3D22');
  header.setFontColor('#FFFFFF');
  header.setFontWeight('bold');
  sheet.setFrozenRows(1);
}

/**
 * Web App GET endpoint
 */
function doGet(e) {
  try {
    const params = e ? e.parameter : {};
    const action = params.action || 'get_all';
    const apiKey = params.apiKey || '';

    // Verify API Key if set in Script Properties
    const configuredKey = SCRIPT_PROP.getProperty('API_KEY');
    if (configuredKey && apiKey !== configuredKey) {
      return jsonResponse({ success: false, error: 'Unauthorized: Invalid API Key' }, 401);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'ping') {
      return jsonResponse({ success: true, message: 'JRM Antophill Sheets API Online', timestamp: new Date().toISOString() });
    }

    if (action === 'get_all') {
      const collections = readSheetData(ss.getSheetByName(TABS.COLLECTIONS));
      const expenses = readSheetData(ss.getSheetByName(TABS.EXPENSES));
      const programs = readSheetData(ss.getSheetByName(TABS.PROGRAMS));
      const logs = readSheetData(ss.getSheetByName(TABS.LOGS));

      return jsonResponse({
        success: true,
        data: {
          collections: collections,
          expenses: expenses,
          programs: programs,
          logs: logs.slice(-50)
        }
      });
    }

    if (action === 'get_collections') {
      const collections = readSheetData(ss.getSheetByName(TABS.COLLECTIONS));
      return jsonResponse({ success: true, data: collections });
    }

    if (action === 'get_expenses') {
      const expenses = readSheetData(ss.getSheetByName(TABS.EXPENSES));
      return jsonResponse({ success: true, data: expenses });
    }

    if (action === 'verify_token') {
      const token = (params.token || '').trim().toUpperCase();
      const collections = readSheetData(ss.getSheetByName(TABS.COLLECTIONS));
      const match = collections.find(c => String(c['Verification Token']).toUpperCase() === token);
      if (match) {
        return jsonResponse({ success: true, verified: true, record: match });
      }
      return jsonResponse({ success: true, verified: false, message: 'Receipt verification token not found in records.' });
    }

    return jsonResponse({ success: false, error: 'Unknown GET action: ' + action });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Web App POST endpoint
 */
function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        payload = e.parameter || {};
      }
    } else {
      payload = e.parameter || {};
    }

    const action = payload.action || 'sync_all';
    const apiKey = payload.apiKey || '';

    // Verify API Key if set
    const configuredKey = SCRIPT_PROP.getProperty('API_KEY');
    if (configuredKey && apiKey !== configuredKey) {
      return jsonResponse({ success: false, error: 'Unauthorized: Invalid API Key' }, 401);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Sync All collections and expenses from client
    if (action === 'sync_all') {
      if (payload.collections && Array.isArray(payload.collections)) {
        writeCollectionsSheet(ss.getSheetByName(TABS.COLLECTIONS), payload.collections);
      }
      if (payload.expenses && Array.isArray(payload.expenses)) {
        writeExpensesSheet(ss.getSheetByName(TABS.EXPENSES), payload.expenses);
      }
      if (payload.programs && Array.isArray(payload.programs)) {
        writeProgramsSheet(ss.getSheetByName(TABS.PROGRAMS), payload.programs);
      }

      // Append log
      const logSheet = ss.getSheetByName(TABS.LOGS);
      if (logSheet) {
        logSheet.appendRow(['log-' + Date.now(), new Date().toISOString(), payload.user || 'Admin', 'SYNC_ALL', 'Full 2-way sync performed from JRM Portal.']);
      }

      return jsonResponse({ success: true, message: 'Google Sheets sync completed successfully.' });
    }

    // 2. Add single collection
    if (action === 'add_collection') {
      const colSheet = ss.getSheetByName(TABS.COLLECTIONS);
      const c = payload.entry || payload;
      colSheet.appendRow([
        c.id || ('col-' + Date.now()),
        c.memberNo || (colSheet.getLastRow()),
        c.name || 'Anonymous',
        c.phone || '',
        c.programId || 'prog-oct-2026',
        Number(c.paid) || 0,
        Number(c.balance) || 0,
        c.mode || 'Cash',
        c.status || 'paid',
        c.token || ('JRM-' + Date.now().toString().slice(-6)),
        c.date || new Date().toISOString().split('T')[0],
        c.notes || '',
        new Date().toISOString()
      ]);
      return jsonResponse({ success: true, message: 'Collection entry added to Google Sheet.' });
    }

    // 3. Add single expense
    if (action === 'add_expense') {
      const expSheet = ss.getSheetByName(TABS.EXPENSES);
      const ex = payload.entry || payload;
      expSheet.appendRow([
        ex.id || ('exp-' + Date.now()),
        ex.itemNo || (expSheet.getLastRow()),
        ex.title || 'Expense',
        ex.category || 'Parchun Kharcha',
        Number(ex.amount) || 0,
        ex.programId || 'prog-sep-2026',
        ex.paidTo || '',
        ex.mode || 'Cash',
        ex.date || new Date().toISOString().split('T')[0],
        ex.voucherNo || ('VCH-' + Date.now().toString().slice(-4)),
        ex.notes || '',
        new Date().toISOString()
      ]);
      return jsonResponse({ success: true, message: 'Expense entry added to Google Sheet.' });
    }

    return jsonResponse({ success: false, error: 'Unknown POST action: ' + action });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

// Helpers
function readSheetData(sheet) {
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = data[i][j];
    }
    rows.push(row);
  }
  return rows;
}

function writeCollectionsSheet(sheet, collections) {
  if (!sheet) return;
  sheet.clear();
  sheet.appendRow(['ID', 'Member No', 'Name', 'Phone', 'Program ID', 'Paid (INR)', 'Balance (INR)', 'Payment Mode', 'Status', 'Verification Token', 'Date', 'Notes', 'Created At']);
  formatHeaderRow(sheet);
  collections.forEach(c => {
    sheet.appendRow([
      c.id || '',
      c.memberNo || '',
      c.name || '',
      c.phone || '',
      c.programId || '',
      Number(c.paid) || 0,
      Number(c.balance) || 0,
      c.mode || 'Cash',
      c.status || 'paid',
      c.token || '',
      c.date || '',
      c.notes || '',
      new Date().toISOString()
    ]);
  });
}

function writeExpensesSheet(sheet, expenses) {
  if (!sheet) return;
  sheet.clear();
  sheet.appendRow(['ID', 'Item No', 'Expense Title', 'Category', 'Amount (INR)', 'Program ID', 'Paid To', 'Payment Mode', 'Date', 'Voucher No', 'Notes', 'Created At']);
  formatHeaderRow(sheet);
  expenses.forEach(e => {
    sheet.appendRow([
      e.id || '',
      e.itemNo || '',
      e.title || '',
      e.category || '',
      Number(e.amount) || 0,
      e.programId || '',
      e.paidTo || '',
      e.mode || 'Cash',
      e.date || '',
      e.voucherNo || '',
      e.notes || '',
      new Date().toISOString()
    ]);
  });
}

function writeProgramsSheet(sheet, programs) {
  if (!sheet) return;
  sheet.clear();
  sheet.appendRow(['Program ID', 'Title', 'Month', 'Year', 'Date', 'Day', 'Status', 'Target Collection (INR)', 'Description', 'Venue']);
  formatHeaderRow(sheet);
  programs.forEach(p => {
    sheet.appendRow([
      p.id || '',
      p.title || '',
      p.month || '',
      p.year || '',
      p.date || '',
      p.day || '',
      p.status || '',
      Number(p.targetCollection) || 0,
      p.description || '',
      p.venue || ''
    ]);
  });
}

function jsonResponse(data, status = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
