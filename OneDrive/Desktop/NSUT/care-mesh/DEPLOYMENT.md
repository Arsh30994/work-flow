# Deployment Guide for Care Mesh

## Overview
This document outlines the steps to deploy the Care Mesh application – a Next.js frontend and a FastAPI backend – to **Vercel** (frontend) and **Render** (backend). It also lists all required environment variables and the configuration files added to the repository.

---
## 1. Frontend (Next.js) – Vercel

### Required Files
- **`frontend/vercel.json`** – rewrites WebSocket connections to the backend using the `BACKEND_URL` environment variable.

```json
{
  "rewrites": [
    {
      "source": "/ws/:path*",
      "destination": "${process.env.BACKEND_URL}/ws/:path*"
    }
  ]
}
```

### Environment Variables (set in Vercel dashboard)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | Base URL of the FastAPI backend (e.g., `https://care-mesh-backend.onrender.com`). Used by the client to call `/api/v1/chat` and the WebSocket endpoint. |
| `NEXT_PUBLIC_EMERGENCY_BANNER_TEXT` | Text displayed in the persistent emergency banner (e.g., *"If you are in crisis, call 112 or your local emergency services immediately."*). |
| `NEXT_PUBLIC_EMERGENCY_BANNER_COLOR` | Tailwind colour token for the banner (e.g., `bg-rose-100`). |

### Deployment Steps
1. Push the repository to GitHub (or another Git provider).
2. In Vercel, import the **`frontend`** directory as a new project.
3. Vercel automatically detects the Next.js framework and runs `npm install && npm run build`.
4. Add the environment variables listed above in the Vercel **Environment Variables** settings (choose *Preview* and *Production* as needed).
5. Deploy – Vercel will generate a URL like `https://care-mesh-frontend.vercel.app`.

---
## 2. Backend (FastAPI) – Render (or Railway)

### Required Files
- **`render.yaml`** – Render service definition for a Python web service.

```yaml
type: web
name: care-mesh-backend
env: python
plan: free
region: oregon
buildCommand: pip install -r requirements.txt
startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT

# Environment variables (set in Render dashboard)
# GEMINI_API_KEY - Google Gemini API key
# ALLOWED_ORIGINS - Comma‑separated list of allowed origins for CORS (e.g., https://care-mesh-frontend.vercel.app)
# BACKEND_URL - Full URL where this service is reachable (e.g., https://care-mesh-backend.onrender.com)
```

> **Note:** If you prefer Railway, create a `railway.toml` with a similar `[[services]]` block – the same `uvicorn` start command and environment variables apply.

### Environment Variables (set in Render dashboard)
| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key used by the AI service. |
| `ALLOWED_ORIGINS` | Allowed origins for CORS (frontend URL). |
| `BACKEND_URL` | Public URL of this service – required for the Vercel rewrite. |

### Deployment Steps (Render)
1. In Render, create a **New Web Service** and point it at the repository root (the `backend` folder).
2. Choose **Python** as the environment and let Render auto‑detect the `requirements.txt` file.
3. Set the **Build Command** to `pip install -r requirements.txt` and the **Start Command** to `uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. Add the environment variables listed above.
5. Deploy – Render will expose the service on a URL like `https://care-mesh-backend.onrender.com`.
6. Copy that URL into the Vercel `NEXT_PUBLIC_BACKEND_URL` and `BACKEND_URL` env vars.

---
## 3. .gitignore Audit
The repository already contains a comprehensive `.gitignore` covering:
- Node modules and Next.js build output (`node_modules/`, `.next/`, `out/`).
- Python virtual environments, caches, and compiled files (`venv/`, `__pycache__/`, `*.pyc`).
- Local `.env*` files (`.env.local`, `.env.development.local`, etc.).
- IDE/editor artefacts (`.idea/`, `.vscode/`).
No secret keys or `.env` files are committed. No further changes are required.

---
## 4. Final Checklist
- [x] `frontend/vercel.json` – WebSocket rewrite.
- [x] `render.yaml` – Render deployment config.
- [x] `DEPLOYMENT.md` – This documentation.
- [x] Verified `.gitignore` contains all typical secrets patterns.
- [x] Environment variables listed for both platforms.

When both services are live, the frontend will proxy WebSocket traffic to the backend via the rewrite rule, and the backend will accept requests from the frontend origin defined in `ALLOWED_ORIGINS`.

---
**Enjoy your deployment!** If you need Railway‑specific files or additional CI/CD hooks, just let me know.
