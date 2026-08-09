'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PublicNav } from '@/components/navigation/PublicNav';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { DEMO_MEDICINES } from '@/data/demo';

export default function MedicineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const m = DEMO_MEDICINES.find((x) => x.id === id) || DEMO_MEDICINES[0];

  return (
    <div className="min-h-screen bg-background pb-24">
      <PublicNav />
      <div className="max-w-2xl mx-auto px-5 pt-8">
        <Link href="/medicines" className="inline-flex items-center gap-2 text-label-md text-on-surface-variant mb-6">
          <ArrowLeft size={16} /> Medicines
        </Link>
        <div className="rounded-2xl bg-secondary-container/60 border border-outline-variant/30 px-4 py-3 text-label-md mb-6">
          This is general information, not a recommendation. Always follow your doctor&apos;s or pharmacist&apos;s advice.
        </div>
        <h1 className="font-display text-headline-lg mb-1">{m.name}</h1>
        <p className="text-on-surface-variant mb-6">{m.generic}</p>
        <div className="grid gap-4">
          <Card>
            <p className="text-label-sm text-on-surface-variant">Category</p>
            <p className="font-display text-body-lg mt-1">{m.category}</p>
          </Card>
          <Card>
            <p className="text-label-sm text-on-surface-variant">General dosage information</p>
            <p className="text-body-md mt-1">{m.dosage}</p>
          </Card>
          <Card>
            <p className="text-label-sm text-on-surface-variant">Common side effects</p>
            <p className="text-body-md mt-1">{m.sideEffects}</p>
          </Card>
          <Card>
            <p className="text-label-sm text-on-surface-variant">Prescription requirement</p>
            <Badge variant={m.prescription ? 'error' : 'success'} className="mt-2">
              {m.prescription ? 'Prescription required' : 'Usually OTC — confirm locally'}
            </Badge>
          </Card>
        </div>
      </div>
    </div>
  );
}
