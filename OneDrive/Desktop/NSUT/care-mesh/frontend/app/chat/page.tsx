'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Shield, Phone, ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

type RiskTier = 'green' | 'yellow' | 'red';

interface Message {
  id: number;
  role: 'ai' | 'user';
  content: string;
  risk?: RiskTier;
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

const INITIAL: Message = {
  id: 0,
  role: 'ai',
  content: "Hi — I'm here with you. Say whatever is on your mind. This is a private space; take your time.",
};

const RED_COPY =
  "You're not alone. It sounds like you may need immediate human support. Please use one of the options below.";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tier, setTier] = useState<RiskTier>('green');
  const [redLock, setRedLock] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading || redLock) return;
      const userMsg: Message = { id: Date.now(), role: 'user', content: text.trim() };
      setMessages((p) => [...p, userMsg]);
      setInput('');
      setLoading(true);

      try {
        const res = await fetch(`${BACKEND}/api/v1/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text.trim() }),
        });
        const data = await res.json();
        const newTier: RiskTier = data.risk ?? 'green';
        setTier(newTier);

        if (newTier === 'red') {
          setRedLock(true);
          setMessages((p) => [
            ...p,
            { id: Date.now() + 1, role: 'ai', content: data.reply || RED_COPY, risk: 'red' },
          ]);
        } else {
          setMessages((p) => [
            ...p,
            { id: Date.now() + 1, role: 'ai', content: data.reply, risk: newTier },
          ]);
        }
      } catch {
        // Demo fallback when backend is offline
        const lower = text.toLowerCase();
        let mockRisk: RiskTier = 'green';
        if (/kill myself|want to die|suicide|end it all/.test(lower)) mockRisk = 'red';
        else if (/hopeless|panic|can't sleep|stressed|worthless/.test(lower)) mockRisk = 'yellow';

        setTier(mockRisk);
        if (mockRisk === 'red') {
          setRedLock(true);
          setMessages((p) => [...p, { id: Date.now() + 1, role: 'ai', content: RED_COPY, risk: 'red' }]);
        } else if (mockRisk === 'yellow') {
          setMessages((p) => [
            ...p,
            {
              id: Date.now() + 1,
              role: 'ai',
              content:
                "That sounds really heavy. I'm here with you. Would talking to a real person help right now?",
              risk: 'yellow',
            },
          ]);
        } else {
          setMessages((p) => [
            ...p,
            {
              id: Date.now() + 1,
              role: 'ai',
              content:
                "Thank you for sharing that. I'm listening. What would feel most helpful in this moment?",
              risk: 'green',
            },
          ]);
        }
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [loading, redLock],
  );

  return (
    <div className="flex flex-col h-[calc(100dvh-40px)] md:h-[calc(100vh-42px)] bg-background">
      <header className="shrink-0 border-b border-outline-variant/25 bg-surface-lowest/90 backdrop-blur-md px-4 md:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="p-2 rounded-full hover:bg-surface-low text-on-surface-variant min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Leave chat"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2 text-label-md text-on-surface truncate">
            <Shield size={16} className="text-primary shrink-0" />
            <span className="truncate">AI + human support · Emergency: 112</span>
          </div>
        </div>
        <Link href="/" className="text-label-md text-on-surface-variant hover:text-primary shrink-0 px-2 py-2">
          Leave
        </Link>
      </header>

      {tier === 'yellow' && !redLock && (
        <div className="shrink-0 mx-4 md:mx-6 mt-3 rounded-2xl bg-secondary-container/80 border border-outline-variant/30 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <p className="text-body-md text-on-surface">
            Would talking to a real person help? You can be connected now.
          </p>
          <div className="flex gap-2 shrink-0">
            <Link href="/therapists">
              <Button size="sm">Talk to a counsellor</Button>
            </Link>
            <Link href="/help">
              <Button size="sm" variant="secondary">
                Help nearby
              </Button>
            </Link>
          </div>
        </div>
      )}

      {redLock && (
        <div className="shrink-0 mx-4 md:mx-6 mt-3 rounded-2xl bg-error-container/80 border border-error/20 px-5 py-5 space-y-4">
          <div>
            <h2 className="font-display text-headline-md text-on-surface mb-1">You&apos;re not alone.</h2>
            <p className="text-body-md text-on-error-container">
              It sounds like you may need immediate human support.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="tel:112">
              <Button variant="danger">
                <Phone size={16} /> Call 112
              </Button>
            </a>
            <Link href="/help">
              <Button variant="secondary">
                <MapPin size={16} /> Find help nearby
              </Button>
            </Link>
            <Link href="/therapists">
              <Button variant="outline">Connect with a counsellor</Button>
            </Link>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-3xl px-5 py-3.5 text-body-md leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-secondary-container text-on-surface rounded-br-lg'
                    : 'bg-primary-fixed/55 text-on-surface rounded-bl-lg'
                }`}
              >
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div className="bg-primary-fixed/40 rounded-3xl rounded-bl-lg px-5 py-4 flex gap-1.5 items-center">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {!redLock && (
        <div className="shrink-0 border-t border-outline-variant/25 bg-surface-lowest p-3 md:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <form
            className="max-w-3xl mx-auto flex items-end gap-2 bg-surface-low rounded-card border border-outline-variant/30 px-3 py-2 shadow-ambient"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Say whatever is on your mind..."
              className="flex-1 resize-none bg-transparent border-0 outline-none text-body-md py-2.5 px-2 max-h-32 placeholder:text-on-surface-variant/60"
              aria-label="Message"
            />
            <button
              type="button"
              className="rounded-full p-3 text-on-surface-variant hover:bg-surface-high min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Voice input (demo)"
              title="Demo feature — voice on /call"
              onClick={() => {
                window.location.href = '/call';
              }}
            >
              <Mic size={18} />
            </button>
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="rounded-full bg-primary text-on-primary p-3 min-h-[44px] min-w-[44px] flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-40"
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
