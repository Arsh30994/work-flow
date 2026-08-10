'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/navigation/AppShell';
import { FadeIn } from '@/components/motion/FadeIn';
import { WellnessRing } from '@/components/journey';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth, useDashboard, useTherapists } from '@/hooks';
import type { Therapist } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: dash, loading: dashLoading } = useDashboard();
  const { therapists, loading: therapistsLoading } = useTherapists();
  const [next, setNext] = useState<Therapist | null>(null);

  const loading = dashLoading || therapistsLoading;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const displayName = dash?.greeting_name || user?.displayName || 'Alex';

  useEffect(() => {
    if (therapists[0]) setNext(therapists[0]);
  }, [therapists]);

  const wellness = dash?.wellness_score ?? 75;
  const sleepHours = dash?.sleep_avg ?? 7.5;
  const hydration = dash?.hydration_avg ?? 3;

  return (
    <AppShell>
      <div className="max-w-content mx-auto px-5 md:px-8 pt-8 md:pt-10">
        <FadeIn className="mb-10">
          <h1 className="font-display text-headline-lg text-on-surface mb-2">
            {greeting}, {displayName}.
          </h1>
          <p className="text-body-md text-on-surface-variant">Here&apos;s a gentle overview of your day.</p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <FadeIn>
            <Card padding="lg" className="text-center h-full">
              <p className="text-label-md text-on-surface-variant mb-4">Today&apos;s wellness check-in</p>
              {loading ? <Skeleton className="h-36 w-36 mx-auto rounded-full" /> : <WellnessRing value={wellness} />}
              <p className="text-body-md text-on-surface-variant mt-4">
                A soft snapshot — not a medical score.
              </p>
            </Card>
          </FadeIn>

          <FadeIn delay={0.05} className="lg:col-span-2">
            <Card padding="lg" className="h-full">
              <p className="text-label-md text-on-surface-variant mb-4">Your next session</p>
              {loading || !next ? (
                <Skeleton className="h-16 w-full rounded-2xl" />
              ) : (
                <div className="flex gap-4 items-center">
                  <img src={next.img} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-headline-md truncate">{next.name}</h2>
                    <p className="text-body-md text-on-surface-variant">
                      {dash?.upcoming_booking
                        ? `${dash.upcoming_booking.date} · ${dash.upcoming_booking.time}`
                        : 'Today · 2:00 PM · Video session'}
                    </p>
                    <Badge variant="demo" className="mt-2">
                      Demo schedule
                    </Badge>
                  </div>
                  <Link href={`/therapists/${next.id}`}>
                    <Button size="sm">View session</Button>
                  </Link>
                </div>
              )}
            </Card>
          </FadeIn>
        </div>

        <h2 className="font-display text-headline-md mb-4">Gentle reminders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <FadeIn>
            <Card>
              <p className="text-label-md text-on-surface-variant">Hydration</p>
              <p className="font-display text-headline-md mt-2">{hydration} of 5 glasses</p>
              <p className="text-body-md text-on-surface-variant mt-2">A soft nudge — whenever you remember.</p>
            </Card>
          </FadeIn>
          <FadeIn delay={0.05}>
            <Card>
              <p className="text-label-md text-on-surface-variant">Sleep</p>
              <p className="font-display text-headline-md mt-2">{sleepHours} hours last night</p>
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
