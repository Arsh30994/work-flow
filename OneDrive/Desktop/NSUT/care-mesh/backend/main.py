"""
FastAPI entry point for SoulCare backend.
Sets up CORS, loads environment variables, configures AI client,
and includes API routers.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import google.generativeai as genai

# Load .env variables
load_dotenv()

# Configure Gemini API — key from environment only (never hardcode)
_gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if _gemini_key:
    genai.configure(api_key=_gemini_key)

DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() in ("1", "true", "yes")

# Create FastAPI app
app = FastAPI(
    title="SoulCare API",
    description="A calmer place to talk, connect, and find support.",
    version="0.2.0",
)

# CORS – origins from ALLOWED_ORIGINS env var (comma‑separated)
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoints
@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "ok",
        "service": "SoulCare API",
        "version": "0.2.0",
        "demo_mode": DEMO_MODE,
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "demo_mode": DEMO_MODE}

# Include API routers
from .routes.chat import router as chat_router
from .routes.admin import router as admin_router

# Import admin WebSocket utilities
from .websockets.admin_alerts import register_admin, unregister_admin, broadcast_alert
app.include_router(chat_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")

# Placeholder imports for future routers
# from routes.triage import router as triage_router
# app.include_router(triage_router, prefix="/api/v1")

# WebSocket endpoint for admin alerts
from fastapi import WebSocket, WebSocketDisconnect

@app.websocket("/ws/admin")
async def admin_alerts_ws(ws: WebSocket):
    try:
        await register_admin(ws)
        while True:
            # Keep connection alive; wait for any client message (ping)
            await ws.receive_text()
    except WebSocketDisconnect:
        await unregister_admin(ws)
    except Exception:
        await unregister_admin(ws)
