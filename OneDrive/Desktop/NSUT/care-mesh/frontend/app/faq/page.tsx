'use client';

import Link from 'next/link';
import { PublicNav } from '@/components/navigation/PublicNav';
import { Card } from '@/components/ui/Card';

const FAQS = [
  {
    q: 'Is SoulCare a replacement for emergency services?',
    a: 'No. In a crisis, call 112. SoulCare helps you talk and find support — it does not dispatch ambulances.',
  },
  {
    q: 'Is the AI a doctor?',
    a: 'No. The AI is a supportive conversation companion. It does not diagnose, prescribe, or provide clinical treatment.',
  },
  {
    q: 'Are therapists on this demo verified?',
    a: 'Demo profiles are labelled clearly. Real use requires licence verification — not claimed in this prototype.',
  },
  {
    q: 'Does SoulCare recommend medicines?',
    a: 'Never via AI. Pharmacy and medicine pages are lookup/browse only, with clear disclaimers.',
  },
  {
    q: 'Do I need an account to talk?',
    a: 'No. Guest mode is first-class. You can start talking without signing up.',
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PublicNav />
      <div className="max-w-2xl mx-auto px-5 md:px-10 pt-10">
        <h1 className="font-display text-headline-lg mb-3">FAQ</h1>
        <p className="text-body-md text-on-surface-variant mb-8">
          Honest boundaries for this prototype.
        </p>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <Card key={f.q}>
              <h2 className="font-display text-body-lg mb-2">{f.q}</h2>
              <p className="text-body-md text-on-surface-variant">{f.a}</p>
            </Card>
          ))}
        </div>
        <p className="mt-10 text-label-md text-on-surface-variant">
          <Link href="/" className="text-primary underline underline-offset-2">Back home</Link>
        </p>
      </div>
    </div>
  );
}
