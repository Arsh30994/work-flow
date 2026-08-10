'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import { PublicNav } from '@/components/navigation/PublicNav';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { resourceService } from '@/services';
import type { Resource } from '@/types';

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [r, setR] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    resourceService
      .get(id)
      .then((row) => {
        if (!cancelled) setR(row);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading || !r) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <PublicNav />
        <div className="max-w-2xl mx-auto px-5 md:px-10 pt-8 space-y-4">
          <Skeleton className="h-56 w-full rounded-large" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <PublicNav />
      <article className="max-w-2xl mx-auto px-5 md:px-10 pt-8">
        <Link href="/resources" className="inline-flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary mb-6">
          <ArrowLeft size={16} /> Library
        </Link>
        <div className="rounded-large overflow-hidden mb-8 shadow-ambient">
          <img src={r.image} alt="" className="w-full h-56 object-cover" />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="sand">{r.category}</Badge>
          <span className="inline-flex items-center gap-1 text-label-md text-on-surface-variant">
            <Clock size={14} /> {r.duration}
          </span>
        </div>
        <h1 className="font-display text-headline-lg text-on-surface mb-4">{r.title}</h1>
        <p className="text-body-lg text-on-surface-variant mb-8">{r.description}</p>
        <p className="text-body-md text-on-surface-variant mb-10 leading-relaxed">
          This is a demo practice card. In production, guided audio or a short interactive flow would live here.
          For now, take a quiet breath — in for four, hold for four, out for four — and notice how your body feels.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => {
            const saved = JSON.parse(sessionStorage.getItem('soulcare_saved') || '[]');
            if (!saved.includes(r.id)) {
              saved.push(r.id);
              sessionStorage.setItem('soulcare_saved', JSON.stringify(saved));
            }
            alert('Saved for later (demo).');
          }}>
            Save for later
          </Button>
          <Link href="/chat">
            <Button variant="secondary">Talk about this</Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
