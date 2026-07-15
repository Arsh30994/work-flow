from datetime import datetime, timedelta
from .database import engine, Base, SessionLocal
from .models import Workflow, Connection, ActivityLog, Settings

def seed_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if we have already seeded
    if db.query(Settings).first() is not None:
        db.close()
        print("Database already seeded.")
        return
        
    # 1. Seed Settings
    settings = Settings(
        name="Alex Rivers",
        email="alex.rivers@flowguide.com",
        timezone="EST (GMT-5)",
        notifications={
            "runs": True,
            "errors": True,
            "updates": False,
            "security": True
        },
        avatar="https://lh3.googleusercontent.com/aida-public/AB6AXuCjPMYo4MV5jsZOCSkvwt2iEw4FvxIepK7pU9h_l3U0oM3gHAw2shgi7HYTfvRMOXX7K3wbs9Q46vu-Tlh7aUZnP6IV5szXU6q1VWGQwcYgkEzpyDE_NfWGkaiWHRVstfDwxO2LbFCJg14cbm_sZ9Nn4675Pitr6ZiuC0h9KuH8O8x9VsbzXyFrKjOaYH0wxWS1gRdjs5elLOK8TaNLSw9-368BZUYl8buE7HSRd4mvzRUzOyOajfnBbA"
    )
    db.add(settings)
    
    # 2. Seed Connections
    connections = [
        Connection(
            name="Slack",
            status="Connected",
            last_synced="4m ago",
            icon="forum",
            color="#ECB22E",
            category="Communication",
            description="Post notifications, manage channels, and trigger workflows from messages."
        ),
        Connection(
            name="Gmail",
            status="Connected",
            last_synced="12h ago",
            icon="mail",
            color="#BA1A1A",
            category="Communication",
            description="Monitor for new emails, draft replies, and automate your inbox workflows."
        ),
        Connection(
            name="Shopify",
            status="Token Expired",
            last_synced="1d ago",
            icon="shopping_bag",
            color="#A7CBEB",
            category="E-commerce",
            description="Sync orders, manage inventory, and trigger post-purchase automations."
        ),
        Connection(
            name="Notion",
            status="Connected",
            last_synced="2d ago",
            icon="notes",
            color="#C2C9C2",
            category="Productivity",
            description="Create database entries, update pages, and read content from blocks."
        ),
        Connection(
            name="Airtable",
            status="Disconnected",
            last_synced=None,
            icon="table_rows",
            color="#F7BB7E",
            category="Productivity",
            description="Organize data in grids, sync tables, and trigger processes from cell updates."
        ),
        Connection(
            name="HubSpot",
            status="Disconnected",
            last_synced=None,
            icon="hub",
            color="#FF9900",
            category="Marketing",
            description="Manage customer logs, update contacts, and sync pipelines organically."
        )
    ]
    for conn in connections:
        db.add(conn)
        
    # 3. Seed Workflows
    workflows = [
        Workflow(
            name="Customer Support Auto-Sort",
            status="Active",
            nodes=[
                {"id": "node-1", "type": "Trigger", "title": "New Email Arrives", "icon": "mail", "details": "Account: personal@email.com, Folder: Inbox", "accent": "sage-muted"},
                {"id": "node-2", "type": "AI Agent", "title": "Classify Support Category", "icon": "neurology", "details": "Model: Gemini 2.0 Flash Pro", "accent": "primary"},
                {"id": "node-3", "type": "Condition", "title": "Priority Check", "icon": "call_split", "details": "If Priority is High", "accent": "tertiary"},
                {"id": "node-4", "type": "Action", "title": "Slack Notification", "icon": "forum", "details": "Channel: #general, Message: 'New support request'", "accent": "secondary-container"}
            ],
            updated_at=datetime.utcnow() - timedelta(minutes=2)
        ),
        Workflow(
            name="Weekly Team Sync Recap",
            status="Paused",
            nodes=[
                {"id": "node-11", "type": "Trigger", "title": "Audio Recording Added", "icon": "mic", "details": "Source: Google Drive/SyncRecaps", "accent": "sage-muted"},
                {"id": "node-12", "type": "Action", "title": "Summarize Transcript", "icon": "summarize", "details": "Summary length: medium, Tone: formal", "accent": "primary"}
            ],
            updated_at=datetime.utcnow() - timedelta(days=3)
        )
    ]
    for wf in workflows:
        db.add(wf)
        
    # 4. Seed Activity logs
    logs = [
        ActivityLog(
            workflow_name="Customer Support Auto-Sort",
            status="Success",
            speed="0.45s",
            timestamp=datetime.utcnow() - timedelta(minutes=2),
            steps=[
                {"name": "New Email Arrives", "status": "Success", "duration": "0.12s", "message": "Retrieved email 'Refund Inquiry'"},
                {"name": "Classify Support Category", "status": "Success", "duration": "0.22s", "message": "Classified as Billing - High Priority"},
                {"name": "Priority Check", "status": "Success", "duration": "0.01s", "message": "Branch: High Priority"},
                {"name": "Slack Notification", "status": "Success", "duration": "0.10s", "message": "Posted to #urgent-support"}
            ]
        ),
        ActivityLog(
            workflow_name="Weekly Team Sync Recap",
            status="Success",
            speed="1.2s",
            timestamp=datetime.utcnow() - timedelta(days=3),
            steps=[
                {"name": "Audio Recording Added", "status": "Success", "duration": "0.40s", "message": "Audio file sync_recap_1210.mp3 loaded"},
                {"name": "Summarize Transcript", "status": "Success", "duration": "0.80s", "message": "Recap generated and saved to Notion"}
            ]
        ),
        ActivityLog(
            workflow_name="Customer Support Auto-Sort",
            status="Failed",
            speed="0.32s",
            timestamp=datetime.utcnow() - timedelta(hours=4),
            steps=[
                {"name": "New Email Arrives", "status": "Success", "duration": "0.15s", "message": "Retrieved email 'Password reset'"},
                {"name": "Classify Support Category", "status": "Success", "duration": "0.17s", "message": "Classified as Security - Medium Priority"},
                {"name": "Priority Check", "status": "Success", "duration": "0.01s", "message": "Branch: Normal Priority"},
                {"name": "Slack Notification", "status": "Failed", "duration": "0.00s", "message": "API Error: 401 Unauthorized token - Automatically retrying"}
            ]
        )
    ]
    for lg in logs:
        db.add(lg)
        
    db.commit()
    db.close()
    print("Database seeded successfully.")
