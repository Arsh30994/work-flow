'use client';

import { AppShell } from '@/components/navigation/AppShell';
import { JourneyBoard } from '@/components/journey';

export default function JourneyPage() {
  return (
    <AppShell>
      <JourneyBoard />
    </AppShell>
  );
}
