'use client';

import Link from 'next/link';
import { AppShell } from '@/components/navigation/AppShell';
import { FadeIn } from '@/components/motion/FadeIn';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DEMO_THERAPISTS } from '@/data/demo';

function WellnessRing({ value }: { value: number }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg width="144" height="144" className="progress-ring -rotate-90">
        <circle cx="72" cy="72" r={r} fill="none" stroke="#E4E2E1" strokeWidth="10" />
        <circle
          className="progress-ring__circle"
          cx="72"
          cy="72"
          r={r}
          fill="none"
          stroke="#45614E"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl text-on-surface">{value}</span>
        <span className="text-label-sm text-on-surface-variant">/100</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const next = DEMO_THERAPISTS[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <AppShell>
      <div className="max-w-content mx-auto px-5 md:px-8 pt-8 md:pt-10">
        <FadeIn className="mb-10">
          <h1 className="font-display text-headline-lg text-on-surface mb-2">
            {greeting}, Alex.
          </h1>
          <p className="text-body-md text-on-surface-variant">Here&apos;s a gentle overview of your day.</p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <FadeIn>
            <Card padding="lg" className="text-center h-full">
              <p className="text-label-md text-on-surface-variant mb-4">Today&apos;s wellness check-in</p>
              <WellnessRing value={75} />
              <p className="text-body-md text-on-surface-variant mt-4">
                A soft snapshot — not a medical score.
              </p>
            </Card>
          </FadeIn>

          <FadeIn delay={0.05} className="lg:col-span-2">
            <Card padding="lg" className="h-full">
              <p className="text-label-md text-on-surface-variant mb-4">Your next session</p>
              <div className="flex gap-4 items-center">
                <img src={next.img} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-headline-md truncate">{next.name}</h2>
                  <p className="text-body-md text-on-surface-variant">Today · 2:00 PM · Video session</p>
                  <Badge variant="demo" className="mt-2">Demo schedule</Badge>
                </div>
                <Link href={`/therapists/${next.id}`}>
                  <Button size="sm">View session</Button>
                </Link>
              </div>
            </Card>
          </FadeIn>
        </div>

        <h2 className="font-display text-headline-md mb-4">Gentle reminders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <FadeIn>
            <Card>
              <p className="text-label-md text-on-surface-variant">Hydration</p>
              <p className="font-display text-headline-md mt-2">3 of 5 glasses</p>
              <p className="text-body-md text-on-surface-variant mt-2">A soft nudge — whenever you remember.</p>
            </Card>
          </FadeIn>
          <FadeIn delay={0.05}>
            <Card>
              <p className="text-label-md text-on-surface-variant">Sleep</p>
              <p className="font-display text-headline-md mt-2">7.5 hours last night</p>
              <p className="text-body-md text-on-surface-variant mt-2">Notice how you&apos;ve been resting.</p>
            </Card>
          </FadeIn>
        </div>

        <Link href="/journey">
          <Button variant="secondary">See your journey</Button>
        </Link>
      </div>
    </AppShell>
  );
}
