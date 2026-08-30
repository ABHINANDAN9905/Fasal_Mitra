# 🌾 Fasal Mitra

### Smart Technology for Smarter Farming

> **Compare. Choose. Sell Smarter.**

Fasal Mitra is a farmer-centric digital platform designed to help farmers make **better crop-selling decisions** by bringing mandi discovery, agricultural market prices, location intelligence, logistics, weather information, and AI-powered agricultural assistance into a single easy-to-use platform.

Instead of forcing farmers to search through complex market datasets or depend entirely on middlemen for price information, Fasal Mitra transforms agricultural market information into a **simple, actionable decision-support experience**.

---

## 📌 Table of Contents

* [Problem Statement](#-problem-statement)
* [Our Solution](#-our-solution)
* [Key Features](#-key-features)
* [How Fasal Mitra Works](#-how-fasal-mitra-works)
* [System Architecture](#-system-architecture)
* [Application Workflow](#-application-workflow)
* [Data Flow](#-data-flow)
* [AI Architecture](#-ai-architecture)
* [Price Comparison Logic](#-price-comparison-logic)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Backend Architecture](#-backend-architecture)
* [Frontend Architecture](#-frontend-architecture)
* [API Modules](#-api-modules)
* [Environment Variables](#-environment-variables)
* [Installation & Setup](#-installation--setup)
* [Running the Project](#-running-the-project)
* [Production Build](#-production-build)
* [Example Use Case](#-example-use-case)
* [Why Fasal Mitra](#-why-fasal-mitra)
* [Future Scope](#-future-scope)
* [Team Algo X](#-team-algo-x)
* [Contributing](#-contributing)
* [License](#-license)
* [Acknowledgements](#-acknowledgements)

---

# 🚨 Problem Statement

Indian farmers often face a major challenge after producing their crops:

> **Where should I sell my crop to get a better return?**

Market prices can vary between different mandis. However, farmers may not have a simple way to compare:

* Different mandi prices
* Minimum, modal/average and maximum prices
* Mandi distance
* Market availability
* Transportation considerations
* Historical price information
* Weather conditions
* Potential selling returns

Government agricultural datasets can also be difficult for ordinary users to understand because they are often presented as large and complex datasets.

As a result, farmers may:

* Sell without knowing the best available price.
* Travel to a mandi without comparing alternatives.
* Depend heavily on intermediaries for market information.
* Lose potential income because of limited access to actionable information.

---

# 💡 Our Solution

## Fasal Mitra

Fasal Mitra converts complex agricultural market information into a **farmer-friendly decision-support platform**.

The core workflow is:

```text
👨‍🌾 Farmer
     ↓
🌾 Select Crop
     ↓
📍 Select / Detect Location
     ↓
🏪 Discover Nearby Mandis
     ↓
💰 Fetch Market Prices
     ↓
📊 Compare Prices
     ↓
📏 Consider Distance
     ↓
🚚 Consider Logistics
     ↓
🧮 Estimate Potential Return
     ↓
🏆 Make a Better Selling Decision
```

The platform is designed around one simple question:

> **"Where should I sell my crop?"**

---

# 🚀 Key Features

## 🌾 1. Smart Crop Selection

Farmers can select the crop they want to sell through an easy-to-use interface.

The system supports agricultural commodities through structured crop data.

Examples:

* Wheat
* Rice
* Onion
* Potato
* Tomato
* Pulses
* Oilseeds
* Fruits
* Vegetables
* Other agricultural commodities

---

## 🏪 2. Mandi Discovery

Fasal Mitra helps users discover relevant agricultural markets based on their selected location and crop.

Mandi information can include:

* Mandi name
* Location
* District
* State
* Distance
* Operational information
* Available market information

---

## 💰 3. Crop Price Comparison

The application compares agricultural market prices across different mandis.

Price information can include:

* Minimum price
* Modal / average price
* Maximum price
* Price per quintal
* Market/date information
* Price freshness

Example:

```text
             WHEAT PRICE COMPARISON

Mandi A       ₹2,100 / Quintal      8 km
Mandi B       ₹2,350 / Quintal     15 km ⭐
Mandi C       ₹2,200 / Quintal     25 km
```

This allows the farmer to quickly identify potentially better selling opportunities.

---

# 📍 4. Location Intelligence

Location plays an important role in agricultural selling decisions.

Fasal Mitra uses location information to help users understand:

```text
Farmer Location
       ↓
Nearby District
       ↓
Nearby Mandis
       ↓
Distance Comparison
```

The frontend includes location selection for:

* State
* District
* Location
* Mandi

---

# 🗺️ 5. Mandi Map

The platform provides a visual representation of mandi locations.

The map-based interface helps farmers understand:

* Where a mandi is located
* Relative distance
* Nearby markets
* Available selling options

---

# 📊 6. Price Analytics

Fasal Mitra includes price visualization components that make market information easier to understand.

The application provides:

* Price summaries
* Price comparison tables
* Price rankings
* Price charts
* Historical price information
* Price freshness indicators

Instead of only displaying raw numbers, the system presents information visually.

---

# 📈 7. Historical Price Analysis

The backend includes a dedicated historical-price service.

Historical data can help farmers understand:

* Previous market prices
* Price movement
* Market trends
* Changes over time

This creates a foundation for future price forecasting.

---

# 🧮 8. Net Return Calculation

Getting a higher mandi price does not always mean getting a higher final return.

Transportation and logistics costs can reduce the actual amount received by a farmer.

Fasal Mitra therefore includes a dedicated **net return calculation layer**.

Conceptually:

```text
Gross Selling Value
        -
Transportation / Logistics Cost
        =
Estimated Net Return
```

This moves the application beyond simple price comparison toward **real-world selling decisions**.

---

# 🚚 9. Logistics Support

The backend contains a dedicated logistics service and vehicle dataset.

This creates a foundation for considering:

* Transportation
* Vehicle options
* Distance
* Estimated logistics cost
* Selling economics

---

# 🌦️ 10. Weather Information

Weather-related functionality is integrated into the backend architecture.

Weather information can provide additional context for farmers when making agricultural decisions.

The backend contains:

```text
weatherController
weatherRoutes
weatherService
```

---

# 🤖 11. AI-Powered Agricultural Assistance

Fasal Mitra integrates Google's Gemini AI through the backend.

The AI layer is designed to support agricultural assistance such as crop-image analysis and natural-language interaction.

### Crop Disease Assistance

A farmer can provide a crop/leaf image.

The workflow is:

```text
Crop Leaf Image
       ↓
React Frontend
       ↓
Backend AI API
       ↓
Gemini AI Service
       ↓
AI Analysis
       ↓
Agricultural Recommendation
       ↓
Farmer
```

The system can provide advisory information such as:

* Possible crop disease
* Severity
* Suggested treatment
* Preventive measures

> AI-generated agricultural information should be treated as advisory and should be validated with qualified agricultural experts for important decisions.

---

# 🗣️ 12. Natural-Language Farmer Interaction

The project also includes a backend AI service designed to process natural-language farmer queries.

For example:

```text
"Mere paas 25 quintal onion hai.
Nashik mein kahan bechna better rahega?"
```

The system can identify important information such as:

```text
Crop       → Onion
Quantity   → 25 Quintal
Location   → Nashik
Intent      → Find better selling option
```

This creates the foundation for a more natural and accessible farmer experience.

---

# 🌐 13. Multilingual Architecture

Fasal Mitra includes a language context and translation structure in the frontend.

This allows the platform to be extended for regional Indian languages.

The goal is to reduce language barriers and make agricultural technology more accessible to farmers.

---

# 🧑‍💼 14. Merchant Portal

The application also contains a merchant-oriented workflow.

The architecture includes:

```text
Merchant Context
Merchant Services
Merchant Routes
Merchant Controller
Merchant Portal
```

This creates a foundation for connecting farmers with agricultural buyers and creating a broader agricultural marketplace ecosystem.

---

# 🏗️ System Architecture

Fasal Mitra follows a **modular client-server architecture**.

```text
                         👨‍🌾 FARMER
                             │
                             ▼
              ┌─────────────────────────┐
              │       FRONTEND          │
              │      React + Vite       │
              │                         │
              │  Crop Selection         │
              │  Location Selection     │
              │  Mandi Discovery        │
              │  Price Comparison       │
              │  Charts                 │
              │  Maps                   │
              │  Dashboard              │
              │  AI Interface           │
              └────────────┬────────────┘
                           │
                           │ HTTP / REST API
                           ▼
              ┌─────────────────────────┐
              │        BACKEND          │
              │    Node.js + Express    │
              │                         │
              │       Routes            │
              │          ↓              │
              │     Controllers         │
              │          ↓              │
              │       Services          │
              └────────────┬────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
 ┌────────────────┐ ┌──────────────┐ ┌───────────────┐
 │ Agmarknet /    │ │  Gemini AI   │ │ Local/Fallback│
 │ data.gov.in    │ │              │ │ Agricultural  │
 │ Market Data    │ │ AI Services  │ │ Data          │
 └────────────────┘ └──────────────┘ └───────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                  Processed Information
                           │
                           ▼
                    Farmer Dashboard
```

---

# 🔄 Application Workflow

A typical user journey looks like this:

```text
1. Farmer opens Fasal Mitra
              ↓
2. Selects crop
              ↓
3. Selects state/district/location
              ↓
4. System identifies relevant mandis
              ↓
5. Backend requests market information
              ↓
6. Market data is normalized
              ↓
7. Prices are compared
              ↓
8. Distance and logistics are considered
              ↓
9. Potential return is calculated
              ↓
10. Results are displayed visually
              ↓
11. Farmer chooses a suitable selling option
```

---

# 🔄 Data Flow

```text
┌──────────────┐
│ Farmer Input │
└──────┬───────┘
       ↓
┌────────────────────┐
│ React UI Components│
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Custom React Hooks │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Frontend Services  │
└─────────┬──────────┘
          ↓
     REST API
          ↓
┌────────────────────┐
│ Express Routes     │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Controllers        │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Business Services  │
└─────────┬──────────┘
          ↓
 ┌────────┼─────────┐
 ↓        ↓         ↓
Agmarknet Gemini   Local Data
 ↓        ↓         ↓
 └────────┼─────────┘
          ↓
   Data Normalization
          ↓
   Business Processing
          ↓
     JSON Response
          ↓
┌────────────────────┐
│ React Components   │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Farmer Dashboard   │
└────────────────────┘
```

---

# 🤖 AI Architecture

The AI subsystem follows a separate service-oriented flow.

```text
                 Farmer
                   │
          ┌────────┴────────┐
          │                 │
       Text Query        Leaf Image
          │                 │
          └────────┬────────┘
                   ↓
            React Frontend
                   ↓
              /api/ai
                   ↓
           AI Controller
                   ↓
          Gemini AI Service
                   ↓
            Gemini Model
                   ↓
         Structured Response
                   ↓
             Frontend UI
                   ↓
               Farmer
```

Keeping AI communication inside the backend prevents the frontend from directly managing sensitive AI configuration and keeps AI logic modular.

---

# 💰 Price Comparison Architecture

Market price processing follows:

```text
Government Market Data
          ↓
   Agmarknet Service
          ↓
    Price Service
          ↓
   Price Normalizer
          ↓
 Standardized Price Data
          ↓
 Price Ranking / Analysis
          ↓
     Frontend Display
```

The `priceNormalizer` utility helps standardize different price-data formats before they are presented to users.

---

# 🛠️ Technology Stack

## Frontend

| Technology            | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| **React 19**          | Interactive component-based UI                  |
| **Vite**              | Development server and production build tooling |
| **Tailwind CSS**      | Responsive styling                              |
| **Axios**             | HTTP/API communication                          |
| **Recharts**          | Price and analytics visualization               |
| **Lucide React**      | UI icons                                        |
| **React Hooks**       | Local state and reusable logic                  |
| **React Context API** | Shared application state                        |

---

## Backend

| Technology                   | Purpose                         |
| ---------------------------- | ------------------------------- |
| **Node.js**                  | Backend runtime                 |
| **Express.js**               | REST API framework              |
| **Axios**                    | External API communication      |
| **Google Generative AI SDK** | Gemini AI integration           |
| **Helmet**                   | HTTP security headers           |
| **CORS**                     | Cross-origin API access         |
| **Compression**              | Response compression            |
| **dotenv**                   | Environment configuration       |
| **Multer**                   | File/image upload handling      |
| **Zod**                      | Request/data validation         |
| **Nodemon**                  | Development server auto-restart |

---

# 📂 Project Structure

```text
Fasal_Mitra/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── aiController.js
│   │   │   ├── authController.js
│   │   │   ├── calculationController.js
│   │   │   ├── cropController.js
│   │   │   ├── locationController.js
│   │   │   ├── logisticsController.js
│   │   │   ├── mandiController.js
│   │   │   ├── merchantController.js
│   │   │   ├── notificationController.js
│   │   │   ├── priceController.js
│   │   │   └── weatherController.js
│   │   │
│   │   ├── data/
│   │   │   ├── cropsData.js
│   │   │   ├── locationData.js
│   │   │   ├── mandisData.js
│   │   │   └── vehiclesData.js
│   │   │
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── cropRoutes.js
│   │   │   ├── locationRoutes.js
│   │   │   ├── logisticsRoutes.js
│   │   │   ├── mandiRoutes.js
│   │   │   ├── merchantRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   ├── priceRoutes.js
│   │   │   ├── v1Router.js
│   │   │   └── weatherRoutes.js
│   │   │
│   │   ├── services/
│   │   │   ├── agmarknetService.js
│   │   │   ├── authService.js
│   │   │   ├── geminiAiService.js
│   │   │   ├── historicalPriceService.js
│   │   │   ├── logisticsService.js
│   │   │   ├── mandiService.js
│   │   │   ├── merchantService.js
│   │   │   ├── netReturnService.js
│   │   │   ├── notificationService.js
│   │   │   ├── priceService.js
│   │   │   └── weatherService.js
│   │   │
│   │   ├── utils/
│   │   │   └── priceNormalizer.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── logo.png
│   │   ├── logo.svg
│   │   └── favicon.png
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── analytics/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── crops/
│   │   │   ├── layout/
│   │   │   ├── location/
│   │   │   ├── mandis/
│   │   │   ├── map/
│   │   │   └── prices/
│   │   │
│   │   ├── constants/
│   │   │   ├── crop.js
│   │   │   ├── location.js
│   │   │   └── translation.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── LanguageContext.jsx
│   │   │   ├── MerchantContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useCrops.js
│   │   │   ├── useMandis.js
│   │   │   └── usePrices.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── MandiDetails.jsx
│   │   │   └── MerchantPortal.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── cropService.js
│   │   │   ├── locationService.js
│   │   │   ├── mandiService.js
│   │   │   ├── merchantService.js
│   │   │   ├── priceService.js
│   │   │   └── weatherService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── formatDistance.js
│   │   │   ├── formatPrice.js
│   │   │   └── priceUtils.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# 🧩 Backend Architecture

The backend follows a modular structure:

```text
                    Express Application
                           │
                           ▼
                       Routes
                           │
                           ▼
                      Controllers
                           │
                           ▼
                       Services
                           │
                           ▼
                   External / Local Data
```

### Routes

Routes define API endpoints.

Examples:

```text
/api/prices
/api/mandis
/api/crops
/api/locations
/api/ai
/api/weather
/api/logistics
/api/notifications
/api/auth
/api/merchant
```

### Controllers

Controllers receive requests and coordinate the required application logic.

### Services

Services contain domain-specific logic.

Examples:

```text
agmarknetService
priceService
mandiService
weatherService
logisticsService
geminiAiService
historicalPriceService
netReturnService
```

This separation makes the backend easier to maintain and extend.

---

# 🌐 API Modules

The backend exposes modular API groups.

| API Module                     | Purpose                            |
| ------------------------------ | ---------------------------------- |
| `/api/prices`                  | Crop market price operations       |
| `/api/mandis`                  | Mandi discovery and information    |
| `/api/crops`                   | Crop information                   |
| `/api/locations`               | Location-related operations        |
| `/api/states`                  | State information                  |
| `/api/states/:state/districts` | District lookup                    |
| `/api/ai`                      | AI-powered agricultural assistance |
| `/api/weather`                 | Weather functionality              |
| `/api/logistics`               | Transportation/logistics           |
| `/api/notifications`           | Notification functionality         |
| `/api/auth`                    | Authentication                     |
| `/api/merchant`                | Merchant functionality             |
| `/api/v1/*`                    | Versioned API architecture         |
| `/health`                      | Backend health check               |

---

# 🔐 Security & Performance

The backend includes several production-oriented middleware components.

### Helmet

Used to add security-related HTTP headers.

### CORS

Controls cross-origin communication between frontend and backend.

### Compression

Compresses HTTP responses to reduce transfer size.

### Environment Variables

Sensitive configuration is stored outside the source code using `.env`.

### Validation

Zod is included for structured request/data validation.

---

# ⚙️ Environment Variables

## Backend

Create:

```text
Backend/.env
```

Use the provided `.env.example` as a reference.

Typical configuration includes values for:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

AGMARKNET_API_KEY=your_api_key
GEMINI_API_KEY=your_gemini_api_key
```

> Never commit real API keys or secrets to GitHub.

---

## Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

# 📦 Installation & Setup

## Prerequisites

Make sure you have:

* Node.js
* npm
* Git
* Internet connection for external APIs
* Required API keys configured in `.env`

---

# 1️⃣ Clone the Repository

```bash
git clone https://github.com/ABHINANDAN9905/Fasal_Mitra.git
```

```bash
cd Fasal_Mitra
```

---

# 2️⃣ Install Backend Dependencies

```bash
cd Backend
npm install
```

---

# 3️⃣ Configure Backend Environment

Create:

```text
Backend/.env
```

Copy the required variables from:

```text
Backend/.env.example
```

Add your API credentials where required.

---

# 4️⃣ Start Backend

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

The backend runs on the configured port, typically:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/health
```

---

# 5️⃣ Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

# 6️⃣ Configure Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

# 7️⃣ Start Frontend

```bash
npm run dev
```

Vite will provide a local development URL, typically:

```text
http://localhost:5173
```

---

# 🏗️ Production Build

To create an optimized frontend production build:

```bash
cd frontend
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

# 🧪 Verification Checklist

Before a hackathon demo, verify:

```text
[x] Frontend starts successfully
[x] Backend starts successfully
[x] /health endpoint responds
[x] Frontend communicates with backend
[x] Crop selection works
[x] Location selection works
[x] Mandi discovery works
[x] Price comparison works
[x] Price cards render correctly
[x] Charts render correctly
[x] Mandi details open correctly
[x] AI functionality is configured
[x] Environment variables are configured
[x] Responsive layout works
```

---

# 🧑‍🌾 Example Use Case

### Scenario

A farmer has:

```text
Crop       → Onion
Quantity   → 25 Quintals
Location   → Nashik
```

The farmer opens Fasal Mitra.

### Step 1

Select:

```text
Onion
```

### Step 2

Select:

```text
Maharashtra
→ Nashik
```

### Step 3

Fasal Mitra discovers relevant mandis.

### Step 4

The backend retrieves/processes available market price information.

### Step 5

The application displays:

```text
Mandi A
Price: ₹X / Quintal
Distance: X km

Mandi B
Price: ₹Y / Quintal
Distance: X km ⭐

Mandi C
Price: ₹Z / Quintal
Distance: X km
```

### Step 6

The farmer can compare the options and consider the potential selling return.

This transforms:

> **Raw agricultural data**

into:

> **Actionable agricultural information.**

---

# 🏆 Why Fasal Mitra?

Fasal Mitra is not just another agricultural information dashboard.

The platform focuses on **decision support**.

### Traditional approach

```text
Farmer
  ↓
Search multiple sources
  ↓
Check prices manually
  ↓
Compare mandis manually
  ↓
Estimate travel cost
  ↓
Make decision
```

### Fasal Mitra approach

```text
Farmer
  ↓
Select Crop + Location
  ↓
Fasal Mitra
  ↓
Price + Mandi + Distance
  ↓
Logistics + Return
  ↓
Better Decision
```

---

# 📈 Future Scope

## 🤖 AI-Based Price Forecasting

Future versions can use historical price data and machine-learning models to forecast possible price trends.

```text
Historical Prices
       ↓
ML Model
       ↓
Price Forecast
       ↓
Selling Recommendation
```

---

## 🚚 Advanced Transportation Cost Estimation

Integrate:

* Fuel prices
* Vehicle capacity
* Distance
* Transportation rates
* Loading/unloading costs

to provide more accurate net-return estimates.

---

## 🔔 Price Alerts

Farmers could set a target:

```text
"Notify me when onion price
crosses ₹3,000/quintal."
```

Notifications could be delivered through:

* SMS
* WhatsApp
* Push notifications

---

## 🗣️ Multilingual Voice Assistant

Support voice-based farmer interaction in languages such as:

* Hindi
* Marathi
* Punjabi
* Bengali
* Telugu
* Tamil
* Kannada
* Gujarati

Example:

> "Mere paas 20 quintal gehun hai, sabse achha bhav kahan milega?"

---

## 📱 Progressive Web App

A PWA version could provide:

* Offline caching
* Low-bandwidth operation
* Mobile installation
* Better field usability

---

## 🔗 Broader Agricultural Ecosystem

Future integrations could include:

* Government agricultural services
* Farmer organizations
* Agricultural experts
* Transport providers
* Buyers and merchants
* Warehouses
* Cold storage
* Agricultural finance

---

# 👥 Team Algo X

| Team Member           | Role                                       |
| --------------------- | ------------------------------------------ |
| **Abhinandan Kumar**  | Lead Frontend Developer & System Architect |
| **Shashank Katiyar**  | Research & Problem Statement               |
| **Subrat Panigrahi**  | UI/UX Design & Frontend Development        |
| **Sumit Kumar Singh** | Documentation & Testing                    |

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

### 2. Create a feature branch

```bash
git checkout -b feature/AmazingFeature
```

### 3. Commit your changes

```bash
git commit -m "feat: add new mandi comparison feature"
```

### 4. Push the branch

```bash
git push origin feature/AmazingFeature
```

### 5. Open a Pull Request

Provide a clear description of the feature or improvement.

---

# 📜 License

This project is distributed under the MIT License.

See the `LICENSE` file for more information.

---

# 🙏 Acknowledgements

We would like to acknowledge:

* **Government agricultural open-data initiatives**
* **Agmarknet / data.gov.in** for agricultural market data
* **Google Gemini** for AI capabilities
* Open-source software and libraries used throughout the project
* Hackathon mentors and organizers
* Farmers of India, who inspired the problem we are solving

---

# 🌾 Our Vision

We believe technology should not make farming more complicated.

It should make decisions **simpler**.

Fasal Mitra aims to bridge the gap between:

```text
Agricultural Data
       ↓
Information
       ↓
Understanding
       ↓
Better Decision
       ↓
Better Farmer Opportunity
```

### **🌾 Fasal Mitra**

> **Compare. Choose. Sell Smarter.**

---

## ⭐ Built with ❤️ by Team Algo X
