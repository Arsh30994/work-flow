"""
FastAPI entry point for SoulCare backend.
Sets up CORS, MongoDB, AI client, controllers/routes.
"""
from contextlib import asynccontextmanager
from pathlib import Path
import os

from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")
load_dotenv()

_gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if _gemini_key:
    genai.configure(api_key=_gemini_key)

DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() in ("1", "true", "yes")


@asynccontextmanager
async def lifespan(app: FastAPI):
    from .db.mongo import connect_mongo, close_mongo, is_mongo_ready
    from .seed import seed_if_empty

    await connect_mongo()
    app.state.mongo_ready = is_mongo_ready()
    if is_mongo_ready():
        await seed_if_empty()
    yield
    await close_mongo()


app = FastAPI(
    title="SoulCare API",
    description="A calmer place to talk, connect, and find support.",
    version="0.4.0",
    lifespan=lifespan,
)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed_origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
async def root():
    from .db.mongo import is_mongo_ready

    return {
        "status": "ok",
        "service": "SoulCare API",
        "version": "0.4.0",
        "demo_mode": DEMO_MODE,
        "database": "mongodb",
        "mongo_ready": is_mongo_ready(),
        "layers": ["models", "services", "controllers", "routes"],
    }


@app.get("/health", tags=["Health"])
async def health_check():
    from .db.mongo import is_mongo_ready

    return {
        "status": "healthy",
        "demo_mode": DEMO_MODE,
        "database": "mongodb",
        "mongo_ready": is_mongo_ready(),
    }


from .routes import (
    admin_router,
    auth_router,
    catalog_router,
    chat_router,
    pages_router,
    therapists_router,
)
from .websockets.admin_alerts import register_admin, unregister_admin

app.include_router(chat_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(therapists_router, prefix="/api/v1")
app.include_router(catalog_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(pages_router, prefix="/api/v1")


@app.websocket("/ws/admin")
async def admin_alerts_ws(ws: WebSocket):
    try:
        await register_admin(ws)
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        await unregister_admin(ws)
    except Exception:
        await unregister_admin(ws)
