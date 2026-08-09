'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, PhoneOff, Phone, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const BreathingOrb3D = dynamic(() => import('../components/BreathingOrb3D'), { ssr: false });

type CallStatus = 'disconnected' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'ended';
type RiskTier = 'green' | 'yellow' | 'red' | 'idle';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

export default function CallPage() {
  const [status, setStatus] = useState<CallStatus>('disconnected');
  const [tier, setTier] = useState<RiskTier>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop everything
  const stopAll = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    }
  }, []);

  // Speak AI reply
  const speakText = useCallback((text: string, onEndCallback: () => void) => {
    if (typeof window === 'undefined' || !isSpeakerOn) {
      onEndCallback();
      return;
    }
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.onend = () => {
      onEndCallback();
    };
    utterance.onerror = () => {
      onEndCallback();
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSpeakerOn]);

  // Handle message processing
  const processUserSpeech = useCallback(async (text: string) => {
    if (!text.trim()) {
      // If empty, restart listening
      startListening();
      return;
    }
    setStatus('speaking');
    setResponse('Thinking...');

    try {
      const res = await fetch(`${BACKEND}/api/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const newTier: RiskTier = data.risk ?? 'green';
      setTier(newTier);
      setResponse(data.reply);

      if (newTier === 'red') {
        setStatus('ended');
        speakText("A crisis has been detected. We are connecting you to immediate emergency services. Please call 112.", () => {
          stopAll();
        });
      } else {
        speakText(data.reply, () => {
          startListening();
        });
      }
    } catch {
      const errText = "I'm having trouble connecting right now. Please check your internet connection.";
      setResponse(errText);
      speakText(errText, () => {
        startListening();
      });
    }
  }, [speakText, stopAll]);

  // Start continuous speech recognition
  const startListening = useCallback(() => {
    if (typeof window === 'undefined' || isMuted || status === 'ended') return;

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    stopAll();

    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => {
      setStatus('listening');
      setTranscript('Listening...');
    };

    rec.onresult = (e: any) => {
      const resultText = e.results[0][0].transcript;
      setTranscript(resultText);
      processUserSpeech(resultText);
    };

    rec.onerror = () => {
      // In case of error (no speech, etc.), retry listening
      setTimeout(startListening, 1000);
    };

    rec.onend = () => {
      // Automatically restart if it stops without results
      if (status === 'listening') {
        setStatus('connected');
      }
    };

    rec.start();
    recognitionRef.current = rec;
  }, [isMuted, status, processUserSpeech, stopAll]);

  // Connect Call
  const handleConnect = () => {
    setStatus('connecting');
    setTier('green');
    setTimeout(() => {
      setStatus('connected');
      const welcome = "Hello, I'm your SoulCare companion. How are you feeling today?";
      setResponse(welcome);
      speakText(welcome, () => {
        startListening();
      });
    }, 1500);
  };

  // Disconnect Call
  const handleDisconnect = () => {
    stopAll();
    setStatus('ended');
    setTier('idle');
    setTranscript('');
    setResponse('Call ended. Take care of yourself.');
  };

  // Toggle Mute
  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (next) {
        recognitionRef.current?.stop();
        setStatus('connected');
      } else {
        setTimeout(startListening, 200);
      }
      return next;
    });
  };

  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  // Get status color ring
  const statusRingColor = () => {
    if (status === 'listening') return 'border-primary animate-pulse-ring';
    if (status === 'speaking') return 'border-secondary-fixed animate-pulse';
    if (tier === 'red') return 'border-error animate-pulse-ring';
    return 'border-outline-variant/40';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FCF9F8] via-[#F0EDED] to-[#E8E2D6] text-on-surface flex flex-col justify-between p-6 md:p-8 font-sans">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-5xl w-full mx-auto">
        <Link href="/" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-label-md">
          <X size={18} /> Leave
        </Link>
        <div className="flex items-center gap-2 bg-surface-lowest/80 px-4 py-1.5 rounded-full border border-outline-variant/30 text-label-sm font-semibold text-on-surface shadow-ambient">
          SoulCare Voice · Emergency 112
        </div>
      </header>

      {/* Center 3D Orb and state */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full py-12">
        <div className="relative mb-12 flex items-center justify-center">
          {/* Animated state outline rings */}
          <span className={`absolute -inset-6 border rounded-full transition-all duration-700 opacity-30 ${statusRingColor()}`} />
          <span className={`absolute -inset-12 border rounded-full transition-all duration-700 opacity-15 ${statusRingColor()}`} style={{ animationDelay: '0.5s' }} />

          <BreathingOrb3D tier={tier} size={280} />
        </div>

        {/* Captions / Transcript box */}
        <div className="w-full text-center space-y-4 mb-6">
          <AnimatePresence mode="wait">
            {status === 'connecting' && (
              <motion.p key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-label-md text-on-surface-variant">
                Connecting gently…
              </motion.p>
            )}
            {status === 'listening' && (
              <motion.div key="listening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-1">
                <p className="text-label-sm text-primary tracking-wider uppercase">Listening</p>
                <p className="text-body-lg text-on-surface italic">&ldquo;{transcript}&rdquo;</p>
              </motion.div>
            )}
            {status === 'speaking' && (
              <motion.div key="speaking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-1">
                <p className="text-label-sm text-secondary tracking-wider uppercase">Companion</p>
                <p className="text-body-lg text-on-surface">{response}</p>
              </motion.div>
            )}
            {status === 'connected' && (
              <motion.p key="connected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-label-md text-on-surface-variant">
                Connected. Say something when you&apos;re ready.
              </motion.p>
            )}
            {status === 'disconnected' && (
              <motion.p key="disconnected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-label-md text-on-surface-variant">
                Tap the phone to begin a calm voice session.
              </motion.p>
            )}
            {status === 'ended' && (
              <motion.div key="ended" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                <p className="font-display text-headline-md text-on-surface">Session ended</p>
                <p className="text-body-md text-on-surface-variant">{response}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom controls */}
      <footer className="max-w-xl w-full mx-auto flex justify-center items-center gap-6">
        {status === 'disconnected' || status === 'ended' ? (
          <button onClick={handleConnect}
            className="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-ambient hover:scale-105 active:scale-95 transition-transform duration-300">
            <Phone size={24} />
          </button>
        ) : (
          <>
            {/* Mute Mic */}
            <button onClick={toggleMute}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isMuted ? 'bg-error text-on-error' : 'bg-surface-lowest text-on-surface border border-outline-variant/40 hover:bg-surface-low'
              }`}>
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* End Call */}
            <button onClick={handleDisconnect}
              className="w-16 h-16 bg-error-container text-on-error-container rounded-full flex items-center justify-center shadow-ambient hover:scale-105 active:scale-95 transition-transform duration-300">
              <PhoneOff size={24} />
            </button>

            {/* Speaker On/Off */}
            <button onClick={() => setIsSpeakerOn(p => !p)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isSpeakerOn ? 'bg-surface-lowest text-on-surface border border-outline-variant/40 hover:bg-surface-low' : 'bg-surface-high text-on-surface-variant border border-outline-variant/20'
              }`}>
              {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </>
        )}
      </footer>
    </div>
  );
}
