'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, MapPin, Leaf, Users } from 'lucide-react';
import { PublicNav } from '@/components/navigation/PublicNav';
import { FadeIn } from '@/components/motion/FadeIn';
import { ConsentModal } from '@/components/chat/ConsentModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const SERVICES = [
  {
    icon: MessageCircle,
    title: 'Talk now',
    description: 'A private place to put your thoughts into words.',
    href: '/consent',
  },
  {
    icon: Users,
    title: 'Find a therapist',
    description: 'Browse professionals and find someone who fits.',
    href: '/therapists',
  },
  {
    icon: MapPin,
    title: 'Find help nearby',
    description: 'Discover verified support and emergency resources.',
    href: '/help',
  },
  {
    icon: Leaf,
    title: 'Explore wellness',
    description: 'Small tools for sleep, breathing, movement and more.',
    href: '/resources',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [consentOpen, setConsentOpen] = useState(false);

  const goTalk = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('soulcare_consent', '1');
      sessionStorage.setItem('soulcare_guest', '1');
    }
    router.push('/chat');
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
        <div
          className="ambient-blob ambient-blob-a w-[420px] h-[420px] bg-primary-fixed/50 -top-20 -left-20"
          aria-hidden
        />
        <div
          className="ambient-blob ambient-blob-b w-[380px] h-[380px] bg-secondary-container/70 top-40 right-[-80px]"
          aria-hidden
        />
        <div
          className="ambient-blob ambient-blob-c w-[300px] h-[300px] bg-primary-fixed-dim/30 bottom-10 left-1/3"
          aria-hidden
        />

        <div className="relative max-w-content mx-auto px-5 md:px-10 pt-16 md:pt-24 pb-20 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-2xl"
          >
            <p className="font-display text-primary text-label-md tracking-wide mb-5">SoulCare</p>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-on-surface leading-[1.1] mb-6">
              You&apos;re not alone.
              <br />
              Talk, anytime.
            </h1>
            <p className="text-body-lg text-on-surface-variant mb-10 max-w-xl">
              Start with a calm, anonymous conversation. If something serious comes up, a real human
              counsellor can step in.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Button size="lg" onClick={() => setConsentOpen(true)}>
                Start talking <ArrowRight size={18} />
              </Button>
              <Link href="/help">
                <Button size="lg" variant="secondary">
                  Find help near me
                </Button>
              </Link>
            </div>
            <p className="text-label-md text-on-surface-variant tracking-wide">
              Anonymous · Free · Private
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service cards */}
      <section className="py-section-mobile md:py-section-gap px-5 md:px-10">
        <div className="max-w-content mx-auto">
          <FadeIn className="mb-10 md:mb-14">
            <h2 className="font-display text-headline-lg text-on-surface mb-3">
              How can we support you today?
            </h2>
            <p className="text-body-md text-on-surface-variant max-w-lg">
              Take a moment. Start wherever you are.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-7">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.06}>
                <Link href={s.href === '/consent' ? '#' : s.href} onClick={s.href === '/consent' ? (e) => { e.preventDefault(); setConsentOpen(true); } : undefined}>
                  <Card hover padding="lg" className="h-full group">
                    <div className="w-12 h-12 rounded-2xl bg-primary-fixed/45 text-primary flex items-center justify-center mb-5">
                      <s.icon size={22} strokeWidth={1.75} />
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-headline-md text-on-surface mb-2">{s.title}</h3>
                        <p className="text-body-md text-on-surface-variant">{s.description}</p>
                      </div>
                      <ArrowRight
                        size={20}
                        className="text-primary mt-1 shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                      />
                    </div>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <ConsentModal
        open={consentOpen}
        onContinue={goTalk}
        onGuest={goTalk}
        onClose={() => setConsentOpen(false)}
      />
    </div>
  );
}
