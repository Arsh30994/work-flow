from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Literal

from ..services.ai_chat import get_ai_reply

router = APIRouter()

class ChatRequest(BaseModel):
    message: str = Field(..., description="User's chat message")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="AI's response")
    risk: Literal["green", "yellow", "red"] = Field(..., description="Risk level of the response")
    escalate: bool = Field(..., description="Whether to escalate to human support")

@router.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat_endpoint(req: ChatRequest):
    try:
        result = await get_ai_reply(req.message)
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
