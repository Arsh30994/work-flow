from fastapi import WebSocket, WebSocketDisconnect
import asyncio
import json

# Set of active admin WebSocket connections
admin_connections: set[WebSocket] = set()

async def register_admin(ws: WebSocket):
    await ws.accept()
    admin_connections.add(ws)

async def unregister_admin(ws: WebSocket):
    admin_connections.discard(ws)

async def broadcast_alert(event: dict):
    """Send a JSON alert to all connected admin WebSocket clients.
    The event dict should include at least ``session_id``, ``risk`` and ``timestamp``.
    """
    if not admin_connections:
        return
    message = json.dumps(event)
    coros = [ws.send_text(message) for ws in admin_connections]
    await asyncio.gather(*coros, return_exceptions=True)
