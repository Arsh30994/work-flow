from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from datetime import datetime
from .database import Base

class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String, default="Paused")  # "Active" or "Paused"
    nodes = Column(JSON, nullable=True)  # List of node objects
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Connection(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    status = Column(String, default="Disconnected")  # "Connected", "Disconnected", "Token Expired"
    last_synced = Column(String, nullable=True)
    icon = Column(String, nullable=True)
    color = Column(String, nullable=True)
    category = Column(String, nullable=True)
    description = Column(String, nullable=True)

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    workflow_name = Column(String, nullable=False)
    status = Column(String, default="Success")  # "Success", "Failed", "Running"
    speed = Column(String, nullable=True)
    steps = Column(JSON, nullable=True)  # Detailed steps log list

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Alex Rivers")
    email = Column(String, default="alex.rivers@flowguide.com")
    timezone = Column(String, default="EST (GMT-5)")
    notifications = Column(JSON, nullable=True)  # dict of notification settings
    avatar = Column(Text, nullable=True)  # base64 image or url
