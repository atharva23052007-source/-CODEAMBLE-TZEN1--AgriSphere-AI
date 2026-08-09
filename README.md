# 🌾 AgriSphere AI

### Unified Agricultural Platform

AgriSphere AI is an AI-powered unified agricultural platform designed to connect farmers, buyers/traders, NGOs/FPOs/operators, and administrators through a single digital ecosystem.

The platform combines agricultural advisory, AI assistance, multilingual interaction, voice-based assistance, agricultural services, and role-based workflows to make agricultural information and services more accessible.

---

## 🚜 Problem Statement

Agricultural decisions are often fragmented across different sources of information, services, markets, and financial resources.

Farmers may need timely guidance regarding:

- 🌱 Crops
- 🌾 Soil
- 💧 Irrigation
- 🐛 Pests
- 📈 Market prices
- 💰 Financial services
- 🏛️ Government schemes
- 🤝 Buyers and FPOs

At the same time, farmers, buyers, traders, NGOs, FPOs, and field operators often work through disconnected systems.

AgriSphere AI aims to bring these workflows together into one intelligent agricultural ecosystem.

---

## 💡 Solution

AgriSphere AI provides a role-based agricultural platform with AI-powered assistance.

### 👨‍🌾 Farmer

- AI agricultural assistance
- Crop-focused tools
- Agricultural services
- Multilingual interaction
- Voice-based AI assistance
- Market and agricultural information

### 🏢 NGO / FPO / Operator

- Agricultural assistance workflows
- Field and community support
- Operator-oriented tools
- Agricultural information management

### 🤝 Buyer / Trader

- Market-side workflows
- Buyer access
- Agricultural listings and information
- Connection with agricultural stakeholders

### 🛡️ Platform Admin

- Platform administration
- Role-aware access
- Platform oversight

---

# ✨ Key Features

## 🤖 AI Agricultural Assistant

Users can ask agricultural questions through text and receive practical, farmer-friendly AI-generated guidance.

The platform supports multilingual agricultural interaction.

## 🌐 Multilingual Support

The AI assistant supports:

- English
- Hindi
- Marathi

This helps make agricultural information more accessible to users from different language backgrounds.

## 🎙️ Voice AI

AgriSphere AI supports a voice-query workflow where users can upload or provide audio and receive AI-powered assistance.

The backend uses multimodal AI processing for voice-based interaction.

## 👥 Role-Based Portals

The application provides different experiences for:

- Farmer
- Buyer / Trader
- NGO / FPO / Operator
- Admin

Each role receives workflows relevant to its responsibilities.

## 🌾 Agricultural Services

Farmer-focused services are organized around practical agricultural decisions and support.

## 📊 Dashboard & Visualization

The platform uses charts and dashboard visualizations to present agricultural information in an accessible way.

---

# 🏗️ System Architecture

```text
                    ┌───────────────────────┐
                    │        Users          │
                    │                       │
                    │ Farmer                │
                    │ Buyer / Trader        │
                    │ NGO / FPO / Operator  │
                    │ Admin                 │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │     Web Application   │
                    │                       │
                    │ React 19              │
                    │ TypeScript            │
                    │ TanStack Start        │
                    │ TanStack Router       │
                    │ Vite                  │
                    │ Tailwind CSS          │
                    └───────────┬───────────┘
                                │
                                │ API Requests
                                ▼
                    ┌───────────────────────┐
                    │    Node / Express     │
                    │       Backend         │
                    │                       │
                    │ REST APIs             │
                    │ JSON Chat             │
                    │ Voice Upload          │
                    │ CORS                  │
                    │ Multer                │
                    └───────────┬───────────┘
                                │
                ┌───────────────┼────────────────┐
                │               │                │
                ▼               ▼                ▼
        ┌─────────────┐ ┌──────────────┐ ┌──────────────┐
        │ Gemini API  │ │   MongoDB    │ │    Redis     │
        │             │ │              │ │              │
        │ AI Text     │ │ Application  │ │ Caching /    │
        │ Voice AI    │ │ Data         │ │ Services     │
        └─────────────┘ └──────────────┘ └──────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- Vite
- Tailwind CSS 4

## UI & Components

- Radix UI
- Lucide React

## State Management & Forms

- TanStack React Query
- React Hook Form
- Zod

## Backend

- Node.js
- Express.js
- CORS
- Multer
- dotenv

## Artificial Intelligence

- Google Gemini API
- Multilingual text generation
- Multimodal / voice processing
- Fallback agricultural advisory engine

## Database & Services

- MongoDB
- Redis

## Data Visualization

- Recharts

---

# 📁 Project Structure

```text
agri-sphere-helper/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── routes/
│       ├── farmer/
│       ├── buyer/
│       ├── officer/
│       ├── operator/
│       ├── login/
│       └── ...
│
├── server/
│   ├── index.js
│   └── redis.js
│
├── .env
├── .env.example
├── package.json
├── package-lock.json
├── bun.lock
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# 🔌 API Endpoints

