# 🛡️ RAKSHAK (रक्षक)
### *"Har Mushkil Mein, Aapke Saath."*

> **A Complete Indian Public Assistance, Civic Grievance, and Emergency-Support Platform**

---

## 🇮🇳 Vision & Brand
**RAKSHAK** is a unified public assistance platform built to serve citizens across all States and Union Territories of India. Designed specifically for stressful situations, RAKSHAK bridges the gap between citizens, emergency responders, and municipal civic bodies through accessible typography, dark navy and emergency-red aesthetics, Indian tricolor accents, voice reporting, and verified helplines.

- **Name:** RAKSHAK (रक्षक)
- **Tagline:** *"Har Mushkil Mein, Aapke Saath."* (हर मुश्किल में, आपके साथ।)
- **Language Support:** English, Hindi (हिंदी), and Hinglish with extensible regional localization.
- **Accessibility:** High Contrast Mode toggle, Dynamic Font Sizing (A / A+ / A++), and Family Assist workflows.

---

## 🌟 7 Unique Selling Propositions (USPs) Built & Functional

### 1. 🎙️ Bolkar Batao — Voice-Based Reporting
- **Voice-first UX:** Designed for citizens who struggle with typing or reading in stressful moments.
- **Multi-lingual NLP:** Users speak naturally in Hindi, English, or Hinglish (e.g., *"Mansarovar mein road par bada gaddha hai"*).
- **Auto-Extraction:** Automatically parses the speech transcript into category (`Potholes & Damaged Roads`), detected location (`Mansarovar`), and problem description with a single click.

### 2. 💡 Smart Complaint Assistant
- **Live Guidance:** Inspects problem descriptions in real-time as the citizen types.
- **Category Advice:** Suggests the correct municipal ward category if mismatched.
- **Completeness Checklist:** Evaluates whether descriptions (min 15 chars), street landmarks, photo evidence, and contact numbers are provided.
- **Quality Score Gauge:** Ranks report completeness from 0% to 100% before submission to ensure field engineers can locate the issue immediately.

### 3. 📵 Low-Network / Offline Mode
- **Zero-Data Resilience:** Keeps critical emergency contact numbers (112, 108, 101, 1091, 1912, 1033) cached locally in browser memory for direct cell dialing even without mobile data.
- **Local Storage Drafts:** Citizens can prepare draft reports without internet connectivity.
- **Pending Sync Status:** Displays a clear yellow `Pending Sync` status badge on offline reports with automatic and manual one-click sync to the backend once connectivity is restored.

### 4. 🗺️ Community Issue Map
- **Neighbourhood Clustering:** Groups multiple reports about the same pothole, overflowing bin, or open drain in a neighbourhood (e.g., Mansarovar & C-Scheme Jaipur, Connaught Place New Delhi, Bandra Mumbai) into a unified issue cluster.
- **Citizen Upvotes:** Citizens can click **"+1 I Also Face This Issue"** to demonstrate widespread community impact, helping municipal authorities allocate resources to the most urgent hotspots first.

### 5. 👨‍👩‍👧‍👦 Accessibility & Family Assist
- **Human-Centred Inclusion:** Instant toggles for **High Contrast Mode** and **Large Font Scales**.
- **Report for Someone Else:** Guided workflow enabling family members to file grievances on behalf of elderly parents, bedridden relatives, or differently-abled citizens, capturing beneficiary names, contact numbers, and special needs (e.g., wheelchair assistance).

### 6. ⚡ Smart Priority Queue (Admin Console)
- **Rule-Based Triage:** Automatically scores incoming complaints on a 0–100 urgency scale.
- **Hazard Elevation:** Automatically elevates live electrical hazards, active road collisions, and uncovered manholes (Scores: 85–100) above routine streetlight or sanitation complaints.
- **Operator Sorting:** Allows staff to sort the queue by priority score or chronological submission time.

### 7. 📸 Proof of Resolution
- **Public Trust & Accountability:** Goes beyond a simple green "Resolved" label.
- **Side-by-Side Visuals:** Displays authentic **Before & After photographs** on the public tracking page alongside official engineer resolution notes and timestamps (e.g., Ward 42 asphalt patch work on Mansarovar Madhyam Marg).

---

## 🚀 Key Functional Modules

1. **Home Dashboard (`/`):**
   - Prominent, pulsing Call 112 emergency button with confirmation safeguards.
   - Universal search bar supporting service categories, emergency numbers, and reference IDs (`RAK-2026-XXXXX`).
   - 6 Quick-Access Cards: Emergency Services, Civic Grievances, Accident Reports, Hospital Finder, Complaint Tracker, and RAKSHAK AI Assistant.
   - Live verified helpline ticker: 112 (Unified), 108 (Ambulance), 101 (Fire), 1091 (Women), 1098 (Childline), 1912 (Electricity), 1033 (NHAI).

2. **Emergency Guided Triage (`/emergency`):**
   - Rapid triage assessment for Medical, Fire, Collision, Active Crime, Women in Distress, and Natural Disaster.
   - CPR and first-aid protocols (cardiac arrest compressions, bleeding control, burn care).
   - Clear disclosure that RAKSHAK facilitates guidance without claiming emergency vehicles are dispatched until official 112 dial is placed.

