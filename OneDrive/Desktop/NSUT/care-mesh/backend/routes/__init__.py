"""API routers."""

from .admin import router as admin_router
from .auth import router as auth_router
from .catalog import router as catalog_router
from .chat import router as chat_router
from .pages import router as pages_router
from .therapists import router as therapists_router

__all__ = [
    "chat_router",
    "admin_router",
    "therapists_router",
    "catalog_router",
    "auth_router",
    "pages_router",
]
