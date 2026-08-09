'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function BookingRedirect() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('therapist');

  useEffect(() => {
    if (id) router.replace(`/therapists/${id}`);
    else router.replace('/therapists');
  }, [id, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">
      Opening booking…
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <BookingRedirect />
    </Suspense>
  );
}