3. **Verified Helpline Directory (`/directory`):**
   - 14 verified categories across India (Police, Medical, Fire, Traffic, Women Safety, Childline, Disaster NDRF, Highway Breakdown, Electricity Faults, Water Supply, Municipal Grievances, Animal Rescue, Mental Health Tele-MANAS, Cyber Crime 1930).
   - Sourced from Ministry of Home Affairs, Ministry of Health, NDMA, and State Departments.

4. **Civic Complaints (`/civic-report`):**
   - Multi-category support (Potholes, Streetlights, Garbage, Water Leaks, Blocked Drains, Open Manholes, Electricity Faults, Traffic Signals).
   - Bolkar Batao voice integration, GPS coordinate capture, photo attachments with preview/removal, and unique Reference ID generation (`RAK-2026-XXXXX`).

5. **Accident Reporting with Photos (`/accident-report`):**
   - Dedicated bystander witness flow with high-visibility Call 112 banner.
   - Bystander safety guidelines: *"Never put yourself in danger to take photographs."*
   - Injury indicator, pre-submission review modal, and Indian Good Samaritan Law (Motor Vehicles Act § 134A) legal protection notice.

6. **Ambulance & Hospital Finder (`/medical`):**
   - Verified apex trauma centers (AIIMS New Delhi, Safdarjung, SMS Hospital Jaipur, Jaipuria Hospital, KEM Mumbai, Victoria Bengaluru).
   - 24x7 Emergency Trauma Unit and Blood Bank verification indicators.
   - Direct casualty desk phone numbers and Ambulance 108/102 dispatch links.

7. **Complaint Tracking (`/track`):**
   - Live lookup by Reference ID.
   - 5-stage visual stepper: `Submitted` → `Under Review` → `Assigned` → `In Progress` → `Resolved`.
   - Distinct RAKSHAK Internal Status vs Official Government Action Status.
   - Proof of Resolution Before & After viewer and immutable audit history.

8. **Public Service & Government Directory (`/public-services`):**
   - Direct safe links to CPGRAMS, Swachhata-MoHUA, Parivahan Sewa, e-Hospital, UMANG, and DigiLocker with non-issuance disclaimers.

9. **Protected Admin Dashboard (`/admin`):**
   - Session authentication (`admin@rakshak.gov.in` / `RakshakAdmin@2026!`).
   - Smart Priority Queue with rule-based ranking.
   - Report management, municipal ward assignment, and Proof of Resolution photo uploader.
   - Aggregate analytics and immutable system audit trail.

10. **Floating RAKSHAK AI Chatbot:**
    - Accessible everywhere via floating widget.
    - Understands queries in English, Hindi, and Hinglish.
    - Quick actions: Pre-fills civic forms, guides accident reporting, and triggers immediate Call 112 actions.
    - Connects to Google Gemini API (`GEMINI_API_KEY`) with an intelligent scripted fallback.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 16 (Turbopack, App Router, React 19)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 with dark navy (`#070E1E`), emergency-red (`#DC2626`), and Indian tricolor accents
- **Icons:** `lucide-react`
- **Database:** Atomic, file-backed JSON store in `data/rakshak_store.json` with seed data, concurrent write locks, and priority calculation
- **Storage:** Local upload handler in `/api/upload` validating MIME types (JPEG, PNG, WebP) and 5MB size limits
- **Testing:** Node.js native test runner (`node --test tests/rakshak.test.mjs`)

---

## ⚙️ Setup & Running Locally

### 1. Prerequisites
- Node.js v18+ (tested on Node v24.16.0)
- npm v9+

### 2. Installation
```bash
git clone <repo-url>
cd RAKSHAK
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

| Variable | Description | Default / Requirement |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Optional: Google Gemini API key for AI Chatbot | If absent, uses built-in multi-lingual fallback |
| `ADMIN_SECRET` | Secret token for admin sessions | `rakshak_super_secret_admin_token_2026` |
| `NODE_ENV` | Application environment | `development` |
| `NEXT_PUBLIC_APP_URL` | Base application URL | `http://localhost:3000` |

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Running Automated Tests
```bash
npm test
```
Runs the 7 automated unit and integration tests verifying:
- Form validation & reference ID generation (`RAK-2026-XXXXX`)
- Upload MIME security & size restrictions
- Smart Priority Queue scoring algorithm
- Multi-lingual Chatbot natural language triggers
- Emergency helpline directory integrity
- Proof of Resolution Before & After validation
- Admin credential authentication

### 6. Running Production Build
```bash
npm run build
npm start
```

---

## 🔐 Admin Portal Credentials
To access the protected Administrative Console at `/admin`:
- **Email:** `admin@rakshak.gov.in`
- **Password:** `RakshakAdmin@2026!`

---

## ⚖️ Legal, Dispatch & Good Samaritan Disclaimers

1. **National Emergency Priority:** RAKSHAK prioritizes India's unified **112** helpline for all urgent emergencies. Never delay an emergency call to complete an online form.
2. **Honest Dispatch Disclosure:** RAKSHAK does not fabricate live GPS ambulance locations, countdown timers, or pretend that police or fire crews have been dispatched without official state PCR telephone confirmation.
3. **Good Samaritan Protection:** Under Section 134A of the Motor Vehicles (Amendment) Act 2019, citizens who provide assistance or report road accident victims are protected from civil or criminal liability and police harassment.
4. **Platform Independence:** RAKSHAK is a public assistance and citizen enablement platform. It does not replace the State Police, Municipal Corporations, or issue official government identity documents.
