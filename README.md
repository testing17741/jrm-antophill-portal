# Jamat Raza-e-Mustafa (JRM) Antophill, Mumbai — Deeni Mehfil & Fund Portal

Official responsive Progressive Web App (PWA) portal for **Jamat Raza-e-Mustafa Antophill, Mumbai** to manage Mahana Sunni Deeni Nashisht upcoming mehfil announcements, poster banners, verified receipts, and public fund transparency.

- **Organization:** Jamat Raza-e-Mustafa Antophill Mumbai
- **Domain:** `jrmantophill.esitesz.com`
- **Agency & Engineering:** Developed by esitesz ([esitesz.com](https://esitesz.com))
- **Cost:** 100% Free-tier architecture (Zero hosting costs, zero monthly subscription, zero SMS gateway bills).
- **Timezone:** Indian Standard Time (IST / `Asia/Kolkata`) on all timestamps, receipts, and audit logs.

---

## Multi-Tier Role Architecture & Privacy Standards

### 1. Public Portal (Guest / Community View)
Designed specifically to protect member privacy while providing community utility:
- **Upcoming Mehfil Poster & Announcement:** High-visibility banner, Gregorian and Islamic dates in IST, time, venue address, and description. (Editable in Admin Panel).
- **Official Bio Links:** 1-tap buttons for community connection:
  - 💬 WhatsApp Official Channel / Group
  - 📷 Instagram Official
  - 📺 YouTube Bayanats & Tilawat
  - 📍 Antophill Mehfil Venue (Google Maps)
  - 📞 Contact / Helpline
- **Monthly Fund Transparency:** Clear summary of program management expenses (Nazrana to Ulama, Madrasa Rent, Niyaz / Tabarruk, Sound Setup, Social Media Handling, Parchun Kharcha) and total funds received. **Zero individual member names, phone numbers, or unpaids are disclosed on the public view.**
- **Digital Receipt Verification Tool:** Allows any donor to enter their receipt token (e.g. `JRM-2610-YUSUF`) to verify an official record.

### 2. Member Access ("Mera Hisab" & Statements)
- **Enhanced Security Login:** Member must provide their **Registered Phone Number OR Receipt Token** PLUS their **4-digit Member PIN** (Default: `1234`). Random visitors cannot open another member's statement by merely picking a name.
- **Personal Ledger:**
  - View individual contribution history with exact IST timestamps.
  - View cleared payments vs balance due.
  - Download and print official digital receipts.
  - View that month's full program expense transparency.

### 3. Committee Admin (Zimmedaran)
- Secured by PIN (Default: `7860`).
- **Collections Management:** Add and edit member donations (Cash or Bank UPI/Transfer).
- **Expenses Register:** Log program management expenses with categories and vouchers.
- **Call Book CRM:** Follow up with members who have pending balances (`BAL > 0`) using 1-tap phone calls and respectful WhatsApp balance reminders.
- **Separated WhatsApp Broadcasts:** Independent 1-tap WhatsApp broadcast messages for Member Collections (`₹18,241`) and Management Expenses (`₹17,800`).
- **Poster & Program Manager:** Update the upcoming mehfil title, date, time, venue, announcement text, and upload or link the program poster.

### 4. Super Admin (Zain - Master Control)
- Secured by Master PIN (Default: `9999`).
- **Full System Access** plus:
  - **Security PIN Manager:** Change Super Admin Master PIN and Committee Admin PIN.
  - **Member Credentials & PIN Manager:** View all registered members and reset or update any member's phone number and 4-digit PIN.
  - **Bio Links Editor:** Change WhatsApp, Instagram, YouTube, Google Maps, and Helpline links.
  - **Google Sheets Cloud Integration:** 2-way cloud sync with free Google Sheets Apps Script.
  - **Audit Trail (IST):** View real-time security log with Asia/Kolkata timestamps.
  - **Database Backup & Restore:** 1-click JSON backup, restore, and factory reset.

---

## 100% Free Google Sheets Cloud Backend Setup

The portal works immediately offline with `localStorage`. To connect a live Google Sheet for shared cloud sync:

1. Open [sheets.new](https://sheets.new) in your Google account and name it `JRM Antophill Database`.
2. Click **Extensions → Apps Script**, delete existing code, and paste the code from [`apps-script/jrm-sheets-backend.gs`](apps-script/jrm-sheets-backend.gs).
3. Run the one-time `setup` function to generate tabs (`JRM_Collections`, `JRM_Expenses`, `JRM_Programs`, `JRM_Logs`).
4. Click **Deploy → New deployment → Web app** (Execute as: `Me`, Who has access: `Anyone`).
5. Copy your Web App URL, log into the portal as Super Admin (PIN: `9999`), navigate to **👑 Super Settings**, and paste the URL.

---

## Deployment Instructions

### Vercel
1. Push this repository to GitHub (`testing17741/jrm-antophill-portal`).
2. Import the project in Vercel. Framework Preset: **Other** (Static HTML/CSS/JS).
3. Deploy!

### Netlify
1. Connect repository in Netlify. Publish directory: `.` (root).
2. Deploy!

---

## License & Credits
- **Client:** Jamat Raza-e-Mustafa Antophill Mumbai
- **Design & Code:** Developed by [esitesz](https://esitesz.com)
