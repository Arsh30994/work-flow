# FlowGuide

Conversational workflow-builder prototype in this `work-flow` repo.

The runnable app at the repository root is **FlowGuide**, not SoulCare. It is a single-page React UI plus a FastAPI API that stores workflows, mock connections, settings, and run logs in SQLite. You can compose a linear pipeline on a canvas, save it, instantiate a template, and trigger a **simulated** run. “The Guide” copilot is keyword matching, not an LLM. Slack, Gmail, Shopify, and the other connection cards only change status in the database.

## What the app does

The UI (`src/App.jsx`) is one page with six tabs and a docked Guide sidebar:

| Surface | Behavior |
|---|---|
| **Dashboard** | Lists saved workflows from `/api/workflows`, shows active/paused counts, and a static weekly chart (not computed from run history). |
| **Builder** | Sequential canvas: drag or click steps (Email Trigger, Webhook, Gemini AI Agent, Condition, Slack Notify, SQLite Record). Save creates or updates a workflow. Run queues a simulated execution. |
| **Connections** | Seeded cards for Slack, Gmail, Shopify, Notion, Airtable, HubSpot. Toggle and “reconnect” update SQLite status. The API key field is accepted and not stored or used. |
| **Templates** | In-memory recipes (Social Media Assistant, Smart Invoice Handler, Email Summarizer, Meeting Notes Pro). “Use Template” copies nodes into a new paused workflow and opens the builder. |
| **History** | Simulated run logs with per-step status, latency, and messages. |
| **Settings** | Profile name, email, timezone, notification flags, and optional avatar (data URL). Persisted in SQLite. |
| **The Guide** | Sidebar chat. Phrases such as “add a slack node” or “clear canvas” return `ADD_NODE` / `CLEAR_CANVAS` actions that mutate the builder. Other messages get a canned reply. |

Workflow **run** is a FastAPI background task: it walks the saved nodes, assigns random step durations, fails about 8% of runs, and writes an `activity_logs` row. No third-party APIs are called.

On first API startup, if settings are empty, the backend seeds demo profile “Alex Rivers”, two workflows, six connections, and three history rows.

## Stack

| Layer | Tools |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS (PostCSS), Oxlint |
| Backend | FastAPI 0.111, Uvicorn, SQLAlchemy 2, Pydantic 2 |
| Data | SQLite file `flowguide.db` at the repo root |
| Dev proxy | Vite forwards `/api` to `http://localhost:8000` |

No auth, tests, or CI are configured for this app.

## Requirements

- Node.js with npm (for the Vite app)
- Python 3.10+ (the Windows launcher checks for 3.10+)

## Setup (repo root)

The working layout is **flat**: frontend files and the `app/` Python package live at the repository root.

```bash
# API
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# UI (second terminal)
npm install
npm run dev
```

Open the Vite URL (typically `http://localhost:5173`). The UI calls `/api/...`; Vite proxies those to port 8000.

`run.py` starts the same Uvicorn app. On Windows it prefers `venv\Scripts\python.exe` if that path exists, otherwise `python`.

### npm scripts

| Script | Command |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production bundle |
| `npm run preview` | Preview the production build |
| `npm run lint` | Oxlint |

### Windows launcher

`run_flowguide.bat` expects a `backend/` + `frontend/` split (`cd backend`, `cd frontend`). That matches `flowguide_fullstack/`, not this root layout. Use the commands above from the repo root, or run the bat from `flowguide_fullstack/`.

## Project structure

```
app/                 FastAPI package
  main.py            Routes, simulated runner, keyword Guide
  models.py          Workflow, Connection, ActivityLog, Settings
  schemas.py         Pydantic request/response models
  database.py        SQLite engine (flowguide.db)
  seed.py            Demo data on first empty settings row
src/
  App.jsx            Entire UI
  main.jsx           React entry
  index.css          Tailwind + theme
index.html
vite.config.js       /api → localhost:8000
package.json
requirements.txt
run.py
```

## HTTP API

All routes are under `/api`. CORS allows any origin.

| Method | Path | Notes |
|---|---|---|
| GET, POST | `/api/workflows` | List / create. Body: `name`, `status`, `nodes` |
| PUT, DELETE | `/api/workflows/{id}` | Partial update (also used to toggle Active/Paused) |
| POST | `/api/workflows/{id}/run` | Queue simulated run; returns immediately |
| GET | `/api/connections` | Seeded integrations |
| POST | `/api/connections/{id}/toggle` | Connected ↔ Disconnected |
| POST | `/api/connections/{id}/reconnect` | Sets Connected; `api_key` unused |
| GET, PUT | `/api/settings` | Single settings row |
| GET, DELETE | `/api/history` | Run logs; DELETE clears all |
| GET | `/api/templates` | Hardcoded template list |
| POST | `/api/templates/{id}/instantiate` | Create paused workflow from template |
| POST | `/api/chat` | Keyword Guide. Optional `canvas_nodes` is unused |

Interactive docs: `http://localhost:8000/docs` once the API is running.

## Other trees in this repository

The default branch also contains copies and unrelated projects. They are not required to run the root app:

- `flowguide_fullstack/` — same FlowGuide split into `frontend/` and `backend/`, plus Stitch HTML mockups and `run_flowguide.bat`
- `Downloads/stitch/` — another FlowGuide copy (includes a committed Windows venv)
- `OneDrive/Desktop/NSUT/care-mesh/` — **SoulCare** (formerly Care Mesh): a separate Next.js + FastAPI mental-health companion prototype. See that folder’s README.
- Many committed Python site-packages and `__pycache__` files at the repo root from local installs

Documented app source of truth for this README is `main`. The previous default branch `cursor/soulcare-platform` still exists and does not include these docs until it is updated.
