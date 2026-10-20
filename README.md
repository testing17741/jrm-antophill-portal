# Jamat Raza-e-Mustafa (JRM) Antophill, Mumbai — Deeni Mehfil & Fund Portal

Official responsive Progressive Web App (PWA) portal for **Jamat Raza-e-Mustafa Antophill, Mumbai** to manage Mahana Sunni Deeni Nashisht collections, management expenses, member personal ledger & statements ("Mera Hisab"), receipt verification, Call Book CRM for pending balances, and 1-tap separated WhatsApp broadcast messages.

- **Organization:** Jamat Raza-e-Mustafa Antophill Mumbai
- **Domain:** `jrmantophill.esitesz.com`
- **Agency & Engineering:** Developed by esitesz ([esitesz.com](https://esitesz.com))
- **Cost:** 100% Free-tier architecture (Zero hosting costs, zero monthly subscription, zero SMS gateway bills).
- **Timezone:** Indian Standard Time (IST / `Asia/Kolkata`) on all timestamps, receipts, and audit logs.

---

## Key Capabilities

### 1. Authentic Roles & Access
- **Admin (Zain & Committee Zimmedaran)**:
  - Secured by PIN (Default PIN: `7860`, customizable in settings).
  - Record member collections (Cash or Bank UPI/Transfer).
  - Log program management expenses (Nazrana, Madrasa Rent, Niyaz, Sound, Social Media Handling, Parchun Kharcha).
  - Manage upcoming and past Sunni Deeni Nashisht Mehfil programs.
  - Access Call Book CRM to track members with pending balances.
  - Audit trail with Indian Standard Time (IST) timestamps.
  - 2-Way Google Sheets sync, CSV export/import, and full JSON backup/restore.
- **Member Portal ("Mera Hisab" & Statements)**:
  - Member can select their name or enter their token/phone.
  - View individual payment history with exact dates.
  - View full transparency for the current month: total funds collected, spent, and itemized management expenses.
  - Download and print official digital receipts with verified stamp, amount in words, and authorized signatory placeholder.
- **Public View**:
  - Instant online verification of any contribution receipt token without passwords or SMS.

### 2. Timezone Standards (Indian Standard Time — IST)
- All timestamps, live clock headers, dates (`DD-MM-YYYY`), audit trails, and receipts use `Asia/Kolkata` (IST).
- Real-time IST clock in the program header.

### 3. Separated WhatsApp Broadcast Messages
- **1. Member Collection Message:** Full numbered list of members with paid amounts (`✅`) or pending balance (`❌`), total collections (`₹18,241`), and online verification link.
- **2. Program Management Expense Message:** Itemized breakdown of all management expenses (Nazrana, Madrasa rent, Niyaz, Sound, Social media, Parchun kharcha = `₹17,800`), total collections, and balance in hand.
- Each message has independent 1-tap **"Share on WhatsApp"** and **"Copy Message"** buttons.

### 4. Digital Verification (No Costly SMS Required)
- Every contribution generates an authentic cryptographic **Receipt Verification Token** (e.g. `JRM-2610-YUSUF`).
- Any member can verify records at `https://jrmantophill.esitesz.com/#verify/[TOKEN]`.
- 1-tap **Send WhatsApp Receipt** button generates a personalized message sent directly to the member's WhatsApp with their receipt details.

### 5. Call Book & CRM for Pending Balances
- Live board filtering members who have pending balances (`BAL > 0`).
- **1-Tap Call**: Quick `tel:...` shortcut for direct voice calls.
- **1-Tap WhatsApp Reminder**: Pre-formatted respectful balance reminder in Hindustani.
- **Quick Receive Payment**: Admin can record cleared payments with 1 tap.

### 6. Official Printable Receipts & Vouchers
- Includes JRM Antophill crest logo and official details.
- Auto-generates Indian English words for amounts (e.g. `₹500` -> *"Five Hundred Rupees Only"*).
- Verified digital record badge and IST timestamp.
- Print stylesheet (`@media print`) for clean A4 or receipt card printing/PDF saving.

---

## 100% Free Google Sheets Cloud Backend Setup

The portal works immediately offline with `localStorage`. To connect a live Google Sheet for shared cloud sync:

### Step 1 — Create the Google Sheet
1. Open [sheets.new](https://sheets.new) in your Google account.
2. Name it `JRM Antophill Database`.

### Step 2 — Paste Apps Script Code
1. Click **Extensions → Apps Script**.
2. Delete any existing code in `Code.gs`.
3. Open `apps-script/jrm-sheets-backend.gs` in this repository and copy the entire code.
4. Paste it into the Apps Script editor.
5. Save the project as `JRM Antophill Backend`.

### Step 3 — Run One-Time Setup
1. In the Apps Script function dropdown, select `setup`.
2. Click **Run**.
3. Authorize the permissions requested by Google.
4. This automatically creates the tabs:
   - `JRM_Collections` (Pre-seeded with all 39 members from prompt)
   - `JRM_Expenses` (Pre-seeded with September Nazrana, Niyaz, Rent, Sound, etc.)
   - `JRM_Programs` (October & September programs)
   - `JRM_Logs` (Audit trail in IST)

### Step 4 — Deploy as Web App
1. Click **Deploy → New deployment**.
2. Select type: **Web app**.
3. Set **Execute as**: `Me (your email)`.
4. Set **Who has access**: `Anyone`.
5. Click **Deploy** and copy your **Web App URL** (ends in `/exec`).

### Step 5 — Connect to Portal
1. Open the JRM Portal → Click **Admin** (enter PIN `7860`).
2. Go to the **Sheets Sync** tab.
3. Paste your Web App URL in the input field.
4. Click **Save Config** and then **Sync with Google Sheets**.

---

## Deployment Instructions

### Vercel
1. Push this repository to GitHub (`testing17741/jrm-antophill-portal`).
2. Import the project in Vercel.
3. Framework Preset: **Other** (Static HTML/CSS/JS).
4. Deploy!

### Netlify
1. Connect repository in Netlify.
2. Publish directory: `.` (root).
3. Deploy!

---

## License & Credits
- **Client:** Jamat Raza-e-Mustafa Antophill Mumbai
- **Design & Code:** Developed by [esitesz](https://esitesz.com)
