"""Compatibility shim — prefer ``services.chat_service.ChatService``."""
from .chat_service import ChatService, get_ai_reply

__all__ = ["ChatService", "get_ai_reply"]
