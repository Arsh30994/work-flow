'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

type RiskTier = 'green' | 'yellow' | 'red';

interface VoiceMicOrbProps {
  onTranscript?: (text: string) => void;
  onRiskChange?: (tier: RiskTier) => void;
  onCrisisDetected?: () => void;
  sidebarOpen?: boolean;
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

export default function VoiceMicOrb({
  onTranscript,
  onRiskChange,
  onCrisisDetected,
  sidebarOpen = false,
}: VoiceMicOrbProps) {
  const [listening, setListening] = useState(false);
  const [tier, setTier] = useState<RiskTier>('green');
  const [label, setLabel] = useState('');
  const recognitionRef = useRef<any>(null);

  const tierColors: Record<RiskTier, string> = {
    green:  'from-primary to-primary-container',
    yellow: 'from-yellow-500 to-yellow-400',
    red:    'from-error to-red-400',
  };

  const sendTranscript = useCallback(async (text: string) => {
    onTranscript?.(text);
    try {
      const res = await fetch(`${BACKEND}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const newTier: RiskTier = data.risk ?? 'green';
      setTier(newTier);
      onRiskChange?.(newTier);
      if (newTier === 'red') onCrisisDetected?.();
    } catch {}
  }, [onTranscript, onRiskChange, onCrisisDetected]);

  const toggle = () => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition is not supported in this browser. Try Chrome or Edge.'); return; }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      setLabel('');
      return;
    }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results as any[])
        .map((r: any) => r[0].transcript).join('');
      setLabel(transcript);
      if (e.results[e.results.length - 1].isFinal) {
        sendTranscript(transcript);
        setLabel('');
      }
    };
    rec.onend = () => { setListening(false); setLabel(''); };
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  };

  return (
    <div
      className="fixed bottom-16 z-[60] transition-all duration-500"
      style={{ right: sidebarOpen ? '376px' : '32px' }}
    >
      {/* Live transcript bubble */}
      <AnimatePresence>
        {label && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-3 bg-surface-container-highest text-on-surface px-3 py-2 rounded-2xl text-label-sm shadow-ambient max-w-[220px] whitespace-pre-wrap"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group cursor-pointer" onClick={toggle}>
        {/* Pulse rings */}
        {listening && (
          <>
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring" />
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
          </>
        )}
        {/* Orb */}
        <button className={`relative w-16 h-16 bg-gradient-to-br ${tierColors[tier]} rounded-full flex items-center justify-center shadow-ambient hover:scale-110 active:scale-95 transition-transform duration-200 focus:outline-none`}>
          {listening ? (
            <MicOff size={26} className="text-on-primary" />
          ) : (
            <Mic size={26} className="text-on-primary" />
          )}
          {/* Inner glow ring */}
          <span className="absolute inset-0 border-2 border-on-primary/20 rounded-full animate-ping opacity-20" />
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-surface-container-highest text-on-surface px-3 py-1.5 rounded-lg text-label-sm shadow-ambient whitespace-nowrap">
            {listening ? 'Tap to stop' : 'Voice Assistant'}
          </div>
        </div>
      </div>
    </div>
  );
}