The backend provides API endpoints for AI and service communication.

### Health Check

```http
GET /health
```

### AI Chat

```http
POST /api/chat
```

### Voice AI

```http
POST /api/voice-ai
```

### Voice AI

```http
POST /voice-ai
```

The voice endpoints support the application's audio/voice AI workflow.

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
MONGODB_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key

HUGGINGFACE_TOKEN=your_huggingface_token

HF_TOKEN=your_huggingface_token

DATA_GOV_API_KEY=your_data_gov_api_key

REDIS_URL=your_redis_connection_url

PORT=5000
```

> ⚠️ Never commit your real API keys, tokens, passwords, or database credentials to GitHub.

---

# 💻 Local Installation

Clone the repository:

```bash
git clone https://github.com/atharva23052007-source/-CODEAMBLE-TZEN1--AgriSphere-AI.git
```

Navigate into the project:

```bash
cd -CODEAMBLE-TZEN1--AgriSphere-AI
```

Install dependencies:

```bash
npm install
```

---

# ▶️ Run the Frontend

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# ▶️ Run the Backend

The backend is located in:

```text
server/index.js
```

Start the backend with:

```bash
node server/index.js
```

The backend uses the configured `PORT` environment variable.

For local development:

```text
http://localhost:5000
```

---

# 🚀 Deployment

## Frontend – Vercel

The frontend can be deployed using Vercel.

### Build Command

```bash
vite build
```

### Output Directory

```text
dist
```

### Install Command

```bash
npm install
```

---

## Backend – Render

The backend can be deployed separately as a Render Web Service.

### Render Configuration

```text
Runtime:
Node

Branch:
main

Root Directory:
./

Build Command:
bun install

Start Command:
node server/index.js
```

The backend can then be accessed through the Render-provided URL.

Example:

```text
https://your-backend-name.onrender.com
```

---

# 🔗 Frontend & Backend Integration

After deploying the backend, the frontend should communicate with the deployed backend URL instead of the local backend.

Local:

```text
http://localhost:5000
```

Production:

```text
https://your-backend-name.onrender.com
```

The frontend and backend can therefore be deployed independently:

```text
                 Vercel
                   │
                   │
                   ▼
          ┌─────────────────┐
          │    Frontend     │
          │ React + Vite    │
          └────────┬────────┘
                   │
                   │ API Requests
                   ▼
          ┌─────────────────┐
          │     Render      │
          │ Node + Express  │
          └────────┬────────┘
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
       MongoDB   Redis    Gemini
```

---

# 🔐 Security

The following credentials must remain private:

- MongoDB connection string
- Gemini API key
- Hugging Face token
- Data.gov API key
- Redis connection URL

Do not expose these credentials in frontend code.

Use environment variables for production deployments.

---

# 🌍 Vision

AgriSphere AI aims to create a connected agricultural ecosystem where farmers and other agricultural stakeholders can access information, AI assistance, services, and market-oriented workflows through one platform.

### Accessible

Simple role-based workflows and multilingual interaction.

### Connected

One platform connecting farmers with the wider agricultural ecosystem.

### Intelligent

AI-powered text and voice assistance for agricultural use cases.

---

# 🎯 Demo Flow

A simple demonstration flow for the application:

```text
1. Choose a Role
       ↓
2. Open Farmer Portal
       ↓
3. Ask an Agricultural Question
       ↓
4. Switch Language / Use Voice
       ↓
5. Receive AI Response
       ↓
6. Explore Agricultural Services
```

---

# 👨‍💻 Project

**AgriSphere AI**

**Unified Agricultural Platform**

Repository:

```text
-CODEAMBLE-TZEN1--AgriSphere-AI
```

Built as an AI-powered agricultural ecosystem connecting farmers, agricultural organizations, buyers, traders, and platform administrators.

---

## ⭐ Project Highlights

- AI-powered agricultural assistance
- Multilingual interaction
- Voice AI
- Role-based portals
- Farmer-focused agricultural services
- Buyer / Trader workflows
- NGO / FPO / Operator workflows
- Admin functionality
- React + TypeScript frontend
- Node.js + Express backend
- Gemini AI integration
- MongoDB and Redis integration
- Vercel frontend deployment
- Render backend deployment
