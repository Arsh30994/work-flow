from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Literal
from ..dependencies.auth import admin_token_header

router = APIRouter()

# Simple in-memory store for session risk event history
# In a real app this would be persisted in a DB.
session_history: dict[str, List[dict]] = {}

class SessionHistoryResponse(BaseModel):
    session_id: str = Field(..., description="Session identifier")
    events: List[dict] = Field(..., description="List of risk events for the session")

class TakeOverResponse(BaseModel):
    session_id: str = Field(..., description="Session identifier")
    status: Literal["taken_over", "failed"] = Field(..., description="Result of takeover request")

@router.get("/admin/session/{session_id}", response_model=SessionHistoryResponse, dependencies=[Depends(admin_token_header)])
async def get_session_history(session_id: str):
    history = session_history.get(session_id, [])
    return SessionHistoryResponse(session_id=session_id, events=history)

@router.post("/admin/session/{session_id}/takeover", response_model=TakeOverResponse, dependencies=[Depends(admin_token_header)])
async def take_over_session(session_id: str):
    # Placeholder logic: mark session as manual mode.
    # Here we just record an event.
    event = {"action": "take_over", "timestamp": "now"}
    session_history.setdefault(session_id, []).append(event)
    return TakeOverResponse(session_id=session_id, status="taken_over")
