'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, MicOff, Phone } from 'lucide-react';
import { chatService } from '@/services';
import type { RiskTier } from '@/types';

interface Message {
  id: number;
  role: 'ai' | 'user';
  content: string;
  risk?: RiskTier;
}

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onRiskChange?: (tier: RiskTier) => void;
  onCrisisDetected?: () => void;
}

const WELCOME: Message = {
  id: 0,
  role: 'ai',
  content: "Hi, I'm here for you. How are you feeling right now? You can share anything — this is a safe, private space.",
};

const HELPLINES = [
  { name: 'iCall', number: '9152987821' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345' },
  { name: 'SNEHI', number: '044-24640050' },
];

export default function AISidebar({ isOpen, onClose, onRiskChange, onCrisisDetected }: AISidebarProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await chatService.send(text);
      const tier: RiskTier = data.risk ?? 'green';
      const aiMsg: Message = { id: Date.now() + 1, role: 'ai', content: data.reply, risk: tier };
      setMessages(prev => [...prev, aiMsg]);
      onRiskChange?.(tier);
      if (tier === 'red') onCrisisDetected?.();
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'ai',
        content: "I'm having trouble connecting right now. If you're in crisis, please call 112 immediately.",
        risk: 'green',
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading, onRiskChange, onCrisisDetected]);

  const toggleVoice = () => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      sendMessage(t);
    };
    rec.onend = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  };

  const riskLabel: Record<RiskTier, string> = { green: '🟢 Safe', yellow: '🟡 Support', red: '🔴 Crisis' };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="sidebar"
          initial={{ x: '110%' }}
          animate={{ x: 0 }}
          exit={{ x: '110%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 260 }}
          className="fixed right-0 top-0 h-full w-[360px] max-w-full bg-surface-container-lowest border-l border-outline-variant/30 shadow-card z-[70] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between bg-primary-container/8 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center animate-orb-breathe">
                <span className="text-on-primary text-lg">✦</span>
              </div>
              <div>
                <h2 className="font-display text-headline-md text-primary leading-tight">SoulCare</h2>
                <p className="text-label-sm text-on-surface-variant">Always here to listen</p>
              </div>
            </div>
            <button onClick={onClose} className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-lg hover:bg-secondary-container/40">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`flex flex-col gap-1 max-w-[88%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
                >
                  <div className={`p-3.5 rounded-2xl text-body-md leading-relaxed ${
                    msg.role === 'ai'
                      ? 'bg-primary-container text-on-primary rounded-tl-none'
                      : 'bg-secondary-container text-on-secondary-container rounded-tr-none'
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === 'ai' && msg.risk && (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full self-start risk-${msg.risk}`}>
                      {riskLabel[msg.risk]}
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 p-3 bg-primary-container rounded-2xl rounded-tl-none self-start">
                <span className="dot" /><span className="dot" /><span className="dot" />
              </motion.div>
            )}

            {/* Helpline card (shown after yellow message) */}
            {messages.some(m => m.risk === 'yellow') && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-tertiary-fixed/60 rounded-2xl p-4 border border-tertiary-fixed-dim"
              >
                <p className="font-label-md text-label-md text-on-surface mb-3 flex items-center gap-2">
                  <Phone size={14} /> Verified Helplines (India)
                </p>
                {HELPLINES.map(h => (
                  <a key={h.name} href={`tel:${h.number}`}
                    className="flex justify-between items-center py-2 border-b border-outline-variant/30 last:border-0 text-body-md hover:text-primary transition-colors">
                    <span>{h.name}</span>
                    <span className="font-label-md text-primary">{h.number}</span>
                  </a>
                ))}
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="p-4 border-t border-outline-variant/30 bg-surface-container-lowest flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage(input))}
                placeholder="Type a message…"
                className="flex-1 bg-surface-container-low rounded-full py-2.5 pl-4 pr-3 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50 transition"
              />
              <button onClick={toggleVoice}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  listening ? 'bg-error text-on-error animate-pulse' : 'bg-secondary-container text-secondary hover:bg-secondary-container/70'
                }`}>
                {listening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-9 h-9 bg-primary text-on-primary rounded-full flex items-center justify-center hover:bg-primary-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
