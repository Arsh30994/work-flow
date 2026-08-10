# SoulCare

> Formerly prototyped as Care Mesh — now rebranded as **SoulCare**: a calmer place to talk, connect, and find support.

## Problem Statement
India faces one of the world’s largest **mental‑health treatment gaps** –
- **≈ 150 million** adults experience a mental‑health condition.
- **70 %** of them never receive professional care (World Health Organization, 2022).
- Stigma, scarcity of counsellors, and geographic barriers exacerbate the crisis.

Our challenge is to prototype an **always‑on, privacy‑first digital companion** that can:
1. Provide a calm, validating listening experience.
2. Detect risk levels (green = low, yellow = moderate, red = crisis).
3. Offer immediate human handoff for high‑risk situations.
4. Deliver local resource suggestions in a multilingual Indian context.

---
## Solution Overview
**SoulCare** is a **Next.js + FastAPI** web app that couples a warm conversational front‑end with a lightweight risk‑triage backend.
- The user interacts via text or voice; guest mode is first-class (no forced signup).
- Messages are passed to the backend where `assess_risk()` classifies the tier using deterministic keyword lists (including Hinglish phrases) **before** any LLM call.
- **Green** → calm AI response (Gemini or MockAI in `DEMO_MODE`).<br>**Yellow** → AI response + counsellor / help nearby offer.<br>**Red** → **no LLM**; fixed human handoff + emergency access; admin dashboard can receive **real‑time alerts** via WebSocket.
- Persistent **emergency strip** with 112 and Tele-MANAS 14416.
- Demo therapists, resources, pharmacy, and medicines are clearly labelled as demo data.

---
## Architecture Diagram (description)
```
[User Browser]
   │   (HTTPS)
   ▼
[Next.js Frontend] ──► (REST) /api/v1/chat ──► [FastAPI Backend]
   │                               │
   │                               ├─► assess_risk (Python)
   │                               ├─► Gemini (AI) (green/yellow only)
   │                               └─► MongoDB (sessions, risk_events — no raw chat text)
   │
   └─► (WebSocket) /ws/:session_id ──► FastAPI WS endpoint
                               │
                               └─► admin_alerts WS (broadcast to admins)
```
- **Frontend**: Next.js (React, TypeScript), Tailwind CSS, Web Speech API.
- **Backend**: FastAPI, uvicorn, `google‑generativeai` SDK, MongoDB via Motor.
- **Deployment**: Vercel (frontend); Render (backend) with `render.yaml`.

---
## Tech Stack
| Layer | Technology |
|------|------------|
| Front‑end | Next.js (React 18), TypeScript, Tailwind CSS, Web Speech API |
| Back‑end | FastAPI, Python 3.11+, `google‑generativeai`, Motor |
| Database | **MongoDB** (privacy-by-design collections) |
| DevOps | Vercel (frontend), Render (backend), Docker (optional Mongo) |
| Testing | Pytest (backend) |

---
## Functional vs. Mocked / Roadmap
| Feature | Status |
|--------|--------|
| AI chat (green & yellow) | **Fully functional** – Gemini API returns short, calm replies. |
| Risk tier detection | **Fully functional** – deterministic keyword engine (incl. Hinglish). |
| Voice call (speech‑to‑text / text‑to‑speech) | **Fully functional** – browser APIs with fallback UI. |
| Emergency banner & resource card UI | **Fully functional** – static seeded resources. |
| Admin dashboard alert & “Take Over” button | **Functional UI**, but **human counsellor integration is mocked** (no real chat handoff). |
| Persistent session storage & risk event logging | **Functional** – MongoDB collections `sessions` / `risk_events` (no raw chat text). |
| Rate limiting | **Implemented** – simple in‑memory limiter (30 req/min). |
| Multi‑language support beyond Hindi/English | **Roadmap** – add language packs & translation layer. |
| Telehealth video call | **Roadmap** – integrate Twilio/Agora. |
| Production‑grade monitoring & alerting | **Roadmap** – Prometheus + Grafana. |

---
## Privacy & Safety Design Decisions
- **Privacy‑by‑Design DB** – MongoDB `sessions` and `risk_events` are separate; no raw user messages are stored.
- **Never store PHI** – only `session_id`, risk tier, and timestamps are logged.
- **Risk‑tier enforcement** – red‑tier never calls Gemini; a static handoff message is sent.
- **Emergency banner** – present on *every* page, providing local crisis numbers.
- **Rate limiting** – mitigates denial‑of‑service and abuse.
- **CORS** – whitelist origins via `ALLOWED_ORIGINS` env var.
- **Environment secrets** – all keys (`GEMINI_API_KEY`, DB credentials) are loaded from `.env*` files which are excluded by `.gitignore`.

---
## Local Setup Instructions
### Prerequisites
- **Node ≥ 20** (for the frontend)
- **Python ≥ 3.11** and **pip**
- **MongoDB** (local or [Atlas](https://www.mongodb.com/atlas)) — or Docker below
- **Google Gemini API key** – set as `GEMINI_API_KEY`

### 1. Clone the repo
```bash
git clone https://github.com/your-org/care-mesh.git
cd care-mesh
```

### 2. Set up the backend
```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Copy env template and fill in values
cp backend/.env.example backend/.env
# Edit backend/.env → set GEMINI_API_KEY, MONGODB_URI, ALLOWED_ORIGINS

# Run MongoDB (quick Docker command)
docker run --name soulcare-mongo -p 27017:27017 -d mongo:7

# Start the API server
uvicorn backend.main:app --reload --port 8000
```
The API will be available at `http://localhost:8000`.

### 3. Set up the frontend
```bash
cd frontend
npm install
# Copy env template
cp .env.local.example .env.local
# Set NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

npm run dev   # Starts at http://localhost:3000
```
Open the URL; you should see the homepage with the emergency banner.

### 4. Test the flow
1. Click **Start Chat** → give consent.
2. Type a *green* message (e.g., “I’m a bit stressed”).
3. Type a *yellow* message (e.g., “I feel lonely”).
4. Type a *red* message (e.g., “I want to end it”).
5. Open `http://localhost:3000/admin` (demo password: `admin123`) to see the real‑time red‑alert.
6. Try the **Voice Call** button – speak and watch the breathing circle.

---
## How to Run the Demo for Judges
1. Launch the backend (`uvicorn …`) and the frontend (`npm run dev`).
2. Use Chrome/Edge for SpeechRecognition support.
3. Follow the **3‑minute demo script** (see `DEMO_SCRIPT.md`) to showcase each risk tier, the admin alert, and the voice‑call flow.

---
## License
MIT – feel free to fork, extend, and deploy responsibly.

---
*Built with love at the NSUT Hackathon – aiming to close India’s mental‑health treatment gap, one calm conversation at a time.*
