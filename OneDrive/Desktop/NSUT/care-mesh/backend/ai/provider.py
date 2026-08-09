"""AI provider abstraction for SoulCare."""
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Optional
import os
import random


class AIProvider(ABC):
    @abstractmethod
    async def generate_response(self, message: str, *, risk: str = "green") -> str:
        raise NotImplementedError


class MockAIProvider(AIProvider):
    """Deterministic-ish calm replies for DEMO_MODE / missing API keys."""

    _REPLIES = [
        "Thank you for sharing that. I'm here with you — what feels most present right now?",
        "That sounds like a lot to carry. We can go slowly. What would help in this moment?",
        "I'm listening. There's no rush to have the perfect words.",
        "It makes sense that you'd feel this way. Would you like a grounding idea, or just space to talk?",
    ]
    _YELLOW = [
        "That sounds really heavy. I'm here with you. Would talking to a real person help right now?",
        "I hear how hard this is. Support is available — a counsellor or nearby help, whenever you're ready.",
    ]

    async def generate_response(self, message: str, *, risk: str = "green") -> str:
        if risk == "yellow":
            return random.choice(self._YELLOW)
        return random.choice(self._REPLIES)


class GeminiAIProvider(AIProvider):
    def __init__(self) -> None:
        import google.generativeai as genai

        key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not key:
            raise RuntimeError("GEMINI_API_KEY not set")
        genai.configure(api_key=key)
        self._model = genai.GenerativeModel("gemini-2.0-flash")

    async def generate_response(self, message: str, *, risk: str = "green") -> str:
        system_prompt = (
            "You are a warm, calm support companion for SoulCare. "
            "Keep responses short (2-4 sentences). Never diagnose, prescribe, or give clinical advice."
        )
        chat = self._model.start_chat(system_instruction=system_prompt)
        response = chat.send_message(message)
        return (response.text or "").strip()


def get_ai_provider() -> AIProvider:
    demo = os.getenv("DEMO_MODE", "true").lower() in ("1", "true", "yes")
    key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if demo or not key:
        return MockAIProvider()
    try:
        return GeminiAIProvider()
    except Exception:
        return MockAIProvider()
