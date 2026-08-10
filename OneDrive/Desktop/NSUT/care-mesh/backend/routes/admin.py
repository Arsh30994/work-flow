from fastapi import APIRouter, Depends

from ..controllers import AdminController
from ..dependencies.auth import admin_token_header
from ..schemas import LiveSessionsResponse, SessionHistoryResponse, TakeOverResponse

router = APIRouter(tags=["Admin"], dependencies=[Depends(admin_token_header)])


@router.get("/admin/sessions", response_model=LiveSessionsResponse)
async def live_sessions():
    return await AdminController.live_sessions()


@router.get("/admin/session/{session_id}", response_model=SessionHistoryResponse)
async def get_session_history(session_id: str):
    return await AdminController.session_history(session_id)


@router.post("/admin/session/{session_id}/takeover", response_model=TakeOverResponse)
async def take_over(session_id: str):
    return await AdminController.takeover(session_id)
