'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Search } from 'lucide-react';
import { PublicNav } from '@/components/navigation/PublicNav';
import { FadeIn } from '@/components/motion/FadeIn';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ResourceSkeleton } from '@/components/ui/Skeleton';
import { resourceService } from '@/services';
import type { Resource } from '@/types';
import { cn } from '@/lib/cn';

const CATEGORIES = ['All', 'Meditation', 'Nutrition', 'Sleep', 'Movement', 'Therapy Tools'];

export default function ResourcesPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const handle = setTimeout(() => {
      resourceService
        .list({ category: cat, q: q || undefined })
        .then((rows) => {
          if (!cancelled) setItems(rows);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, q ? 200 : 0);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [q, cat]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PublicNav />

      <section className="relative h-56 md:h-72 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&h=600&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="relative max-w-content mx-auto px-5 md:px-10 h-full flex flex-col justify-end pb-8">
          <h1 className="font-display text-headline-lg md:text-4xl text-on-surface">Small things that help</h1>
        </div>
      </section>

      <div className="max-w-content mx-auto px-5 md:px-10 -mt-4 relative z-10">
        <label className="relative block mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sleep, panic, breathing..."
            className="w-full rounded-card bg-surface-lowest shadow-ambient border border-outline-variant/25 pl-11 pr-4 py-4 text-body-md outline-none focus:ring-2 focus:ring-primary-fixed"
          />
        </label>

        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                'rounded-full px-4 py-2 text-label-md min-h-[40px] border transition-colors',
                cat === c
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-lowest border-outline-variant/40 text-on-surface-variant',
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <ResourceSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((r, i) => (
              <FadeIn key={r.id} delay={i * 0.05}>
                <Link href={`/resources/${r.id}`}>
                  <Card hover padding="none" className="overflow-hidden h-full">
                    <div className="h-44 overflow-hidden">
                      <img src={r.image} alt="" className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]" />
                    </div>
                    <div className="p-7">
                      <h2 className="font-display text-headline-md text-on-surface mb-3">{r.title}</h2>
                      <p className="text-body-md text-on-surface-variant mb-5">{r.description}</p>
                      <div className="flex items-center gap-3 text-label-md text-on-surface-variant">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={14} /> {r.duration}
                        </span>
                        <Badge variant="sand">{r.category}</Badge>
                      </div>
                    </div>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-16">
            <h3 className="font-display text-headline-md mb-2">Nothing matches yet</h3>
            <p className="text-on-surface-variant">Try another word, or browse a category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
