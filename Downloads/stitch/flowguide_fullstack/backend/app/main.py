import random
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import datetime

from .database import engine, get_db
from .models import Base, Workflow, Connection, ActivityLog, Settings
from .schemas import (
    WorkflowCreate, WorkflowUpdate, WorkflowOut,
    ConnectionOut, ConnectionReconnect,
    ActivityLogOut, SettingsOut, SettingsUpdate,
    ChatRequest, ChatResponse
)
from .seed import seed_db

app = FastAPI(title="FlowGuide Backend API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React app can connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event: Seed the database
@app.on_event("startup")
def startup_event():
    seed_db()

# --- WORKFLOWS ---
@app.get("/api/workflows", response_model=List[WorkflowOut])
def get_workflows(db: Session = Depends(get_db)):
    return db.query(Workflow).all()

@app.post("/api/workflows", response_model=WorkflowOut)
def create_workflow(workflow: WorkflowCreate, db: Session = Depends(get_db)):
    db_workflow = Workflow(
        name=workflow.name,
        status=workflow.status,
        nodes=workflow.nodes
    )
    db.add(db_workflow)
    db.commit()
    db.refresh(db_workflow)
    return db_workflow

@app.put("/api/workflows/{id}", response_model=WorkflowOut)
def update_workflow(id: int, workflow_update: WorkflowUpdate, db: Session = Depends(get_db)):
    db_workflow = db.query(Workflow).filter(Workflow.id == id).first()
    if not db_workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    update_data = workflow_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_workflow, key, value)
        
    db_workflow.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_workflow)
    return db_workflow

@app.delete("/api/workflows/{id}")
def delete_workflow(id: int, db: Session = Depends(get_db)):
    db_workflow = db.query(Workflow).filter(Workflow.id == id).first()
    if not db_workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    db.delete(db_workflow)
    db.commit()
    return {"message": "Workflow deleted successfully"}

# Background task to simulate running a workflow
def simulate_workflow_run(workflow_id: int, workflow_name: str, db_session_maker):
    db = db_session_maker()
    try:
        # Load the latest workflow state
        wf = db.query(Workflow).filter(Workflow.id == workflow_id).first()
        if not wf or not wf.nodes:
            return
            
        # Create execution steps based on nodes
        steps_log = []
        status = "Success"
        
        # Randomly choose if it fails (5% chance if Slack exists, or just pure random)
        fail_node_idx = -1
        if random.random() < 0.08:
            fail_node_idx = random.randint(0, len(wf.nodes) - 1)
            status = "Failed"
            
        latency = 0.0
        for i, node in enumerate(wf.nodes):
            node_type = node.get("type", "Step")
            node_title = node.get("title", "Unnamed step")
            
            # Simulate processing time
            step_duration = round(random.uniform(0.05, 0.4), 2)
            latency += step_duration
            
            if i == fail_node_idx:
                steps_log.append({
                    "name": node_title,
                    "status": "Failed",
                    "duration": f"{step_duration}s",
                    "message": f"Execution failed: API returned error 400 Bad Request at node {node_title}."
                })
                break  # stop running
            else:
                steps_log.append({
                    "name": node_title,
                    "status": "Success",
                    "duration": f"{step_duration}s",
                    "message": f"Processed successfully: Input mapped and forwarded."
                })
                
        # Save log entry
        db_log = ActivityLog(
            workflow_name=workflow_name,
            status=status,
            speed=f"{round(latency, 2)}s",
            steps=steps_log
        )
        db.add(db_log)
        db.commit()
    except Exception as e:
        print(f"Error running simulated workflow: {e}")
    finally:
        db.close()

