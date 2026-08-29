# 🌾 Fasal Mitra (फसल मित्र)

> **Smart Technology for Smarter Farming**  
> *Compare. Choose. Sell Smarter.*

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 💡 Overview & Problem Statement

Smallholder farmers often struggle to obtain real-time, transparent market rates across regional agricultural mandis. Existing portals either overwhelm users with raw, unstructured tables or lack crucial location-based context (such as transit distance), forcing farmers to rely on middlemen or sell at suboptimal rates.

**Fasal Mitra** is a farmer-centric mandi discovery and crop price comparison platform designed around real-world agricultural decision-making. Instead of dumping raw data, it structures information into an actionable, location-aware workflow.

👨‍🌾 FARMER
│
▼
🌾 SELECT CROP
│
▼
📍 SELECT / DETECT LOCATION
│
▼
🏪 FIND MANDIS
│
▼
💰 GET PRICE DATA
│
▼
📊 COMPARE PRICES
│
▼
📏 CHECK DISTANCE
│
▼
🏆 BETTER OPTION


---

## 🎯 Objectives

1. **Simplify Crop Price Discovery:** Provide a visual, clean interface to explore daily market rates.
2. **Streamline Mandi Discovery:** Help farmers find all operational APMC mandis within their radius.
3. **Multi-Mandi Price Comparison:** Compare commodity prices side-by-side across multiple mandis.
4. **Location Context & Distance:** Factor in transit distance so farmers can evaluate logistics overhead.
5. **Farmer-Centric Accessibility:** Lightweight UI built for varied digital literacy and multi-language support.

---

## 🚀 Key Features

* **🌾 Intuitive Crop Selection:** Fast visual picker for grains, pulses, oilseeds, fruits, and vegetables.
* **🏪 Mandi Discovery Engine:** Lists local markets with operational status, distance, and daily arrivals.
* **💰 Real-Time Price Comparison:** Side-by-side price breakdowns (Min, Modal/Average, Max rates per quintal).
* **📍 Distance & Route Awareness:** Calculates distance from user coordinates to each candidate mandi.
* **🌐 Multilingual Architecture:** Extensible i18n localization support for regional Indian languages.
* **📱 Mobile-First Responsive Design:** Fully optimized across desktop, tablet, and low-end mobile devices.

---

## 📊 Price & Distance Comparison Model

       WHEAT (Gehu)
Mandi A (8 km)   ─── ₹2,100 / Quintal
Mandi B (15 km)  ─── ₹2,350 / Quintal  <-- Higher rate
Mandi C (25 km)  ─── ₹2,200 / Quintal


### Market Metrics Summary

| Mandi Name | Price / Quintal | Distance | Net Advantage Indicator |
| :--- | :--- | :--- | :--- |
| **Mandi A** | ₹2,100 | 8 km | Nearest location, lower base price |
| **Mandi B** | ₹2,350 | 15 km | **Highest return** (covers extra 7 km travel) |
| **Mandi C** | ₹2,200 | 25 km | Moderate rate, higher transit overhead |

---

## 🏗️ System Architecture

Fasal Mitra follows a modular, layered frontend architecture separating state management, business rules, and presentation:

┌─────────────────────────────────────────────┐
│                 USER LAYER                  │
│                  👨‍🌾 Farmer                 │
└──────────────────────┬──────────────────────┘
│
▼
┌─────────────────────────────────────────────┐
│              PRESENTATION LAYER             │
│              React Components               │
│ Navbar | Hero | Search | Cards | Dashboard  │
└──────────────────────┬──────────────────────┘
│
▼
┌─────────────────────────────────────────────┐
│                 PAGE LAYER                  │
│ Home | Dashboard | Mandi Details            │
└──────────────────────┬──────────────────────┘
│
▼
┌─────────────────────────────────────────────┐
│                LOGIC LAYER                  │
│ Custom Hooks | Context | Application Logic  │
└──────────────────────┬──────────────────────┘
│
▼
┌─────────────────────────────────────────────┐
│                SERVICE LAYER                │
│ Crop | Mandi | Price | Location Services    │
└──────────────────────┬──────────────────────┘
│
▼
┌─────────────────────────────────────────────┐
│                 DATA LAYER                  │
│ Market Data | Price Data | Location Data    │
└─────────────────────────────────────────────┘


### Data Flow

