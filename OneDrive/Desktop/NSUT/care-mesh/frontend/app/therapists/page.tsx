'use client';

import { PublicNav } from '@/components/navigation/PublicNav';
import { TherapistDirectory } from '@/components/therapists';

export default function TherapistsPage() {
  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <PublicNav />
      <TherapistDirectory />
    </div>
  );
}
