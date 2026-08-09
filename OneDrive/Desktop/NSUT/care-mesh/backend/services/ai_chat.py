"""AI chat service for SoulCare.

Flow: user message → deterministic risk engine → GREEN/YELLOW LLM · RED = no LLM.
"""

from typing import Dict
from .triage import assess_risk
from ..ai.provider import get_ai_provider

_RED_HANDOFF = (
    "You're not alone. It sounds like you may need immediate human support. "
    "Please call 112 if you're in danger, or use Find help nearby / Connect with a counsellor."
)


async def get_ai_reply(message: str) -> Dict[str, object]:
    risk = assess_risk(message)

    if risk == "red":
        return {"reply": _RED_HANDOFF, "risk": "red", "escalate": True}

    provider = get_ai_provider()
    try:
        reply_text = await provider.generate_response(message, risk=risk)
    except Exception:
        reply_text = (
            "I'm having trouble responding right now. "
            "If you need support, call 112 or Tele-MANAS 14416."
        )

    return {"reply": reply_text, "risk": risk, "escalate": False}
