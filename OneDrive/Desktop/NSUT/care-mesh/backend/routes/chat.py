from fastapi import APIRouter

from ..controllers import ChatController
from ..schemas import ChatRequest, ChatResponse

router = APIRouter(tags=["Chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    return await ChatController.handle_message(req)
