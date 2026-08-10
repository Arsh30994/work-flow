"""Triage package re-exports the deterministic risk engine."""
from ..services.triage import assess_risk, assess_risk_detail

__all__ = ["assess_risk", "assess_risk_detail"]
