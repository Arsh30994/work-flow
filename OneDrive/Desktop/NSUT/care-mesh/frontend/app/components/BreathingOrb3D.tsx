'use client';

import { useMemo } from 'react';

type RiskTier = 'green' | 'yellow' | 'red' | 'idle';

const TIER_CONFIG: Record<RiskTier, {
  inner: string;
  mid: string;
  outer: string;
  glow: string;
  speed: string;
}> = {
  idle: {
    inner: '#afceb7',
    mid:   '#7da88a',
    outer: '#45614e',
    glow:  'rgba(69,97,78,0.35)',
    speed: '3.5s',
  },
  green: {
    inner: '#6abf7b',
    mid:   '#45a05a',
    outer: '#2d7a45',
    glow:  'rgba(69,161,90,0.45)',
    speed: '2.8s',
  },
  yellow: {
    inner: '#f0c84a',
    mid:   '#c9a227',
    outer: '#9c7a10',
    glow:  'rgba(201,162,39,0.5)',
    speed: '1.8s',
  },
  red: {
    inner: '#f05a5a',
    mid:   '#ba1a1a',
    outer: '#8a0000',
    glow:  'rgba(186,26,26,0.6)',
    speed: '1.1s',
  },
};

interface BreathingOrbProps {
  tier?: RiskTier;
  size?: number;
  className?: string;
}

export default function BreathingOrb3D({
  tier = 'idle',
  size = 240,
  className = '',
}: BreathingOrbProps) {
  const cfg = TIER_CONFIG[tier];
  const half = size / 2;
  const animId = useMemo(() => `orb-${tier}-${size}`, [tier, size]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Keyframe injection */}
      <style>{`
        @keyframes ${animId}-breathe {
          0%, 100% { transform: scale(1);    opacity: 0.88; }
          50%       { transform: scale(1.07); opacity: 1;    }
        }
        @keyframes ${animId}-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ${animId}-pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1.1); }
          50%       { opacity: 0.85; transform: scale(1.35); }
        }
      `}</style>

      {/* Outer glow halo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: cfg.glow,
          filter: `blur(${half * 0.45}px)`,
          animation: `${animId}-pulse-glow ${cfg.speed} ease-in-out infinite`,
        }}
      />

      {/* Spinning gradient ring */}
      <div
        style={{
          position: 'absolute',
          inset: -size * 0.04,
          borderRadius: '50%',
          background: `conic-gradient(from 0deg, ${cfg.inner}, ${cfg.mid}, ${cfg.outer}, transparent, ${cfg.inner})`,
          animation: `${animId}-spin ${parseFloat(cfg.speed) * 4}s linear infinite`,
          opacity: 0.35,
          filter: `blur(${size * 0.025}px)`,
        }}
      />

      {/* Main orb body */}
      <div
        style={{
          position: 'absolute',
          inset: size * 0.06,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${cfg.inner}, ${cfg.mid} 50%, ${cfg.outer})`,
          boxShadow: `
            inset 0 0 ${size * 0.12}px rgba(255,255,255,0.25),
            inset 0 0 ${size * 0.25}px rgba(255,255,255,0.08),
            0 0 ${size * 0.2}px ${cfg.glow}
          `,
          animation: `${animId}-breathe ${cfg.speed} ease-in-out infinite`,
        }}
      />

      {/* Specular highlight */}
      <div
        style={{
          position: 'absolute',
          top: '22%',
          left: '26%',
          width: '28%',
          height: '20%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: `blur(${size * 0.012}px)`,
        }}
      />
    </div>
  );
}
