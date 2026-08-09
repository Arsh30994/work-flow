from pydantic import BaseModel, Field
from typing import Literal

class ChatRequest(BaseModel):
    """User message sent to the AI chat endpoint."""
    message: str = Field(..., description="User's chat message")

class ChatResponse(BaseModel):
    """Response returned by the AI chat service.
    
    - ``reply``: The generated reply text.
    - ``risk``: One of ``green``, ``yellow`` or ``red`` indicating the
      assessed risk level.
    - ``escalate``: Whether the conversation should be escalated to a
      human operator.
    """
    reply: str = Field(..., description="AI's response")
    risk: Literal["green", "yellow", "red"] = Field(
        ..., description="Risk level of the response"
    )
    escalate: bool = Field(..., description="Escalate to human support")
