'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConsentModal } from '@/components/chat/ConsentModal';
import { authService, consentService } from '@/services';

export default function ConsentPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const done = sessionStorage.getItem('soulcare_consent');
    if (done) router.replace('/chat');
  }, [router]);

  const go = async (guest: boolean) => {
    if (busy) return;
    setBusy(true);
    try {
      const consent = await consentService.accept(guest);
      sessionStorage.setItem('soulcare_consent', '1');
      if (guest) {
        sessionStorage.setItem('soulcare_guest', '1');
        if (!authService.isAuthenticated()) {
          await authService.guest();
        }
      }
      router.push(consent.next_path || '/chat');
    } catch {
      sessionStorage.setItem('soulcare_consent', '1');
      router.push('/chat');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ConsentModal open onContinue={() => go(false)} onGuest={() => go(true)} />
    </div>
  );
}
