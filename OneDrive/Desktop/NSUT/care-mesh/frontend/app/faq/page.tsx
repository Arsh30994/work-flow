'use client';

import Link from 'next/link';
import { PublicNav } from '@/components/navigation/PublicNav';
import { FaqList } from '@/components/faq';

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PublicNav />
      <div className="max-w-2xl mx-auto px-5 md:px-10 pt-10">
        <h1 className="font-display text-headline-lg mb-3">FAQ</h1>
        <p className="text-body-md text-on-surface-variant mb-8">
          Honest boundaries for this prototype.
        </p>
        <FaqList />
        <p className="mt-10 text-label-md text-on-surface-variant">
          <Link href="/" className="text-primary underline underline-offset-2">
            Back home
          </Link>
        </p>
      </div>
    </div>
  );
}