@app.post("/api/workflows/{id}/run")
def run_workflow(id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_workflow = db.query(Workflow).filter(Workflow.id == id).first()
    if not db_workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
        
    # Queue simulation in background tasks
    # Pass SessionLocal maker to safely create a new session inside background thread
    from .database import SessionLocal
    background_tasks.add_task(
        simulate_workflow_run, 
        db_workflow.id, 
        db_workflow.name, 
        SessionLocal
    )
    return {"message": "Workflow run triggered successfully", "workflow_name": db_workflow.name}

# --- CONNECTIONS ---
@app.get("/api/connections", response_model=List[ConnectionOut])
def get_connections(db: Session = Depends(get_db)):
    return db.query(Connection).all()

@app.post("/api/connections/{id}/toggle", response_model=ConnectionOut)
def toggle_connection(id: int, db: Session = Depends(get_db)):
    conn = db.query(Connection).filter(Connection.id == id).first()
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
        
    if conn.status == "Connected":
        conn.status = "Disconnected"
        conn.last_synced = None
    else:
        conn.status = "Connected"
        conn.last_synced = "Just now"
        
    db.commit()
    db.refresh(conn)
    return conn

@app.post("/api/connections/{id}/reconnect", response_model=ConnectionOut)
def reconnect_connection(id: int, payload: ConnectionReconnect, db: Session = Depends(get_db)):
    conn = db.query(Connection).filter(Connection.id == id).first()
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
        
    conn.status = "Connected"
    conn.last_synced = "Just now"
    db.commit()
    db.refresh(conn)
    return conn

# --- SETTINGS ---
@app.get("/api/settings", response_model=SettingsOut)
def get_settings(db: Session = Depends(get_db)):
    # Simply return the first settings row
    settings = db.query(Settings).first()
    if not settings:
        # Fallback creation
        settings = Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@app.put("/api/settings", response_model=SettingsOut)
def update_settings(settings_update: SettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(Settings).first()
    if not settings:
        settings = Settings()
        db.add(settings)
        
    update_data = settings_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
        
    db.commit()
    db.refresh(settings)
    return settings

# --- ACTIVITY LOGS ---
@app.get("/api/history", response_model=List[ActivityLogOut])
def get_history(db: Session = Depends(get_db)):
    return db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).all()

@app.delete("/api/history")
def clear_history(db: Session = Depends(get_db)):
    db.query(ActivityLog).delete()
    db.commit()
    return {"message": "Activity history cleared successfully"}

# --- TEMPLATES ---
TEMPLATES_DB = [
    {
        "id": "tpl-1",
        "name": "Social Media Assistant",
        "icon": "share",
        "color": "#b0ceb2",
        "accent": "sage-muted",
        "description": "Draft captions, schedule posts, and track engagement across all platforms.",
        "nodes": [
            {"id": "t-1", "type": "Trigger", "title": "New Calendar Event", "icon": "calendar_month", "details": "Sync: Marketing Scheduler", "accent": "sage-muted"},
            {"id": "t-2", "type": "AI Agent", "title": "Draft Post Caption", "icon": "neurology", "details": "Model: Gemini Flash, System: Creative Copywriter", "accent": "primary"},
            {"id": "t-3", "type": "Action", "title": "Post on Social Channels", "icon": "share", "details": "Platforms: Twitter, LinkedIn", "accent": "secondary-container"}
        ]
    },
    {
        "id": "tpl-2",
        "name": "Smart Invoice Handler",
        "icon": "receipt_long",
        "color": "#f7bb7e",
        "accent": "tertiary",
        "description": "Automatically extract data from PDF invoices and sync with accounting records.",
        "nodes": [
            {"id": "i-1", "type": "Trigger", "title": "New File in Folder", "icon": "folder", "details": "Directory: /invoices/pending", "accent": "sage-muted"},
            {"id": "i-2", "type": "AI Agent", "title": "Extract Invoice Metadata", "icon": "auto_fix_high", "details": "Extract fields: Total, Date, Vendor", "accent": "primary"},
            {"id": "i-3", "type": "Database", "title": "Save to Accounting Records", "icon": "storage", "details": "SQLite Table: Invoices", "accent": "tertiary"}
        ]
    },
    {
        "id": "tpl-3",
        "name": "Email Summarizer",
        "icon": "mark_email_unread",
        "color": "#aecfb0",
        "accent": "primary",
        "description": "Get a daily email summary digest filtered by urgent keywords.",
        "nodes": [
            {"id": "s-1", "type": "Trigger", "title": "New Email Arrives", "icon": "mail", "details": "Folder: Inbox, Keywords: support, urgent", "accent": "sage-muted"},
            {"id": "s-2", "type": "AI Agent", "title": "Summarize Content", "icon": "neurology", "details": "Summarize in 2 sentences", "accent": "primary"},
            {"id": "s-3", "type": "Action", "title": "Slack Notification", "icon": "forum", "details": "Channel: #urgent-support", "accent": "secondary-container"}
        ]
    },
    {
        "id": "tpl-4",
        "name": "Meeting Notes Pro",
        "icon": "description",
        "color": "#baccba",
        "accent": "secondary",
        "description": "Transcribe meetings, extract tasks, and write recaps to a Notion page.",
        "nodes": [
            {"id": "m-1", "type": "Trigger", "title": "Recording Added", "icon": "mic", "details": "Folder: Google Drive/Recordings", "accent": "sage-muted"},
            {"id": "m-2", "type": "AI Agent", "title": "Generate Recap & Tasks", "icon": "neurology", "details": "Model: Gemini Pro", "accent": "primary"},
            {"id": "m-3", "type": "Action", "title": "Create Notion Page", "icon": "notes", "details": "Database: Meeting Recaps", "accent": "secondary-container"}
        ]
    }
]

@app.get("/api/templates")
def get_templates():
    return TEMPLATES_DB

@app.post("/api/templates/{id}/instantiate", response_model=WorkflowOut)
def instantiate_template(id: str, db: Session = Depends(get_db)):
    template = next((t for t in TEMPLATES_DB if t["id"] == id), None)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
        
    db_wf = Workflow(
        name=template["name"],
        status="Paused",
        nodes=template["nodes"]
    )
    db.add(db_wf)
    db.commit()
    db.refresh(db_wf)
    return db_wf

# --- CHAT / THE GUIDE ---
@app.post("/api/chat", response_model=ChatResponse)
def chat_with_guide(req: ChatRequest, db: Session = Depends(get_db)):
    msg = req.message.lower()
    
    # Analyze query to trigger canvas modifications or return advice
    if "add" in msg and "slack" in msg:
        return ChatResponse(
            reply="I've added a Slack Notification action step to your canvas wrapper. Double-click it to set up the channel and webhook token!",
            action="ADD_NODE",
            node_type="Slack Notification"
        )
    elif "add" in msg and "database" in msg:
        return ChatResponse(
            reply="I've placed a Database destination node on the canvas. You can link this to store your synchronized records.",
            action="ADD_NODE",
            node_type="Database"
        )
    elif "add" in msg and "ai agent" in msg:
        return ChatResponse(
            reply="I've added an AI Agent logical block. This can be configured to classify, extract, or summarize data automatically.",
            action="ADD_NODE",
            node_type="AI Agent"
        )
    elif "add" in msg and "webhook" in msg:
        return ChatResponse(
            reply="I've added a Webhook listener node. You can use this to receive real-time updates from third-party services.",
            action="ADD_NODE",
            node_type="Webhook"
        )
    elif "clear" in msg or "reset" in msg:
        return ChatResponse(
            reply="I've cleared the workflow canvas nodes for you. You can start fresh by dragging components or asking me to add them!",
            action="CLEAR_CANVAS"
        )
    elif "how" in msg and "shopify" in msg:
        return ChatResponse(
            reply="To sync Shopify orders to sheets, choose the 'Store-to-Sheet' template in the Templates Tab, or manually drag a Shopify Trigger followed by a Database action step onto the canvas."
        )
    elif "help" in msg or "build" in msg:
        return ChatResponse(
            reply="I can help you build custom automations! You can try asking 'Add a Slack notification node', 'Clear canvas', or ask about Shopify integration tips."
        )
    else:
        # Default smart conversational reply
        options = [
            "That sounds like a great automation path! Would you like me to add a suitable building block to the builder canvas?",
            "I've analyzed your suggestion. We can connect this step directly to your current workflow structure. Shall I add it?",
            "Interesting approach. I recommend batching these updates to keep latency low. Would you like to review documentation on custom connections?",
            "I'm ready to configure that. Try saying: 'Add an AI Agent node' or 'Add a Slack node' to place it on the canvas automatically."
        ]
        return ChatResponse(reply=random.choice(options))
