'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { PublicNav } from '@/components/navigation/PublicNav';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { DEMO_MEDICINES } from '@/data/demo';

export default function MedicinesPage() {
  const [q, setQ] = useState('');
  const items = useMemo(
    () =>
      DEMO_MEDICINES.filter((m) =>
        `${m.name} ${m.generic} ${m.category}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <PublicNav />
      <div className="max-w-content mx-auto px-5 md:px-10 pt-10">
        <h1 className="font-display text-headline-lg mb-2">Medicine lookup</h1>
        <p className="text-body-md text-on-surface-variant mb-4 max-w-2xl">
          Structured reference information. SoulCare never recommends medication via AI.
        </p>
        <div className="rounded-2xl bg-secondary-container/60 border border-outline-variant/30 px-4 py-3 text-label-md text-on-surface mb-8">
          This is general information, not a recommendation. Always follow your doctor&apos;s or pharmacist&apos;s advice.
        </div>

        <label className="relative block mb-8 max-w-xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search medicines…"
            className="w-full rounded-input bg-surface-lowest border border-outline-variant/40 pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-primary-fixed"
          />
        </label>

        <div className="space-y-4 max-w-2xl">
          {items.map((m) => (
            <Link key={m.id} href={`/medicines/${m.id}`}>
              <Card hover className="mb-4">
                <div className="flex justify-between gap-3">
                  <div>
                    <h2 className="font-display text-headline-md">{m.name}</h2>
                    <p className="text-label-md text-on-surface-variant mt-1">{m.generic}</p>
                  </div>
                  <Badge variant="sand">{m.category}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
