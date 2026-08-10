"""FastAPI auth dependencies — JWT Bearer + admin header."""
from __future__ import annotations

import os
from typing import Optional

from fastapi import Depends, Header, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from ..schemas import UserPublic
from ..security.jwt import decode_access_token

_bearer = HTTPBearer(auto_error=False)


def admin_token_header(x_admin_token: str = Header(...)):
    """Simple admin authentication via X-Admin-Token header."""
    expected = os.getenv("ADMIN_TOKEN") or "soulcare-demo-admin"
    if x_admin_token != expected:
        raise HTTPException(status_code=401, detail="Invalid admin token")
    return True


def _user_from_payload(payload: dict) -> UserPublic:
    return UserPublic(
        user_id=str(payload["sub"]),
        display_name=str(payload.get("name") or ("Guest" if payload.get("guest") else "User")),
        email=payload.get("email"),
        preferred_language=str(payload.get("preferred_language") or "en"),
        role=str(payload.get("role") or "user"),
    )


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
) -> UserPublic:
    """Require `Authorization: Bearer <jwt>`."""
    if not credentials or credentials.scheme.lower() != "bearer" or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    payload = decode_access_token(credentials.credentials)
    return _user_from_payload(payload)


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
) -> Optional[UserPublic]:
    """Return user if a valid Bearer token is present; otherwise None."""
    if not credentials or credentials.scheme.lower() != "bearer" or not credentials.credentials:
        return None
    try:
        payload = decode_access_token(credentials.credentials)
        return _user_from_payload(payload)
    except HTTPException:
        return None
