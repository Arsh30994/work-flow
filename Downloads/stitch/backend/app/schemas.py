from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

# Workflow Schemas
class WorkflowBase(BaseModel):
    name: str
    status: str
    nodes: Optional[List[Dict[str, Any]]] = []

class WorkflowCreate(WorkflowBase):
    pass

class WorkflowUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    nodes: Optional[List[Dict[str, Any]]] = None

class WorkflowOut(WorkflowBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True

# Connection Schemas
class ConnectionOut(BaseModel):
    id: int
    name: str
    status: str
    last_synced: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

class ConnectionReconnect(BaseModel):
    api_key: Optional[str] = None

# ActivityLog Schemas
class ActivityLogOut(BaseModel):
    id: int
    timestamp: datetime
    workflow_name: str
    status: str
    speed: Optional[str] = None
    steps: Optional[List[Dict[str, Any]]] = []

    class Config:
        from_attributes = True

# Settings Schemas
class SettingsUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    timezone: Optional[str] = None
    notifications: Optional[Dict[str, bool]] = None
    avatar: Optional[str] = None  # Base64 string

class SettingsOut(BaseModel):
    id: int
    name: str
    email: str
    timezone: str
    notifications: Optional[Dict[str, bool]] = None
    avatar: Optional[str] = None

    class Config:
        from_attributes = True

# Chat Schemas
class ChatRequest(BaseModel):
    message: str
    canvas_nodes: Optional[List[Dict[str, Any]]] = []

class ChatResponse(BaseModel):
    reply: str
    action: Optional[str] = None  # e.g., "ADD_NODE", "CLEAR_CANVAS", "NONE"
    node_type: Optional[str] = None  # e.g., "Slack Notification", "Database", "AI Agent"
