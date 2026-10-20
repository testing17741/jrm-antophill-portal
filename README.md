# Jamat Raza-E-Mustafa (JRM) Antophill, Wadala, Mumbai — Official Organization & Deeni Portal

The official responsive Progressive Web App (PWA) and organizational website for **Jamat Raza-E-Mustafa (JRM) Antophill, Wadala, Mumbai**, operating under the spiritual guidance of **Huzoor Qaid-e-Millat Madda Zillahul Aali** and adhering to the creed of *Ahle Sunnah wal Jama'ah (Maslak-e-Ala Hazrat)*.

- **Organization:** Jamat Raza-E-Mustafa Antophill, Wadala, Mumbai
- **Heritage:** Branch of the international movement founded in 1920 in Bareilly Sharif by Ala Hazrat Imam Ahmed Raza Khan Fazil-e-Bareilvi (رضي الله عنه).
- **Headquarters:** Akbar Suleman Compound (Bada Maidan), Antophill, Wadala East, Mumbai 400037, Maharashtra, India.
- **Official Domain:** `jrmantophill.esitesz.com`
- **Official Email:** `jamatrazaemustafa313@gmail.com`
- **Helpline Contact:** `+91 85911 06632`
- **Engineering & Architecture:** Developed by esitesz ([esitesz.com](https://esitesz.com))
- **Cost:** 100% Free-tier architecture (Zero server maintenance fees, zero SMS gateway bills).
- **Timezone:** Indian Standard Time (IST / `Asia/Kolkata`) on all timestamps, receipts, countdowns, and audit logs.

---

## Core Capabilities & Features

### 1. Modern Institutional Website (English)
- **Home Page:**
  - Hero introduction to Jamat Raza-E-Mustafa's mission in Antophill, Wadala.
  - **Upcoming Program Spotlight:** Active promotion of the **(41) MAHANA SUNNI DEENI NASHISHT MEHFIL** scheduled for **Monday, 16 November 2026** at Akbar Suleman Compound, Antophill, Wadala.
  - **Live Dynamic Countdown Clock:** Real-time countdown (Days, Hours, Minutes, Seconds) to the next gathering in IST.
  - **RSVP & Attendance Confirmation:** Community members can confirm their attendance directly.
  - **Official Social & Bio Links Hub:** Verified 1-tap connection buttons:
    - 💬 WhatsApp Official Channel (`whatsapp.com/channel/0029VacNKL4DjiOgHMNQdp2j`)
    - 📷 Instagram Official (`instagram.com/jrmantophill`)
    - 📺 YouTube Official Channel (`youtube.com/@jrmantophill-s8k`)
    - 📘 Facebook Official (`facebook.com/share/19VizVNW9Q/`)
    - 📍 Google Maps Navigation (Akbar Suleman Compound, Antophill)
    - 📞 Direct Helpline & WhatsApp (`+91 85911 06632`)
- **About JRM Antophill:**
  - History of Jamat Raza-E-Mustafa (founded 1920 by Ala Hazrat Imam Ahmed Raza Khan Bareilvi).
  - Antophill Wadala Chapter: Establishment at Akbar Suleman Compound, Ulama guidance, and committee leadership under Zain.
  - Core Objectives: Preserving Ahl-e-Sunnat beliefs, organizing monthly deeni nashisht, youth education, and social welfare.
- **Media & Bayanats Feed:**
  - Curated speeches, Tilawat, Naat, and video highlights from `@jrmantophill-s8k` and `@jrmantophill` Instagram Reels.
  - Dynamic media engine allows committee administrators to link new video bayanats and clips.
- **Past Mehfils Archive:**
  - Historical records of previous gatherings (e.g. 40th and 39th Mehfils) with verified audited financial logs.
- **Public Financial Transparency:**
  - Audited breakdown of monthly management expenditures (Nazrana, Madrasa Rent, Niyaz / Tabarruk, Sound Setup, Social Media Broadcast, Miscellaneous).
  - Complete institutional accountability without exposing private member donation details or unpaids to the public.
- **Cryptographic Receipt Verification:**
  - Universal public search by Token (`JRM-XXXX-XXXX`) to verify authentic digital donation receipts.

### 2. Member Portal ("Mera Hisab") — Email / Mobile OTP Based
- **Modern OTP Authentication:**
  - Members enter their registered Email Address OR Mobile Number.
  - Generates an instant 6-digit verification OTP code.
  - Verifies session without costly third-party SMS gateway hurdles.
  - 4-digit PIN fallback option available.
- **Personal Contributor Ledger:**
  - View individual payment history with exact dates in Indian Standard Time (IST).
  - View cleared payments vs balance due.
  - Instant print / download of official donation receipt slips with verified digital stamp and words in INR.

### 3. Committee Admin Console (Zimmedaran)
- Secured by PIN (Default: `7860`).
- Record member collections (Cash or Bank UPI/Transfer).
- Log program management expenses with categories and voucher references.
- **Call Book CRM:** Live follow-up list for members with pending contributions (`BAL > 0`), equipped with 1-tap voice call and respectful WhatsApp reminders.
- **Separated WhatsApp Broadcast Reports:** Independent 1-click broadcast message formatters for Member Collections (`₹18,241`) and Management Expenses (`₹17,800`).
- **Program & Poster Manager:** Update the upcoming mehfil title, date, time, venue, announcement text, and upload or link new poster graphics.

### 4. Super Admin Console (Zain — Master Control)
- Secured by Master PIN (Default: `9999`).
- Change Super Admin Master PIN and Committee Admin PIN.
- **Member Credentials & OTP/PIN Directory:** View all members with registered phone numbers, email addresses, and 4-digit PINs; reset or update credentials.
- **Bio Links Editor:** Change WhatsApp, Instagram, YouTube, Facebook, Google Maps, and Helpline URLs.
- **Google Sheets Cloud Sync:** 2-way sync with free Google Sheets Apps Script backend.
- **Audit Trail (IST):** View real-time security log with Asia/Kolkata timestamps.
- **Database Backup & Factory Reset:** 1-click JSON backup and restore.

---

## 100% Free Google Sheets Cloud Backend Setup

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
- **Organization:** Jamat Raza-E-Mustafa Antophill, Wadala, Mumbai
- **Design & Code:** Developed by [esitesz](https://esitesz.com)