[User Input] ──► [React UI Component] ──► [Custom Hook] ──► [Service Layer]
│
[Farmer Display] ◄── [UI Render] ◄── [Processed Data] ◄──────────┘


---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | React.js (v18+) | Component-based interactive UI |
| **Tooling & Bundler** | Vite | Lightning-fast HMR and production builds |
| **Styling** | Tailwind CSS | Utility-first, responsive design system |
| **Routing** | React Router DOM | Client-side page and view routing |
| **Iconography** | Lucide React | Clean, lightweight SVG UI icons |
| **State & Context** | React Hooks & Context API | Application-wide language and filter state |

---

## 📂 Directory Structure

```text
Fasal_Mitra/
├── frontend/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/             # Static graphics and icons
│   │   ├── components/
│   │   │   ├── common/         # Buttons, Badges, Loaders, Navbar, Footer
│   │   │   ├── mandis/         # Mandi cards, lists, and detail views
│   │   │   ├── map/            # Location cards and distance indicators
│   │   │   └── prices/         # Price summary cards, comparison tables
│   │   ├── constants/          # Crop lists, fallback mandi datasets
│   │   ├── context/            # LanguageContext, LocationContext
│   │   ├── hooks/              # useCrops, useMandis, usePrices, useLocation
│   │   ├── pages/              # Home, Dashboard, MandiDetails, NotFound
│   │   ├── services/           # cropService, mandiService, priceService
│   │   ├── utils/              # Distance calculators, price formatters
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
⚙️ Installation & Local Setup
Prerequisites
Node.js (v16.x or higher recommended)

npm (v8.x or higher) or yarn / pnpm

Git

Step-by-Step Setup
Clone the repository:

Bash
git clone [https://github.com/ABHINANDAN9905/Fasal_Mitra.git](https://github.com/ABHINANDAN9905/Fasal_Mitra.git)
cd Fasal_Mitra
Navigate to the frontend directory:

Bash
cd frontend
Install project dependencies:

Bash
npm install
Configure Environment Variables:
Create a .env file in the frontend/ directory (referencing .env.example if available):

Code snippet
VITE_API_BASE_URL=http://localhost:5000/api
Start the local development server:

Bash
npm run dev
Open http://localhost:5173 (or the URL shown in your terminal) in your browser.

Create a Production Build:

Bash
npm run build
npm run preview
🧪 Verification & Demo Checklist
[x] Application compiles cleanly via npm run build without bundling errors.

[x] Dynamic crop selection updates filtered mandi lists.

[x] Geo-distance calculator outputs valid distances in kilometers.

[x] Price cards display Min, Max, and Modal values per Quintal.

[x] Language toggle context propagates across all active UI views.

[x] Responsive breakpoint check passed across Mobile (360px+), Tablet, and Desktop.

🔮 Future Roadmap
🤖 AI Price Prediction: Time-series ML models forecasting commodity rates 7–14 days in advance.

🚚 Transit Cost Estimator: Real-time net-profit calculator subtracting estimated diesel/trucking freight charges from gross mandi earnings.

🗣️ Multilingual Voice Interface: Speech-to-text queries supporting Hindi, Punjabi, Marathi, Bengali, and other regional languages.

🔔 Price Threshold Alerts: WhatsApp and SMS notifications when a target mandi crosses a designated sell price.

📲 Progressive Web App (PWA): Offline-first caching for regions with intermittent field connectivity.

👥 Team Algo X
Member	Role / Responsibilities	GitHub / Profile
Abhinandan Kumar	Lead Frontend Developer & System Architect	@ABHINANDAN9905
[Shashank Katiyar]	Research and problem statement 	@shashankkatiyar4444-ui
[Subrat Panigrahi]	UI/UX Design & Frontend Development	@Subu2006
[Sumit Kumar Singh]	Documentation & Testing	@Sumit1080
🤝 Contributing
Fork the repository.

Create your feature branch:

Bash
git checkout -b feature/AmazingFeature
Commit your changes:

Bash
git commit -m "feat: add mandi distance calculation caching"
Push to the branch:

Bash
git push origin feature/AmazingFeature
Open a Pull Request with a detailed overview of your improvements.

📜 License
Distributed under the MIT License. See LICENSE for details.

🙏 Acknowledgements
Data Sources: Open government data initiatives (data.gov.in / Agmarknet).

Community: Hackathon mentors, reviewers, and open-source library maintainers.

Farmers of India: The inspiration behind building accessible agritech solutions.
