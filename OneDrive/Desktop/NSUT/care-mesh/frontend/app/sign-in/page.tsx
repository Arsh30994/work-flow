'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/login');
  }, [router]);
  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-on-surface-variant">
      Redirecting…
    </div>
  );
}
