'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PublicNav } from '@/components/navigation/PublicNav';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DEMO_PRODUCTS } from '@/data/demo';

export default function PharmacyProductPage() {
  const { id } = useParams<{ id: string }>();
  const p = DEMO_PRODUCTS.find((x) => x.id === id) || DEMO_PRODUCTS[0];

  return (
    <div className="min-h-screen bg-background pb-24">
      <PublicNav />
      <div className="max-w-3xl mx-auto px-5 pt-8 grid md:grid-cols-2 gap-8">
        <div>
          <Link href="/pharmacy" className="inline-flex items-center gap-2 text-label-md text-on-surface-variant mb-4">
            <ArrowLeft size={16} /> Pharmacy
          </Link>
          <img src={p.image} alt="" className="w-full rounded-large object-cover aspect-square shadow-ambient" />
        </div>
        <div className="md:pt-10">
          <Badge variant="demo" className="mb-3">Demo product</Badge>
          <h1 className="font-display text-headline-lg mb-2">{p.name}</h1>
          <p className="text-on-surface-variant mb-4">{p.category}</p>
          <p className="font-display text-2xl mb-6">₹{p.price}</p>
          <Badge variant={p.available ? 'success' : 'muted'} className="mb-6">
            {p.available ? 'Available' : 'Unavailable'}
          </Badge>
          <p className="text-body-md text-on-surface-variant mb-8">
            This is general product information only. Always follow your doctor&apos;s or pharmacist&apos;s advice.
          </p>
          <Button disabled={!p.available} onClick={() => alert('Added to demo cart.')}>
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
