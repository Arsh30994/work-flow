'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function AdminSessionPage() {
  const { id } = useParams<{ id: string }>();
  const [taken, setTaken] = useState(false);
  const [reply, setReply] = useState('');
  const [thread, setThread] = useState([
    { role: 'user', text: '(Demo) User message that triggered escalation.' },
    { role: 'system', text: 'AI paused. Awaiting counsellor.' },
  ]);

  return (
    <div className="min-h-screen bg-surface-low">
      <header className="bg-surface-lowest border-b border-outline-variant/30 px-5 h-14 flex items-center gap-4">
        <Link href="/admin" className="text-label-md text-on-surface-variant hover:text-primary">← Live sessions</Link>
        <span className="font-mono text-sm">{id}</span>
        <Badge variant="error">RED</Badge>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">
        <Card>
          <h1 className="font-display text-headline-md mb-2">Session takeover</h1>
          <p className="text-body-md text-on-surface-variant mb-4">
            When you take over, AI stops and you become the human in the loop.
          </p>
          {!taken ? (
            <Button onClick={() => {
              setTaken(true);
              setThread((t) => [...t, { role: 'system', text: 'AI → Human counsellor. You are connected.' }]);
            }}>
              Take over session
            </Button>
          ) : (
            <Badge variant="success">Human counsellor active</Badge>
          )}
        </Card>

        <Card className="space-y-3 min-h-[240px]">
          {thread.map((m, i) => (
            <p key={i} className={m.role === 'user' ? 'text-on-surface' : 'text-on-surface-variant text-label-md'}>
              <strong className="capitalize">{m.role}: </strong>
              {m.text}
            </p>
          ))}
        </Card>

        {taken && (
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!reply.trim()) return;
              setThread((t) => [...t, { role: 'counsellor', text: reply.trim() }]);
              setReply('');
            }}
          >
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write a calm reply…"
              className="flex-1 rounded-input border border-outline-variant/40 px-4 py-3 outline-none focus:ring-2 focus:ring-primary-fixed"
            />
            <Button type="submit">Send</Button>
          </form>
        )}
      </div>
    </div>
  );
}
