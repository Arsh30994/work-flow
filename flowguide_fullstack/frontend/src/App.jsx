import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workflows, setWorkflows] = useState([]);
  const [connections, setConnections] = useState([]);
  const [history, setHistory] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [settings, setSettings] = useState({
    name: 'Alex Rivers',
    email: 'alex.rivers@flowguide.com',
    timezone: 'EST (GMT-5)',
    notifications: { runs: true, errors: true, updates: false, security: true },
    avatar: ''
  });

  // Theme state
  const [theme, setTheme] = useState('dark');

  // Builder states
  const [builderNodes, setBuilderNodes] = useState([]);
  const [builderWorkflowId, setBuilderWorkflowId] = useState(null);
  const [builderWorkflowName, setBuilderWorkflowName] = useState('New Custom Workflow');
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Guide Sidebar states
  const [guideOpen, setGuideOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'guide', message: 'Hi Alex! I see you\'re back. Would you like to check the performance of your support workflows, or start something new?', time: '2m ago' }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  // Connection Modal state
  const [showConnectModal, setShowConnectModal] = useState(null); // connection object or null
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', icon: 'check_circle' });

  // Search states
  const [searchQuery, setSearchQuery] = useState('');

  // Refs for canvas scrolling
  const canvasRef = useRef(null);

  // Fetch initial data on load
  useEffect(() => {
    fetchData();
  }, []);

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, [theme]);

  const fetchData = async () => {
    try {
      const wfRes = await fetch('/api/workflows');
      if (wfRes.ok) setWorkflows(await wfRes.json());

      const connRes = await fetch('/api/connections');
      if (connRes.ok) setConnections(await connRes.json());

      const histRes = await fetch('/api/history');
      if (histRes.ok) setHistory(await histRes.json());

      const tplRes = await fetch('/api/templates');
      if (tplRes.ok) setTemplates(await tplRes.json());

      const settRes = await fetch('/api/settings');
      if (settRes.ok) setSettings(await settRes.json());
    } catch (err) {
      console.error('Error fetching data from API:', err);
      showToast('Error syncing with backend', 'error');
    }
  };

  const showToast = (message, icon = 'check_circle') => {
    setToast({ show: true, message, icon });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // --- API CALLS ---
  const handleSaveWorkflow = async () => {
    if (!builderWorkflowName.trim()) {
      showToast('Workflow name cannot be empty', 'error');
      return;
    }
    
    try {
      const payload = {
        name: builderWorkflowName,
        status: 'Paused',
        nodes: builderNodes
      };

      let res;
      if (builderWorkflowId) {
        res = await fetch(`/api/workflows/${builderWorkflowId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/workflows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        const savedWf = await res.json();
        setBuilderWorkflowId(savedWf.id);
        showToast('Workflow saved successfully', 'cloud_done');
        // Refresh workflow list
        const wfRes = await fetch('/api/workflows');
        if (wfRes.ok) setWorkflows(await wfRes.json());
      } else {
        showToast('Failed to save workflow', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Backend connection error', 'error');
    }
  };

  const handleRunWorkflow = async (id) => {
    const targetId = id || builderWorkflowId;
    if (!targetId) {
      showToast('Save the workflow first to run it', 'warning');
      return;
    }
    showToast('Executing workflow pipeline...', 'rocket_launch');
    try {
      const res = await fetch(`/api/workflows/${targetId}/run`, { method: 'POST' });
      if (res.ok) {
        showToast('Run completed!', 'check_circle');
        // Wait briefly for simulation task log entry to settle, then refresh history & workflows
        setTimeout(async () => {
          const histRes = await fetch('/api/history');
          if (histRes.ok) setHistory(await histRes.json());
        }, 1000);
      } else {
        showToast('Error executing run', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleWorkflow = async (wf) => {
    try {
      const newStatus = wf.status === 'Active' ? 'Paused' : 'Active';
      const res = await fetch(`/api/workflows/${wf.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast(`Workflow ${newStatus === 'Active' ? 'Activated' : 'Paused'}`, newStatus === 'Active' ? 'play_arrow' : 'pause');
        const wfRes = await fetch('/api/workflows');
        if (wfRes.ok) setWorkflows(await wfRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteWorkflow = async (id) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;
    try {
      const res = await fetch(`/api/workflows/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Workflow deleted successfully', 'delete');
        if (builderWorkflowId === id) {
          setBuilderWorkflowId(null);
          setBuilderWorkflowName('New Custom Workflow');
          setBuilderNodes([]);
        }
        const wfRes = await fetch('/api/workflows');
        if (wfRes.ok) setWorkflows(await wfRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleConnection = async (connId) => {
    try {
      const res = await fetch(`/api/connections/${connId}/toggle`, { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        showToast(`${updated.name} connection status updated`, 'swap_horiz');
        const connRes = await fetch('/api/connections');
        if (connRes.ok) setConnections(await connRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReconnectConnection = async () => {
    if (!showConnectModal) return;
    setIsConnecting(true);
    try {
      const res = await fetch(`/api/connections/${showConnectModal.id}/reconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKeyInput })
      });
      if (res.ok) {
        showToast(`Reconnected to ${showConnectModal.name}!`, 'verified');
        setShowConnectModal(null);
        setApiKeyInput('');
        const connRes = await fetch('/api/connections');
        if (connRes.ok) setConnections(await connRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleUseTemplate = async (tpl) => {
    try {
      const res = await fetch(`/api/templates/${tpl.id}/instantiate`, { method: 'POST' });
      if (res.ok) {
        const instantiated = await res.json();
        showToast(`Loaded ${tpl.name} template!`, 'auto_awesome');
        
        // Load template details into builder and switch tab
        setBuilderWorkflowId(instantiated.id);
        setBuilderWorkflowName(instantiated.name);
        setBuilderNodes(instantiated.nodes || []);
        setActiveTab('builder');
        
        // Refresh workflows list
        const wfRes = await fetch('/api/workflows');
        if (wfRes.ok) setWorkflows(await wfRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear all history execution logs?')) return;
    try {
      const res = await fetch('/api/history', { method: 'DELETE' });
      if (res.ok) {
        showToast('Activity history logs cleared', 'delete');
        setHistory([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (updatedFields) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        const newSettings = await res.json();
        setSettings(newSettings);
        showToast('Settings saved successfully', 'save');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGuideChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', message: userMsg, time: 'Just now' }]);
    setChatInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, canvas_nodes: builderNodes })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { sender: 'guide', message: data.reply, time: 'Just now' }]);
        
        // Handle Guide modifications to Canvas nodes
        if (data.action === 'ADD_NODE' && data.node_type) {
          addNodeToCanvas(data.node_type);
        } else if (data.action === 'CLEAR_CANVAS') {
          setBuilderNodes([]);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Guide connection failed', 'error');
    }
  };

  // --- BUILDER CANVAS LOGIC ---
  const addNodeToCanvas = (type) => {
    let title = type;
    let icon = 'extension';
    let accent = 'primary';
    let details = 'Click to configure details';

    if (type === 'Slack Notification') {
      title = 'Slack Notification';
      icon = 'forum';
      accent = 'secondary-container';
      details = 'Channel: #general, Message: "Alert"';
    } else if (type === 'Database') {
      title = 'Save to Database';
      icon = 'storage';
      accent = 'tertiary';
      details = 'Table: support_tickets';
    } else if (type === 'AI Agent') {
      title = 'Gemini Data Classifier';
      icon = 'neurology';
      accent = 'primary';
      details = 'Model: Gemini Pro';
    } else if (type === 'Webhook') {
      title = 'Webhook Listener';
      icon = 'webhook';
      accent = 'sage-muted';
      details = 'URL: /webhook/sync';
    } else if (type === 'Trigger') {
      title = 'New Email Trigger';
      icon = 'mail';
      accent = 'sage-muted';
      details = 'Account: personal@email.com';
    } else if (type === 'Condition') {
      title = 'Conditional Filter';
      icon = 'call_split';
      accent = 'tertiary';
      details = 'Check value exists';
    }

    const newNode = {
      id: `node-${Date.now()}`,
      type,
      title,
      icon,
      details,
      accent
    };

    setBuilderNodes(prev => [...prev, newNode]);
    showToast(`Added ${title} step`, 'add_circle');
  };

  const removeNodeFromCanvas = (nodeId) => {
    setBuilderNodes(prev => prev.filter(n => n.id !== nodeId));
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
    showToast('Removed step', 'remove_circle');
  };

  const handleUpdateNodeDetails = (nodeId, updatedFields) => {
    setBuilderNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        return { ...n, ...updatedFields };
      }
      return n;
    }));
    setSelectedNode(prev => prev ? { ...prev, ...updatedFields } : null);
    showToast('Step updated', 'edit');
  };

  // Drag and drop simulation helpers
  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('text/plain', nodeType);
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('text/plain');
    if (nodeType) {
      addNodeToCanvas(nodeType);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSaveSettings({ avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper stats for bento grid
  const activeCount = workflows.filter(w => w.status === 'Active').length;
  const totalRuns = history.length * 12 + 2482; // dynamic mapping base
  const hasErrors = history.some(h => h.status === 'Failed');

  // Filtered lists
  const filteredWorkflows = workflows.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark text-on-surface' : 'text-gray-900'}`}>
      
      {/* Top Navbar */}
      <header className="bg-surface-dim/90 border-b border-node-border/40 docked sticky top-0 backdrop-blur-md z-40">
        <div className="flex justify-between items-center w-full px-margin-desktop py-4 max-w-max-content-width mx-auto">
          <div className="flex items-center gap-8">
            <span className="font-headline text-2xl font-extrabold text-primary tracking-tight flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              FlowGuide
            </span>
            <nav className="hidden md:flex items-center gap-6">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'builder', label: 'Builder' },
                { id: 'connections', label: 'Connections' },
                { id: 'templates', label: 'Templates' },
                { id: 'history', label: 'History' },
                { id: 'settings', label: 'Settings' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery('');
                  }}
                  className={`font-body text-sm font-semibold transition-colors py-1 ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary font-bold'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="hidden sm:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-node-border/40">
              <span className="material-symbols-outlined text-outline text-[20px] mr-2">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm p-0 w-44 text-on-surface placeholder:text-outline/70"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                type="text"
              />
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-high hover:bg-primary/20 text-on-surface-variant hover:text-primary transition-all duration-200 active:scale-95"
              title="Toggle Dark/Light Theme"
            >
              <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
            </button>

            {/* Guide Toggle */}
            <button
              onClick={() => setGuideOpen(!guideOpen)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                guideOpen ? 'bg-primary text-on-primary' : 'bg-surface-container-high hover:bg-primary/20 text-on-surface-variant'
              }`}
              title="Toggle The Guide Co-Pilot"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: guideOpen ? "'FILL' 1" : "'FILL' 0" }}>auto_awesome</span>
            </button>

            {/* Profile Avatar */}
            <div className="h-9 w-9 rounded-full overflow-hidden border border-node-border/50 ml-1 cursor-pointer" onClick={() => setActiveTab('settings')}>
              <img
                alt="User Profile"
                className="w-full h-full object-cover"
                src={settings.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAb_cW07ERtOIaRCO03aAHemDO7I_elYSTszKSzcaQSZqnVDU9EnldP6L_bJFpyAS1ASKphLjb7AWgibQ_tl95DQbaFmbhfqPIo1nWS8cuWrCiivrxfmTjU6u5Zh0qPoEKgnjid4hXsHkACUCRtIqKY7GWlOzZGnDXtGcIJS48HVoQZitCbdLKOYUjljBvddeeRdcob2Ohy-mLlIl3DIHgq2nhqFRQfDMVmxssZeOS5M3Ksgb5q4QzV0Q"}
              />
            </div>

            <button
              onClick={() => {
                setBuilderWorkflowId(null);
                setBuilderWorkflowName('New Custom Workflow');
                setBuilderNodes([]);
                setActiveTab('builder');
              }}
              className="bg-primary text-on-primary px-5 py-2.5 rounded-full font-body font-bold hover:brightness-110 active:scale-95 transition-all shadow-md text-sm"
            >
              Create New
            </button>
          </div>
        </div>
      </header>

      {/* Main Content & Shared Sidebar guide layout */}
      <main className="max-w-max-content-width mx-auto px-margin-desktop py-8 flex flex-col lg:flex-row gap-gutter">
        
        {/* Content Pane */}
        <div className={`flex-1 min-w-0 transition-all duration-300 ${guideOpen ? 'lg:mr-0' : ''}`}>
          
          {/* DASHBOARD PAGE */}
          {activeTab === 'dashboard' && (
            <div className="space-y-10 animate-fade-in-up">
              
              {/* Header block */}
              <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="font-headline text-4xl font-extrabold tracking-tight mb-1 text-on-surface">
                    Good morning, {settings.name.split(' ')[0]}.
                  </h1>
                  <p className="text-on-surface-variant font-body">Your workspace is running cleanly. What would you like to build next?</p>
                </div>
              </section>

              {/* Stats Bento Grid */}
              <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl border-l-4 border-primary flex flex-col justify-between hover-lift">
                  <div className="flex justify-between items-center">
                    <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-xl">bolt</span>
                    <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-mono font-bold">LIVE STAT</span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Active Workflows</h3>
                    <p className="font-headline text-3xl font-extrabold mt-1">{activeCount} / {workflows.length}</p>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border-l-4 border-secondary flex flex-col justify-between hover-lift">
                  <div className="flex justify-between items-center">
                    <span className="material-symbols-outlined text-secondary bg-secondary/10 p-2 rounded-xl">check_circle</span>
                    <span className="text-xs bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-mono font-bold">99.9%</span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">System Health</h3>
                    <p className="font-headline text-3xl font-extrabold mt-1 text-secondary">{hasErrors ? 'Degraded' : 'Stable'}</p>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border-l-4 border-tertiary flex flex-col justify-between hover-lift">
                  <div className="flex justify-between items-center">
                    <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-2 rounded-xl">timer</span>
                    <span className="text-xs bg-tertiary/10 text-tertiary px-2.5 py-1 rounded-full font-mono font-bold">Fast</span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Avg Volume Runs</h3>
                    <p className="font-headline text-3xl font-extrabold mt-1">{totalRuns.toLocaleString()}</p>
                  </div>
                </div>
              </section>

              {/* Workflows List */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-headline text-2xl font-bold">My Active Pipelines</h2>
                  <button className="text-primary hover:underline text-sm font-semibold flex items-center gap-1" onClick={() => setActiveTab('builder')}>
                    Go to Canvas <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>

                {filteredWorkflows.length === 0 ? (
                  <div className="glass-card p-8 text-center rounded-2xl flex flex-col items-center">
                    <span className="material-symbols-outlined text-4xl text-outline/50 mb-3">account_tree</span>
                    <p className="text-on-surface-variant font-medium">No workflows found. Search different keywords or configure a new pipeline.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredWorkflows.map(wf => (
                      <div key={wf.id} className="workflow-card glass-card p-6 rounded-2xl hover-lift relative overflow-hidden group">
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={() => handleToggleWorkflow(wf)}
                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                              wf.status === 'Active'
                                ? 'bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20'
                                : 'bg-surface-container-highest text-outline border border-node-border/40 hover:bg-surface-container-low'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${wf.status === 'Active' ? 'bg-secondary animate-pulse' : 'bg-outline'}`}></span>
                            {wf.status}
                          </button>
                        </div>

                        <div className="flex gap-4 items-start mb-6 pr-20">
                          <div className="w-12 h-12 bg-primary/10 border border-primary/20 text-primary rounded-xl flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-2xl">{wf.nodes && wf.nodes[0] ? wf.nodes[0].icon : 'account_tree'}</span>
                          </div>
                          <div>
                            <h3 className="font-headline font-semibold text-lg mb-1 leading-snug">{wf.name}</h3>
                            <p className="text-xs text-on-surface-variant/80 font-mono">Last updated: {new Date(wf.updated_at).toLocaleTimeString()}</p>
                          </div>
                        </div>

                        {/* Steps Connected List */}
                        <div className="flex items-center gap-2 mb-6">
                          <div className="flex -space-x-1.5">
                            {wf.nodes && wf.nodes.map((node, i) => (
                              <div key={node.id || i} className="w-7 h-7 rounded-full bg-surface-container-high border border-node-border flex items-center justify-center" title={node.title}>
                                <span className="material-symbols-outlined text-[14px] text-primary">{node.icon}</span>
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-on-surface-variant font-medium ml-1">
                            {wf.nodes ? wf.nodes.length : 0} steps connected
                          </span>
                        </div>

                        {/* Card actions footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-node-border/40">
                          <div className="flex gap-4 text-outline/80">
                            <button
                              onClick={() => {
                                setBuilderWorkflowId(wf.id);
                                setBuilderWorkflowName(wf.name);
                                setBuilderNodes(wf.nodes || []);
                                setActiveTab('builder');
                              }}
                              className="hover:text-primary material-symbols-outlined text-[20px]"
                              title="Edit in Canvas"
                            >
                              edit
                            </button>
                            <button
                              onClick={() => handleRunWorkflow(wf.id)}
                              className="hover:text-secondary material-symbols-outlined text-[20px]"
                              title="Simulate Run"
                            >
                              play_arrow
                            </button>
                            <button
                              onClick={() => handleDeleteWorkflow(wf.id)}
                              className="hover:text-error material-symbols-outlined text-[20px]"
                              title="Delete Workflow"
                            >
                              delete
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              setBuilderWorkflowId(wf.id);
                              setBuilderWorkflowName(wf.name);
                              setBuilderNodes(wf.nodes || []);
                              setActiveTab('builder');
                            }}
                            className="text-xs font-bold text-primary hover:underline group-hover:translate-x-1 transition-transform"
                          >
                            Edit Workflow
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Weekly Performance Insights */}
              <section className="pt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Volume latency conceptual chart */}
                <div className="lg:col-span-2 glass-card rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between hover-lift">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <span className="text-xs text-primary uppercase tracking-widest font-extrabold">Flow Performance</span>
                      <h4 className="text-lg font-bold mt-1 text-on-surface">Weekly Volumes vs Response times</h4>
                    </div>
                    <div className="flex gap-3 text-xs text-on-surface-variant font-semibold">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary/70"></span> Runs</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary/70"></span> Latency</span>
                    </div>
                  </div>

                  {/* Conceptual Chart SVG */}
                  <div className="h-44 w-full rounded-xl flex items-end justify-between px-2 pb-6 border-b border-node-border/40 relative">
                    <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                      {/* Latency line curve */}
                      <path d="M5 70 Q 25 50, 45 65 T 85 30 T 95 40" fill="none" stroke="#b0ceb2" strokeWidth="2.5" strokeDasharray="3 3"></path>
                      {/* Runs line curve */}
                      <path d="M5 80 Q 25 40, 45 50 T 85 20 T 95 30" fill="none" stroke="#a7cbeb" strokeWidth="3"></path>
                    </svg>
                    
                    {/* Render standard chart bars */}
                    {[
                      { day: 'Mon', height: 'h-[40%]' },
                      { day: 'Tue', height: 'h-[65%]' },
                      { day: 'Wed', height: 'h-[80%]' },
                      { day: 'Thu', height: 'h-[50%]' },
                      { day: 'Fri', height: 'h-[75%]' },
                      { day: 'Sat', height: 'h-[30%]' },
                      { day: 'Sun', height: 'h-[45%]' }
                    ].map((item, idx) => (
                      <div key={idx} className="w-[8%] bg-primary/10 hover:bg-primary/25 rounded-t transition-all cursor-pointer relative group flex flex-col justify-end h-full">
                        <div className={`w-full bg-primary/30 rounded-t ${item.height}`}></div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-3 text-xs text-on-surface-variant px-3 font-semibold font-mono">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>

                {/* Optimizations suggestion card */}
                <div className="glass-card rounded-3xl overflow-hidden flex flex-col bg-surface-container-low/40 border border-node-border/40 justify-between hover-lift">
                  <div className="h-32 bg-primary/10 relative overflow-hidden flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-primary opacity-50 absolute -right-4 -bottom-4 rotate-12">tips_and_updates</span>
                    <div className="p-5 w-full">
                      <span className="bg-secondary/20 text-secondary border border-secondary/30 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">
                        AI Guide's Advice
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-grow">
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-secondary shrink-0">insights</span>
                      <p className="text-xs text-on-surface leading-relaxed">
                        Your <span className="text-primary font-bold">Support Flow</span> has a 12% bottleneck at the <i>Slack Notification</i> step.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-tertiary shrink-0">speed</span>
                      <p className="text-xs text-on-surface leading-relaxed">
                        Batching your <i>Google Sheet</i> updates could reduce pipeline latency by <span className="text-tertiary font-bold">0.8s</span>.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => {
                        setGuideOpen(true);
                        setChatMessages(prev => [...prev, {
                          sender: 'guide',
                          message: 'I\'ve reviewed your Support Flow logs. We can optimize it by adding a buffer queue node before Slack or updating Google Sheets in batches. Would you like me to add a Batch queue node?',
                          time: 'Just now'
                        }]);
                      }}
                      className="w-full bg-surface-container-highest hover:bg-primary/20 hover:text-primary text-on-surface py-3 rounded-xl text-xs font-bold border border-node-border transition-all flex items-center justify-center gap-2"
                    >
                      Optimize Flow Now
                      <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                    </button>
                  </div>
                </div>

              </section>

            </div>
          )}

          {/* WORKFLOW CANVAS BUILDER PAGE */}
          {activeTab === 'builder' && (
            <div className="flex flex-col h-[calc(100vh-140px)] border border-node-border/40 rounded-3xl overflow-hidden glass-card animate-fade-in-up">
              
              {/* Canvas toolbar */}
              <div className="bg-surface-container-low px-6 py-4 border-b border-node-border/40 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 border border-primary/20 text-primary rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined">draw</span>
                  </div>
                  <div>
                    <input
                      type="text"
                      className="bg-transparent border-none border-b border-transparent hover:border-outline-variant focus:border-primary focus:ring-0 font-headline font-bold text-lg p-0 text-on-surface w-64"
                      value={builderWorkflowName}
                      onChange={e => setBuilderWorkflowName(e.target.value)}
                    />
                    <p className="text-xs text-on-surface-variant font-mono">Status: Draft (Unsaved changes will be lost)</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setBuilderNodes([]);
                      setSelectedNode(null);
                      showToast('Canvas cleared', 'delete');
                    }}
                    className="px-4 py-2 bg-surface-container-high hover:bg-error/10 hover:text-error text-on-surface-variant rounded-xl text-xs font-bold transition-all border border-node-border/30"
                  >
                    Clear Canvas
                  </button>
                  <button
                    onClick={handleSaveWorkflow}
                    className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                    Save Workflow
                  </button>
                  <button
                    onClick={() => handleRunWorkflow()}
                    className="px-5 py-2.5 bg-secondary text-on-secondary rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    Run Simulation
                  </button>
                </div>
              </div>

              {/* Canvas area split: Left builder sidebar library, Center canvas view */}
              <div className="flex-1 flex overflow-hidden relative">
                
                {/* Left block drawer library */}
                <div className="w-64 bg-surface-container-lowest/80 border-r border-node-border/30 p-5 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                  <span className="text-xs text-outline font-extrabold uppercase tracking-widest block mb-2">Drag Steps to Canvas</span>
                  
                  {[
                    { type: 'Trigger', title: 'Email Trigger', icon: 'mail', desc: 'Starts when an email is received', color: 'bg-sage-muted' },
                    { type: 'Webhook', title: 'Webhook Listener', icon: 'webhook', desc: 'Starts when an API call arrives', color: 'bg-sage-muted' },
                    { type: 'AI Agent', title: 'Gemini AI Agent', icon: 'neurology', desc: 'AI classification or recap step', color: 'bg-primary' },
                    { type: 'Condition', title: 'Priority Check', icon: 'call_split', desc: 'Conditional routing step', color: 'bg-tertiary' },
                    { type: 'Slack Notification', title: 'Slack Notify', icon: 'forum', desc: 'Post alerts directly to channels', color: 'bg-secondary' },
                    { type: 'Database', title: 'SQLite Record', icon: 'storage', desc: 'Write details to SQL tables', color: 'bg-tertiary' }
                  ].map(block => (
                    <div
                      key={block.type}
                      draggable
                      onDragStart={e => handleDragStart(e, block.type)}
                      onClick={() => addNodeToCanvas(block.type)}
                      className="p-3 bg-surface-container-low hover:bg-surface-container border border-node-border/40 hover:border-primary rounded-xl cursor-grab active:cursor-grabbing hover:shadow transition-all group flex gap-3 items-start"
                    >
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-node-border flex items-center justify-center shrink-0 text-primary">
                        <span className="material-symbols-outlined text-[20px]">{block.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-on-surface">{block.title}</h4>
                        <p className="text-[10px] text-on-surface-variant mt-0.5 leading-tight">{block.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Canvas grid wrapper */}
                <div
                  ref={canvasRef}
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleCanvasDrop}
                  className="flex-grow canvas-grid relative overflow-auto p-12 flex items-center justify-center min-h-[300px]"
                >
                  
                  {/* Dynamic Bezier Connection Lines SVG Overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#8b938b"></path>
                      </marker>
                    </defs>
                    
                    {/* Render connections between consecutive nodes */}
                    {builderNodes.map((node, i) => {
                      if (i === builderNodes.length - 1) return null;
                      
                      // Render connection curves
                      const xOffset = 280 + 48; // node width + gap spacing
                      const startX = 60 + i * xOffset + 280;
                      const startY = 150;
                      const endX = startX + 48;
                      const endY = 150;

                      return (
                        <path
                          key={node.id}
                          d={`M ${startX} ${startY} C ${startX + 24} ${startY}, ${endX - 24} ${endY}, ${endX} ${endY}`}
                          fill="none"
                          stroke="#8b938b"
                          strokeWidth="2.5"
                          markerEnd="url(#arrow)"
                          opacity="0.8"
                        />
                      );
                    })}
                  </svg>

                  {/* Flow Wrapper */}
                  {builderNodes.length === 0 ? (
                    <div className="text-center p-8 border-2 border-dashed border-node-border/50 rounded-2xl max-w-sm flex flex-col items-center bg-surface-container-low/50 z-10">
                      <span className="material-symbols-outlined text-4xl text-outline mb-2">drag_pan</span>
                      <p className="text-xs text-on-surface-variant font-medium">Drag components from the library or click them to append steps sequentially.</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-12 relative z-10 px-12">
                      {builderNodes.map((node, i) => (
                        <div
                          key={node.id}
                          onDoubleClick={() => setSelectedNode(node)}
                          className="w-[280px] bg-surface-container-lowest border border-node-border/60 rounded-2xl node-shadow p-5 relative hover:border-primary transition-all cursor-pointer hover:-translate-y-1 select-none flex flex-col justify-between"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-primary/10 border border-primary/20 text-primary rounded-xl flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[24px]">{node.icon}</span>
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] text-outline font-extrabold uppercase tracking-wider block">
                                {node.type}
                              </span>
                              <h3 className="font-headline font-semibold text-sm truncate text-on-surface">
                                {node.title}
                              </h3>
                            </div>
                          </div>

                          <div className="p-3 bg-surface-container-low border border-node-border/30 rounded-xl mb-4">
                            <p className="text-xs text-on-surface-variant leading-relaxed font-mono truncate">
                              {node.details}
                            </p>
                          </div>

                          {/* Delete/Config node overlays */}
                          <div className="flex justify-between items-center text-xs text-outline">
                            <button
                              onClick={() => setSelectedNode(node)}
                              className="hover:text-primary flex items-center gap-1 font-bold text-[11px]"
                            >
                              <span className="material-symbols-outlined text-[16px]">tune</span> Configure
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNodeFromCanvas(node.id);
                              }}
                              className="hover:text-error material-symbols-outlined text-[18px]"
                              title="Delete Step"
                            >
                              delete
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add button inline placeholder */}
                      <button
                        onClick={() => addNodeToCanvas('AI Agent')}
                        className="w-12 h-12 rounded-full border-2 border-dashed border-node-border/40 flex items-center justify-center text-outline hover:text-primary hover:border-primary hover:bg-surface-container-low transition-all shadow-inner hover:scale-105 active:scale-95 group shrink-0"
                        title="Add generic AI Agent node"
                      >
                        <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
                      </button>
                    </div>
                  )}

                </div>

              </div>

              {/* Node Inspector Drawer Overlay (Shown when selectedNode exists) */}
              {selectedNode && (
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-surface-container-low border-l border-node-border shadow-2xl z-30 p-6 flex flex-col justify-between animate-slide-in">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-node-border/40 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">{selectedNode.icon}</span>
                        <h4 className="font-headline font-bold text-on-surface">Step Configuration</h4>
                      </div>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="material-symbols-outlined text-outline hover:text-primary rounded-full p-1"
                      >
                        close
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold uppercase text-on-surface-variant block">Step Name</label>
                        <input
                          type="text"
                          className="w-full p-3 bg-surface-container border border-node-border/30 rounded-xl focus:ring-1 focus:ring-primary text-sm text-on-surface"
                          value={selectedNode.title}
                          onChange={e => handleUpdateNodeDetails(selectedNode.id, { title: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-extrabold uppercase text-on-surface-variant block">Configuration Details</label>
                        <textarea
                          className="w-full p-3 bg-surface-container border border-node-border/30 rounded-xl focus:ring-1 focus:ring-primary text-sm text-on-surface h-24 resize-none"
                          value={selectedNode.details}
                          onChange={e => handleUpdateNodeDetails(selectedNode.id, { details: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedNode(null)}
                    className="w-full bg-primary text-on-primary py-3 rounded-xl text-xs font-bold hover:brightness-110 transition-all active:scale-95"
                  >
                    Done Configured
                  </button>
                </div>
              )}

            </div>
          )}

          {/* CONNECTIONS LIBRARY PAGE */}
          {activeTab === 'connections' && (
            <div className="space-y-8 animate-fade-in-up">
              
              {/* Header block */}
              <div>
                <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-2">App Connections</h1>
                <p className="text-on-surface-variant font-body">Manage credentials, toggle sync pipelines, and reconnect active services.</p>
              </div>

              {/* Grid of integrations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {connections.map(conn => (
                  <div key={conn.id} className="bg-surface-container/60 border border-node-border/35 p-6 rounded-2xl flex flex-col justify-between hover-lift">
                    
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-surface-container-highest border border-node-border flex items-center justify-center rounded-xl text-3xl shadow-sm" style={{ color: conn.color }}>
                        <span className="material-symbols-outlined text-[32px]">{conn.icon}</span>
                      </div>
                      
                      {/* Connection status badge */}
                      <button
                        onClick={() => handleToggleConnection(conn.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold border flex items-center gap-1.5 transition-all ${
                          conn.status === 'Connected'
                            ? 'bg-secondary/15 text-secondary border-secondary/20 hover:bg-secondary/25'
                            : conn.status === 'Token Expired'
                            ? 'bg-error/15 text-error border-error/20 hover:bg-error/25'
                            : 'bg-surface-container-highest text-outline border-node-border hover:bg-surface-container-low'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${conn.status === 'Connected' ? 'bg-secondary' : conn.status === 'Token Expired' ? 'bg-error animate-pulse' : 'bg-outline'}`}></span>
                        {conn.status}
                      </button>
                    </div>

                    <div className="flex-grow mb-6">
                      <h3 className="font-headline font-semibold text-lg text-on-surface mb-1.5">{conn.name}</h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{conn.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-node-border/30">
                      <span className="text-[10px] text-on-surface-variant font-semibold font-mono">
                        {conn.last_synced ? `Synced ${conn.last_synced}` : 'Never synced'}
                      </span>
                      {conn.status === 'Token Expired' ? (
                        <button
                          onClick={() => {
                            setShowConnectModal(conn);
                            setApiKeyInput('');
                          }}
                          className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all"
                        >
                          Reconnect
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setShowConnectModal(conn);
                            setApiKeyInput('');
                          }}
                          className="px-4 py-2 hover:bg-primary/10 text-primary text-xs font-bold rounded-lg transition-all"
                        >
                          Manage
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TEMPLATE GALLERY PAGE */}
          {activeTab === 'templates' && (
            <div className="space-y-8 animate-fade-in-up">
              
              {/* Header block */}
              <div>
                <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-2">Pre-built Guides</h1>
                <p className="text-on-surface-variant font-body">Duplicate a verified integration recipe directly into your workspace canvas.</p>
              </div>

              {/* Grid of cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(tpl => (
                  <div key={tpl.id} className="bg-surface-container/60 border border-node-border/35 p-6 rounded-2xl flex flex-col justify-between hover-lift group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                        <span className="material-symbols-outlined text-[28px]">{tpl.icon}</span>
                      </div>
                      <span className="px-2.5 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-extrabold rounded-full uppercase tracking-widest">
                        Recipe
                      </span>
                    </div>

                    <div className="mb-6 flex-grow">
                      <h3 className="font-headline font-semibold text-lg text-on-surface mb-2">{tpl.name}</h3>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{tpl.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-node-border/30">
                      <div className="flex items-center gap-1.5 text-[10px] text-outline font-semibold">
                        <span className="material-symbols-outlined text-[16px]">tune</span>
                        {tpl.nodes ? tpl.nodes.length : 0} nodes
                      </div>
                      <button
                        onClick={() => handleUseTemplate(tpl)}
                        className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all group-hover:scale-105 active:scale-95 shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Use Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* RUN LOGS HISTORY PAGE */}
          {activeTab === 'history' && (
            <div className="space-y-8 animate-fade-in-up">
              
              {/* Header block */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-2">Execution Run Logs</h1>
                  <p className="text-on-surface-variant font-body">Trace historical payload latency, steps success, and automatic error retry codes.</p>
                </div>
                <button
                  onClick={handleClearHistory}
                  className="px-4 py-2 bg-error-container text-on-error-container border border-error/20 hover:bg-error-container/70 rounded-xl text-xs font-bold transition-all"
                >
                  Clear All Logs
                </button>
              </div>

              {/* Log row entries */}
              {history.length === 0 ? (
                <div className="glass-card p-10 text-center rounded-2xl flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl text-outline/50 mb-2">history_toggle_off</span>
                  <p className="text-xs text-on-surface-variant font-medium">No system runs registered yet. Run some pipelines in the Canvas Builder first!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map(log => (
                    <div key={log.id} className="glass-card p-5 rounded-2xl hover:border-primary/20 transition-all flex flex-col gap-4">
                      
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex gap-3 items-center">
                          <span className={`material-symbols-outlined ${log.status === 'Success' ? 'text-secondary bg-secondary/10' : 'text-error bg-error/10'} p-2 rounded-lg`}>
                            {log.status === 'Success' ? 'check_circle' : 'error'}
                          </span>
                          <div>
                            <h4 className="font-headline font-bold text-sm">{log.workflow_name}</h4>
                            <p className="text-[10px] text-on-surface-variant/80 font-mono mt-0.5">{new Date(log.timestamp).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded">
                            Latency: {log.speed}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            log.status === 'Success' ? 'bg-secondary/15 text-secondary' : 'bg-error/15 text-error'
                          }`}>
                            {log.status}
                          </span>
                        </div>
                      </div>

                      {/* Execution pathway tree */}
                      <div className="bg-surface-container-low/50 border border-node-border/30 rounded-xl p-4">
                        <span className="text-[10px] text-outline font-extrabold uppercase tracking-wider block mb-3">Step execution logs:</span>
                        
                        <div className="space-y-3 font-mono text-xs">
                          {log.steps && log.steps.map((step, i) => (
                            <div key={i} className="flex justify-between items-start gap-4 border-b border-node-border/10 pb-2 last:border-b-0 last:pb-0">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${step.status === 'Success' ? 'bg-secondary' : 'bg-error animate-pulse'}`}></span>
                                <span className="font-bold">{step.name}</span>
                              </div>
                              <div className="flex items-center gap-3 text-right">
                                <span className="text-on-surface-variant truncate max-w-md">{step.message}</span>
                                <span className="text-[10px] text-outline shrink-0">{step.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* SETTINGS PAGE */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-fade-in-up">
              
              {/* Header block */}
              <div>
                <h1 className="font-headline text-3xl font-extrabold text-on-surface mb-2">Account Settings</h1>
                <p className="text-on-surface-variant font-body">Configure workspace profile variables and notification thresholds.</p>
              </div>

              {/* Form container */}
              <div className="glass-card rounded-2xl p-8 max-w-2xl space-y-6">
                
                {/* Profile header upload */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-node-border/40">
                  <div className="relative group/avatar">
                    <div className="w-24 h-24 rounded-full border-4 border-node-border overflow-hidden shadow">
                      <img
                        className="w-full h-full object-cover"
                        src={settings.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAb_cW07ERtOIaRCO03aAHemDO7I_elYSTszKSzcaQSZqnVDU9EnldP6L_bJFpyAS1ASKphLjb7AWgibQ_tl95DQbaFmbhfqPIo1nWS8cuWrCiivrxfmTjU6u5Zh0qPoEKgnjid4hXsHkACUCRtIqKY7GWlOzZGnDXtGcIJS48HVoQZitCbdLKOYUjljBvddeeRdcob2Ohy-mLlIl3DIHgq2nhqFRQfDMVmxssZeOS5M3Ksgb5q4QzV0Q"}
                      />
                    </div>
                    <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer text-center p-1">
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      <span className="text-[9px] font-extrabold mt-0.5">UPDATE</span>
                      <input accept="image/*" className="hidden" type="file" onChange={handleAvatarChange} />
                    </label>
                  </div>
                  
                  <div className="text-center sm:text-left">
                    <h3 className="font-headline font-bold text-lg">{settings.name}</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">{settings.email} • Workspace Admin</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase">Full Name</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-surface-container border border-node-border/30 rounded-xl focus:ring-1 focus:ring-primary text-sm text-on-surface"
                      value={settings.name}
                      onChange={e => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase">Email Address</label>
                    <input
                      type="email"
                      className="w-full p-3 bg-surface-container border border-node-border/30 rounded-xl focus:ring-1 focus:ring-primary text-sm text-on-surface"
                      value={settings.email}
                      onChange={e => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase">Timezone</label>
                    <select
                      className="w-full p-3 bg-surface-container border border-node-border/30 rounded-xl focus:ring-1 focus:ring-primary text-sm text-on-surface"
                      value={settings.timezone}
                      onChange={e => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    >
                      <option>EST (GMT-5)</option>
                      <option>PST (GMT-8)</option>
                      <option>GMT (GMT+0)</option>
                      <option>CET (GMT+1)</option>
                    </select>
                  </div>
                </div>

                {/* Notifications checkboxes */}
                <div className="space-y-4 pt-4 border-t border-node-border/40">
                  <span className="text-xs font-bold text-on-surface-variant uppercase block">Pipeline Notification Settings</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    {[
                      { key: 'runs', label: 'Notify on successful runs' },
                      { key: 'errors', label: 'Alert on system/node errors' },
                      { key: 'updates', label: 'Send monthly optimization updates' },
                      { key: 'security', label: 'Send security/connection updates' }
                    ].map(item => (
                      <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded bg-surface-container border-node-border/30 text-primary focus:ring-1 focus:ring-primary"
                          checked={settings.notifications[item.key] || false}
                          onChange={e => setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, [item.key]: e.target.checked }
                          }))}
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => handleSaveSettings(settings)}
                    className="px-6 py-3 bg-primary text-on-primary rounded-xl text-xs font-bold hover:brightness-110 transition-all active:scale-95 shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Right Docked Co-Pilot Sidebar: The Guide */}
        {guideOpen && (
          <aside className="w-full lg:w-sidebar-width shrink-0 z-30">
            <div className="sticky top-24 bg-surface-container-low border border-node-border/40 rounded-3xl h-[calc(100vh-140px)] flex flex-col p-6 shadow-xl overflow-hidden justify-between">
              
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  </div>
                  <div>
                    <h2 className="font-headline font-bold text-sm text-on-surface">The Guide</h2>
                    <p className="text-[10px] text-on-surface-variant font-mono">Organic Co-pilot • Online</p>
                  </div>
                  <button
                    onClick={() => setGuideOpen(false)}
                    className="material-symbols-outlined ml-auto p-1.5 text-outline hover:text-primary rounded-full hover:bg-surface-container-high transition-colors text-[20px]"
                    title="Close Sidebar"
                  >
                    close
                  </button>
                </div>

                {/* Chat window list */}
                <div className="h-[calc(100vh-390px)] overflow-y-auto custom-scrollbar space-y-4 pr-1.5 pb-2">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-4 rounded-2xl max-w-[90%] text-xs border ${
                        msg.sender === 'user'
                          ? 'bg-surface-container-high border-node-border/30 rounded-tr-none text-on-surface'
                          : 'bg-warm-sand/30 border-orange-900/10 rounded-tl-none text-on-surface leading-relaxed'
                      }`}>
                        {msg.message}
                      </div>
                      <span className="text-[9px] text-outline font-mono px-1">{msg.sender === 'user' ? 'You' : 'The Guide'} • {msg.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input footer */}
              <div className="pt-4 border-t border-node-border/40">
                <form onSubmit={handleGuideChat} className="relative">
                  <textarea
                    rows="2"
                    className="w-full bg-surface-container-lowest border border-node-border/30 rounded-xl py-3 pl-4 pr-12 text-xs focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline/70 resize-none h-16"
                    placeholder="Ask standard inputs like 'Add a slack node' or 'reset canvas'..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleGuideChat(e);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-on-primary rounded-lg flex items-center justify-center active:scale-90 transition-transform shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </button>
                </form>
              </div>

            </div>
          </aside>
        )}

      </main>

      {/* Floating toast notification banner */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-surface-container-lowest border border-primary/20 shadow-2xl flex items-center gap-3 transition-all duration-500 z-[99] ${
        toast.show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
      }`}>
        <span className="material-symbols-outlined text-primary text-[20px]">{toast.icon}</span>
        <span className="text-xs font-bold text-on-surface">{toast.message}</span>
      </div>

      {/* Connection credentials / OAuth overlay modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
          <div className="bg-surface-container-low border border-node-border/40 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-scale-up">
            
            <div className="flex justify-between items-center border-b border-node-border/40 pb-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[28px]" style={{ color: showConnectModal.color }}>{showConnectModal.icon}</span>
                <h3 className="font-headline font-bold text-lg text-on-surface">Manage {showConnectModal.name}</h3>
              </div>
              <button onClick={() => setShowConnectModal(null)} className="material-symbols-outlined text-outline hover:text-primary p-1">close</button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Connect FlowGuide with your {showConnectModal.name} credentials. Enter your developer token or webhook integration key below:
              </p>
              
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase text-on-surface-variant block">API Integration Key</label>
                <input
                  type="password"
                  placeholder="Paste credentials token (e.g., xoxb-...)"
                  className="w-full p-3 bg-surface-container border border-node-border/30 rounded-xl focus:ring-1 focus:ring-primary text-xs font-mono text-on-surface"
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-node-border/40">
              <button
                onClick={() => setShowConnectModal(null)}
                className="px-4 py-2 hover:bg-surface-container-high text-on-surface-variant text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleReconnectConnection}
                disabled={isConnecting}
                className="px-5 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl flex items-center gap-2 hover:brightness-110 active:scale-95 shadow-sm disabled:opacity-50"
              >
                {isConnecting ? 'Authenticating...' : 'Save & Connect'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
