# -*- coding: utf-8 -*-
"""Triaging risk levels for user messages.

This module provides a deterministic, explainable function ``assess_risk``
that classifies a free-text user message into three risk tiers:

* "green" - low risk / no immediate concern
* "yellow" - moderate distress, may benefit from support
* "red" - crisis / suicidal ideation, requires urgent attention

The implementation uses simple keyword/phrase matching.  It is deliberately
deterministic and auditable so that the logic can be reviewed, extended, or
replaced (e.g., with a PHQ-9/GAD-7 questionnaire) without changing the
public API.

The keyword lists contain common English expressions and a selection of
Hinglish phrases that are frequently encountered in Indian English contexts.
The matching is case-insensitive and looks for whole-word occurrences where
appropriate.
"""
from __future__ import annotations

import re
from typing import Literal, List, Tuple

# ---------------------------------------------------------------------------
# Keyword definitions
# ---------------------------------------------------------------------------
# Red tier - expressions indicating suicidal ideation or self-harm intent.
_RED_KEYWORDS: List[Tuple[re.Pattern, str]] = [
    # English patterns
    (re.compile(r"\bwant to die\b", re.IGNORECASE), "want to die"),
    (re.compile(r"\bend(ing)? it all\b", re.IGNORECASE), "end it all"),
    (re.compile(r"\bno point living\b", re.IGNORECASE), "no point living"),
    (re.compile(r"\bbetter off without me\b", re.IGNORECASE), "better off without me"),
    (re.compile(r"\bkill myself\b", re.IGNORECASE), "kill myself"),
    (re.compile(r"\bcommit suicide\b", re.IGNORECASE), "commit suicide"),
    (re.compile(r"\bcan't go on\b", re.IGNORECASE), "can't go on"),
    (re.compile(r"\bthinking of ending my life\b", re.IGNORECASE), "thinking of ending my life"),
    # Hinglish patterns - common transliterations
    (re.compile(r"\bmarna chahta( hoon)?\b", re.IGNORECASE), "marna chahta hoon"),
    (re.compile(r"\bzindagi se thak gaya\b", re.IGNORECASE), "zindagi se thak gaya"),
    (re.compile(r"\bkuch nahi bacha\b", re.IGNORECASE), "kuch nahi bacha"),
    (re.compile(r"\bmain khatam ho jaunga\b", re.IGNORECASE), "main khatam ho jaunga"),
]

# Yellow tier - moderate distress signals.
_YELLOW_KEYWORDS: List[Tuple[re.Pattern, str]] = [
    (re.compile(r"\bcan't sleep\b", re.IGNORECASE), "can't sleep"),
    (re.compile(r"\bpanic attacks?\b", re.IGNORECASE), "panic attacks"),
    (re.compile(r"\bhopeless\b", re.IGNORECASE), "hopeless"),
    (re.compile(r"\bworthless\b", re.IGNORECASE), "worthless"),
    (re.compile(r"\banxious all the time\b", re.IGNORECASE), "anxious all the time"),
    (re.compile(r"\bcan't cope\b", re.IGNORECASE), "can't cope"),
    (re.compile(r"\bfeeling down\b", re.IGNORECASE), "feeling down"),
    (re.compile(r"\bstress(ed)?\b", re.IGNORECASE), "stress"),
    # Hinglish moderate distress
    (re.compile(r"\bmai bahut udaas hoon\b", re.IGNORECASE), "mai bahut udaas hoon"),
    (re.compile(r"\bparinda lag raha hai\b", re.IGNORECASE), "parinda lag raha hai"),
]


def _match_keywords(message: str, patterns: List[Tuple[re.Pattern, str]]) -> bool:
    """Return ``True`` if any pattern in *patterns* matches *message*."""
    for regex, _ in patterns:
        if regex.search(message):
            return True
    return False


def assess_risk(message: str) -> Literal["green", "yellow", "red"]:
    """Assess the risk tier of a free-text *message*.

    Steps:
    1. Red tier - if any red keyword matches, return "red".
    2. Yellow tier - if a yellow keyword matches (and no red), return "yellow".
    3. Otherwise return "green".
    """
    normalized = " ".join(message.split()).strip()
    if not normalized:
        return "green"
    if _match_keywords(normalized, _RED_KEYWORDS):
        return "red"
    if _match_keywords(normalized, _YELLOW_KEYWORDS):
        return "yellow"
    return "green"


__all__ = ["assess_risk"]
