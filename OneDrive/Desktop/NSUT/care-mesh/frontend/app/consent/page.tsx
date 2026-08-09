'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConsentModal } from '@/components/chat/ConsentModal';

export default function ConsentPage() {
  const router = useRouter();

  useEffect(() => {
    const done = sessionStorage.getItem('soulcare_consent');
    if (done) router.replace('/chat');
  }, [router]);

  const go = (guest: boolean) => {
    sessionStorage.setItem('soulcare_consent', '1');
    if (guest) sessionStorage.setItem('soulcare_guest', '1');
    router.push('/chat');
  };

  return (
    <div className="min-h-screen bg-background">
      <ConsentModal open onContinue={() => go(false)} onGuest={() => go(true)} />
    </div>
  );
}
