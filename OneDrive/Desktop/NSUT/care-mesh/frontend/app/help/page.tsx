'use client';

import { useEffect, useMemo, useState } from 'react';
import { Phone, MapPin, Search, BadgeCheck } from 'lucide-react';
import { PublicNav } from '@/components/navigation/PublicNav';
import { FadeIn } from '@/components/motion/FadeIn';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { helpService } from '@/services';
import type { HelpItem } from '@/types';
import { cn } from '@/lib/cn';

const FILTERS = ['All', 'Emergency', 'Therapist', 'Free / Govt', 'Hospital', 'De-addiction', 'Helpline'];

export default function HelpPage() {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [raw, setRaw] = useState<HelpItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const handle = setTimeout(() => {
      helpService
        .list({ q: q || undefined })
        .then((rows) => {
          if (!cancelled) setRaw(rows);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, q ? 200 : 0);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [q]);

  const items = useMemo(() => {
    return raw.filter((h) => {
      if (filter === 'Emergency' && h.category !== 'Helpline') return false;
      if (filter === 'Free / Govt' && !['Helpline'].includes(h.category)) return false;
      if (['Therapist', 'Helpline', 'Hospital', 'De-addiction'].includes(filter) && h.category !== filter) return false;
      return true;
    });
  }, [raw, filter]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PublicNav />
      <div className="max-w-content mx-auto px-5 md:px-10 pt-10 md:pt-14">
        <FadeIn className="mb-8 max-w-xl">
          <h1 className="font-display text-headline-lg text-on-surface mb-3">Find help nearby</h1>
          <p className="text-body-md text-on-surface-variant mb-3">
            Structured demo resources. This is not full national real-time coverage.
          </p>
          <Badge variant="demo">Demo directory</Badge>
        </FadeIn>

        <label className="relative block mb-5 max-w-xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your city or area"
            className="w-full rounded-input bg-surface-lowest border border-outline-variant/40 pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary-fixed"
          />
        </label>

        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-full px-4 py-2 text-label-md border min-h-[40px]',
                filter === f ? 'bg-primary text-on-primary border-primary' : 'bg-surface-lowest border-outline-variant/40 text-on-surface-variant',
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4 max-w-2xl">
          {loading
            ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-36 w-full rounded-card" />)
            : items.map((h, i) => (
              <FadeIn key={h.id} delay={i * 0.04}>
                <Card>
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h2 className="font-display text-headline-md text-on-surface flex items-center gap-2">
                        {h.name}
                        {h.verified && (
                          <span className="inline-flex items-center gap-1 text-label-sm text-primary">
                            <BadgeCheck size={16} /> Verified
                          </span>
                        )}
                      </h2>
                      <p className="text-label-md text-on-surface-variant mt-1">{h.category} · {h.distance}</p>
                    </div>
                  </div>
                  <p className="text-body-md text-on-surface-variant mb-5 flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 shrink-0" /> {h.address}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a href={`tel:${h.phone}`}>
                      <Button size="sm">
                        <Phone size={14} /> Call now
                      </Button>
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.address)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button size="sm" variant="secondary">
                        Directions
                      </Button>
                    </a>
                  </div>
                </Card>
              </FadeIn>
            ))}
        </div>
      </div>
    </div>
  );
}
