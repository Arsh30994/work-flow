'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PublicNav } from '@/components/navigation/PublicNav';
import { FadeIn } from '@/components/motion/FadeIn';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DEMO_PRODUCTS } from '@/data/demo';
import { cn } from '@/lib/cn';

const CATS = ['All', 'Pain relief', 'Cold & flu', 'Digestive care', 'First aid', 'Vitamins & supplements', 'Personal care'];

export default function PharmacyPage() {
  const [cat, setCat] = useState('All');
  const [cart, setCart] = useState<string[]>([]);

  const products = useMemo(
    () => DEMO_PRODUCTS.filter((p) => cat === 'All' || p.category === cat),
    [cat],
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <PublicNav />
      <div className="max-w-content mx-auto px-5 md:px-10 pt-10">
        <FadeIn className="mb-6">
          <h1 className="font-display text-headline-lg mb-2">Pharmacy</h1>
          <p className="text-body-md text-on-surface-variant mb-3">
            Browse everyday care products. This is general shopping — not medical advice.
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="demo">Demo catalogue — no real fulfillment</Badge>
            <Link href="/medicines" className="text-label-md text-primary underline underline-offset-2">
              Medicine lookup
            </Link>
            {cart.length > 0 && (
              <Badge variant="sage">{cart.length} in cart (demo)</Badge>
            )}
          </div>
        </FadeIn>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                'rounded-full px-4 py-2 text-label-md border min-h-[40px]',
                cat === c ? 'bg-primary text-on-primary border-primary' : 'bg-surface-lowest border-outline-variant/40',
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.04}>
              <Card padding="none" className="overflow-hidden h-full flex flex-col">
                <Link href={`/pharmacy/${p.id}`}>
                  <img src={p.image} alt="" className="w-full h-40 object-cover" />
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-label-sm text-on-surface-variant mb-1">{p.category}</p>
                  <Link href={`/pharmacy/${p.id}`} className="font-display text-body-lg mb-2 hover:text-primary">
                    {p.name}
                  </Link>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.prescription && <Badge variant="error">Rx</Badge>}
                    <Badge variant={p.available ? 'success' : 'muted'}>
                      {p.available ? 'In stock' : 'Unavailable'}
                    </Badge>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="font-display">₹{p.price}</span>
                    <Button
                      size="sm"
                      disabled={!p.available || cart.includes(p.id)}
                      onClick={() => setCart((c) => [...c, p.id])}
                    >
                      {cart.includes(p.id) ? 'Added' : 'Add to cart'}
                    </Button>
                  </div>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
