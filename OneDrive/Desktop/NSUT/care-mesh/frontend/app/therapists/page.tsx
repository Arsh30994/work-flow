'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { PublicNav } from '@/components/navigation/PublicNav';
import { FadeIn } from '@/components/motion/FadeIn';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DEMO_THERAPISTS } from '@/data/demo';
import { cn } from '@/lib/cn';

const SPECIALTIES = ['Any specialty', 'Anxiety', 'Relationships', 'Trauma', 'Sleep'];
const AVAIL = ['Any availability', 'Today', 'This week', 'Next week'];
const APPROACH = ['Any approach', 'CBT', 'Person-centred', 'Trauma-informed', 'Integrative'];

export default function TherapistsPage() {
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [availability, setAvailability] = useState(AVAIL[0]);
  const [approach, setApproach] = useState(APPROACH[0]);

  const filtered = useMemo(() => {
    return DEMO_THERAPISTS.filter((t) => {
      if (specialty !== 'Any specialty' && t.specialty !== specialty) return false;
      if (availability !== 'Any availability' && t.availability !== availability) return false;
      if (approach !== 'Any approach' && t.approach !== approach) return false;
      return true;
    });
  }, [specialty, availability, approach]);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <PublicNav />
      <div className="max-w-content mx-auto px-5 md:px-10 pt-10 md:pt-14">
        <FadeIn className="mb-8 md:mb-12 max-w-2xl">
          <h1 className="font-display text-headline-lg md:text-4xl text-on-surface mb-3">
            Find someone to talk to, properly
          </h1>
          <p className="text-body-lg text-on-surface-variant mb-4">
            Counsellors and psychologists ready to support your unique needs.
          </p>
          <Badge variant="demo">Demo data — real use requires licence verification.</Badge>
        </FadeIn>

        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { value: specialty, set: setSpecialty, options: SPECIALTIES },
            { value: availability, set: setAvailability, options: AVAIL },
            { value: approach, set: setApproach, options: APPROACH },
          ].map((filter) => (
            <div key={filter.options[0]} className="flex flex-wrap gap-2">
              {filter.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => filter.set(opt)}
                  className={cn(
                    'rounded-full px-4 py-2 text-label-md min-h-[40px] transition-colors border',
                    filter.value === opt
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-lowest text-on-surface-variant border-outline-variant/40 hover:bg-surface-low',
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t, i) => (
            <FadeIn key={t.id} delay={i * 0.05}>
              <Card hover padding="none" className="overflow-hidden group">
                <div className="h-52 overflow-hidden">
                  <img
                    src={t.img}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-display text-headline-md text-on-surface">{t.name}</h2>
                  <p className="text-body-md text-on-surface-variant mt-1">{t.title}</p>
                  <p className="flex items-center gap-1 text-label-md mt-3">
                    <Star size={14} className="fill-amber-400 text-amber-400" /> {t.rating}
                  </p>
                  <p className="text-body-md text-on-surface-variant mt-3 mb-4">{t.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {t.tags.map((tag) => (
                      <Badge key={tag} variant="sage">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-body-lg text-on-surface">₹{t.price} / session</span>
                    <Link href={`/therapists/${t.id}`}>
                      <Button size="sm">
                        Book Session <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <h3 className="font-display text-headline-md mb-2">No matches right now</h3>
            <p className="text-on-surface-variant mb-6">Try widening your filters.</p>
            <Button
              variant="secondary"
              onClick={() => {
                setSpecialty(SPECIALTIES[0]);
                setAvailability(AVAIL[0]);
                setApproach(APPROACH[0]);
              }}
            >
              Reset filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
