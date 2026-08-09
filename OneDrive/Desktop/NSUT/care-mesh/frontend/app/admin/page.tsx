'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

type Risk = 'green' | 'yellow' | 'red';

interface SessionRow {
  id: string;
  risk: Risk;
  timestamp: string;
  rule: string;
  state: string;
}

const DEMO_SESSIONS: SessionRow[] = [
  { id: 'sess_9f2a', risk: 'red', timestamp: '2 min ago', rule: 'keyword:want to die', state: 'Awaiting human' },
  { id: 'sess_3c11', risk: 'red', timestamp: '8 min ago', rule: 'keyword:kill myself', state: 'Alerted' },
  { id: 'sess_77b0', risk: 'yellow', timestamp: '12 min ago', rule: 'keyword:hopeless', state: 'AI + offer' },
  { id: 'sess_a401', risk: 'yellow', timestamp: '18 min ago', rule: 'keyword:panic', state: 'AI + offer' },
  { id: 'sess_b220', risk: 'yellow', timestamp: '25 min ago', rule: 'keyword:stressed', state: 'AI active' },
  { id: 'sess_c019', risk: 'yellow', timestamp: '31 min ago', rule: 'keyword:can\'t sleep', state: 'AI active' },
  { id: 'sess_d880', risk: 'yellow', timestamp: '40 min ago', rule: 'keyword:worthless', state: 'AI active' },
  ...Array.from({ length: 18 }).map((_, i) => ({
    id: `sess_g${i}`,
    risk: 'green' as Risk,
    timestamp: `${45 + i} min ago`,
    rule: '—',
    state: 'AI active',
  })),
];

export default function AdminPage() {
  const [sessions, setSessions] = useState(DEMO_SESSIONS);
  const [wsNote, setWsNote] = useState('Demo mode — live WS when backend connected');

  useEffect(() => {
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';
    const wsUrl = BACKEND.replace(/^http/, 'ws') + '/ws/admin';
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(wsUrl);
      ws.onopen = () => setWsNote('Connected to admin alerts');
      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          setSessions((prev) => [
            {
              id: data.session_id || `sess_${Date.now()}`,
              risk: (data.risk || 'red') as Risk,
              timestamp: 'just now',
              rule: data.rule || 'server alert',
              state: 'Awaiting human',
            },
            ...prev,
          ]);
        } catch {
          /* ignore */
        }
      };
      ws.onerror = () => setWsNote('Demo mode — live WS when backend connected');
    } catch {
      setWsNote('Demo mode — live WS when backend connected');
    }
    return () => ws?.close();
  }, []);

  const counts = {
    red: sessions.filter((s) => s.risk === 'red').length,
    yellow: sessions.filter((s) => s.risk === 'yellow').length,
    green: sessions.filter((s) => s.risk === 'green').length,
  };

  const ordered = [...sessions].sort((a, b) => {
    const order = { red: 0, yellow: 1, green: 2 };
    return order[a.risk] - order[b.risk];
  });

  return (
    <div className="min-h-screen bg-surface-low">
      <header className="bg-surface-lowest border-b border-outline-variant/30 px-5 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-display font-semibold text-primary">SoulCare</Link>
          <span className="text-label-md text-on-surface-variant">Counsellor console</span>
        </div>
        <Badge variant="muted">{wsNote}</Badge>
      </header>

      <div className="max-w-5xl mx-auto px-5 md:px-8 py-8">
        <h1 className="font-display text-headline-lg mb-6">Live sessions</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'RED', n: counts.red, cls: 'bg-error-container text-on-error-container' },
            { label: 'YELLOW', n: counts.yellow, cls: 'bg-secondary-container text-on-secondary-container' },
            { label: 'GREEN', n: counts.green, cls: 'bg-primary-fixed text-on-primary-fixed' },
          ].map((c) => (
            <Card key={c.label} className={cn('text-center', c.cls)}>
              <p className="text-label-md opacity-80">{c.label}</p>
              <p className="font-display text-3xl mt-1">{c.n}</p>
            </Card>
          ))}
        </div>

        <div className="bg-surface-lowest rounded-card border border-outline-variant/30 overflow-hidden">
          <table className="w-full text-left text-label-md">
            <thead className="bg-surface-low text-on-surface-variant">
              <tr>
                <th className="px-4 py-3 font-medium">Risk</th>
                <th className="px-4 py-3 font-medium">Timestamp</th>
                <th className="px-4 py-3 font-medium">Session</th>
                <th className="px-4 py-3 font-medium">Triggered rule</th>
                <th className="px-4 py-3 font-medium">State</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {ordered.map((s) => (
                <tr key={s.id} className="border-t border-outline-variant/20">
                  <td className="px-4 py-3">
                    <span className={cn('rounded-full px-2.5 py-1 text-label-sm font-semibold uppercase', `risk-${s.risk}`)}>
                      {s.risk}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">{s.timestamp}</td>
                  <td className="px-4 py-3 font-mono text-sm">{s.id}</td>
                  <td className="px-4 py-3">{s.rule}</td>
                  <td className="px-4 py-3">{s.state}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/sessions/${s.id}`}>
                      <Button size="sm">Take over session</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
