'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Star, ArrowLeft } from 'lucide-react';
import { PublicNav } from '@/components/navigation/PublicNav';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DEMO_THERAPISTS, BOOKING_TIMES, UNAVAILABLE_TIMES } from '@/data/demo';
import { cn } from '@/lib/cn';

function nextDays(count: number) {
  const days = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function TherapistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const therapist = DEMO_THERAPISTS.find((t) => t.id === id) || DEMO_THERAPISTS[0];
  const days = useMemo(() => nextDays(7), []);
  const [open, setOpen] = useState(false);
  const [dayIdx, setDayIdx] = useState(1);
  const [time, setTime] = useState<string | null>(null);

  const confirm = () => {
    if (!time) return;
    const day = days[dayIdx];
    const payload = {
      therapistId: therapist.id,
      therapistName: therapist.name,
      date: day.toISOString(),
      time,
      type: '50-minute video session',
    };
    sessionStorage.setItem('soulcare_booking', JSON.stringify(payload));
    router.push('/booking/confirmation');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PublicNav />
      <div className="max-w-3xl mx-auto px-5 md:px-10 pt-8">
        <Link href="/therapists" className="inline-flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary mb-6">
          <ArrowLeft size={16} /> Back to therapists
        </Link>

        <div className="bg-surface-lowest rounded-large shadow-ambient overflow-hidden border border-outline-variant/20">
          <div className="h-64 md:h-72">
            <img src={therapist.img} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="p-8">
            <Badge variant="demo" className="mb-4">Demo data — not a verified licence</Badge>
            <h1 className="font-display text-headline-lg text-on-surface">{therapist.name}</h1>
            <p className="text-body-lg text-on-surface-variant mt-1">{therapist.title}</p>
            <p className="flex items-center gap-1 mt-3 text-label-md">
              <Star size={14} className="fill-amber-400 text-amber-400" /> {therapist.rating}
            </p>
            <p className="text-body-md text-on-surface-variant mt-5 mb-6">{therapist.bio}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {therapist.tags.map((t) => (
                <Badge key={t} variant="sage">{t}</Badge>
              ))}
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="font-display text-xl">₹{therapist.price} / session</span>
              <Button onClick={() => setOpen(true)}>Book Session</Button>
            </div>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Book with ${therapist.name}`}>
        <p className="text-body-md text-on-surface-variant mb-6 -mt-2">Pick a day, then a time.</p>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {days.map((d, i) => (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => { setDayIdx(i); setTime(null); }}
              className={cn(
                'shrink-0 rounded-2xl px-4 py-3 min-w-[72px] text-center border transition-colors',
                dayIdx === i
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-low border-outline-variant/30 text-on-surface',
              )}
            >
              <div className="text-label-sm opacity-80">{d.toLocaleDateString(undefined, { weekday: 'short' })}</div>
              <div className="font-display text-lg">{d.getDate()}</div>
            </button>
          ))}
        </div>

        <p className="text-label-md text-on-surface mb-3">Available times</p>
        <div className="grid grid-cols-3 gap-2 mb-8">
          {BOOKING_TIMES.map((t) => {
            const disabled = UNAVAILABLE_TIMES.includes(t);
            return (
              <button
                key={t}
                type="button"
                disabled={disabled}
                onClick={() => setTime(t)}
                className={cn(
                  'rounded-xl py-3 text-label-md border transition-colors min-h-[44px]',
                  disabled && 'opacity-35 cursor-not-allowed',
                  time === t
                    ? 'bg-primary-fixed border-primary text-primary'
                    : 'bg-surface-lowest border-outline-variant/40 hover:bg-surface-low',
                )}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" disabled={!time} onClick={confirm}>
            Confirm booking
          </Button>
          <Button className="flex-1" variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
