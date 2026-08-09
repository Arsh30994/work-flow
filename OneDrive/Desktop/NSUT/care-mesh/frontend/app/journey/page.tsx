'use client';

import { AppShell } from '@/components/navigation/AppShell';
import { FadeIn } from '@/components/motion/FadeIn';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const WEEK = [
  { day: 'Mon', mood: 62, sleep: 65 },
  { day: 'Tue', mood: 68, sleep: 70 },
  { day: 'Wed', mood: 58, sleep: 60 },
  { day: 'Thu', mood: 72, sleep: 75 },
  { day: 'Fri', mood: 75, sleep: 80 },
  { day: 'Sat', mood: 70, sleep: 72 },
  { day: 'Sun', mood: 78, sleep: 75 },
];

const PATH = [
  { when: 'Today', what: 'Morning check-in completed' },
  { when: 'Yesterday', what: 'Therapy session' },
  { when: 'Earlier', what: 'Completed breathing exercise' },
];

function SoftAreaChart() {
  const w = 560;
  const h = 200;
  const pad = 24;
  const toX = (i: number) => pad + (i * (w - pad * 2)) / (WEEK.length - 1);
  const toY = (v: number) => h - pad - ((v - 40) / 60) * (h - pad * 2);

  const moodPath = WEEK.map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(d.mood)}`).join(' ');
  const sleepPath = WEEK.map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(d.sleep)}`).join(' ');
  const moodArea = `${moodPath} L ${toX(WEEK.length - 1)} ${h - pad} L ${toX(0)} ${h - pad} Z`;
  const sleepArea = `${sleepPath} L ${toX(WEEK.length - 1)} ${h - pad} L ${toX(0)} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-64" role="img" aria-label="Weekly mood and sleep chart">
      <path d={sleepArea} fill="#E8E2D6" fillOpacity="0.85" />
      <path d={moodArea} fill="#CAEAD2" fillOpacity="0.65" />
      <path d={sleepPath} fill="none" stroke="#625E55" strokeWidth="2.5" strokeLinecap="round" />
      <path d={moodPath} fill="none" stroke="#45614E" strokeWidth="2.5" strokeLinecap="round" />
      {WEEK.map((d, i) => (
        <text key={d.day} x={toX(i)} y={h - 6} textAnchor="middle" className="fill-on-surface-variant" fontSize="12">
          {d.day}
        </text>
      ))}
    </svg>
  );
}

export default function JourneyPage() {
  return (
    <AppShell>
      <div className="max-w-content mx-auto px-5 md:px-8 pt-8 md:pt-10 pb-10">
        <FadeIn className="mb-8">
          <h1 className="font-display text-headline-lg mb-2">Your Journey</h1>
          <p className="text-body-md text-on-surface-variant">
            You&apos;re making steady progress this week.
          </p>
          <Badge variant="demo" className="mt-3">Demo insights</Badge>
        </FadeIn>

        <FadeIn>
          <Card padding="lg" className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="font-display text-headline-md">Weekly Wellness</h2>
              <div className="flex gap-4 text-label-sm text-on-surface-variant">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Mood
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary" /> Sleep
                </span>
              </div>
            </div>
            <SoftAreaChart />
          </Card>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <Card>
            <p className="text-label-md text-on-surface-variant">Sleep quality</p>
            <p className="font-display text-headline-md mt-2">Restful</p>
          </Card>
          <Card>
            <p className="text-label-md text-on-surface-variant">Overall mood</p>
            <p className="font-display text-headline-md mt-2">Balanced</p>
          </Card>
        </div>

        <h2 className="font-display text-headline-md mb-5">Your Path</h2>
        <ol className="space-y-0 border-l border-outline-variant/50 ml-3">
          {PATH.map((item) => (
            <li key={item.when} className="relative pl-8 pb-8 last:pb-0">
              <span className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary-fixed-dim border-2 border-primary" />
              <p className="text-label-sm text-on-surface-variant">{item.when}</p>
              <p className="font-display text-body-lg text-on-surface mt-1">{item.what}</p>
            </li>
          ))}
        </ol>
      </div>
    </AppShell>
  );
}
