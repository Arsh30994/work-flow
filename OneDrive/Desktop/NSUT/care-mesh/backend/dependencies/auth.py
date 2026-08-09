from fastapi import Header, HTTPException
import os

def admin_token_header(x_admin_token: str = Header(...)):
    """Simple admin authentication dependency.
    Checks the "X-Admin-Token" header against the ADMIN_TOKEN environment variable.
    Raises 401 if missing or mismatched.
    """
    expected = os.getenv("ADMIN_TOKEN")
    if expected is None:
        raise HTTPException(status_code=500, detail="ADMIN_TOKEN not configured on server")
    if x_admin_token != expected:
        raise HTTPException(status_code=401, detail="Invalid admin token")
    return True
