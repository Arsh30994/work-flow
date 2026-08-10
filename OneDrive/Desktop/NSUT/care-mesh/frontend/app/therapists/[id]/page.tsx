'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, ArrowLeft } from 'lucide-react';
import { PublicNav } from '@/components/navigation/PublicNav';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { useBooking } from '@/hooks';
import { cn } from '@/lib/cn';

export default function TherapistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    therapist,
    loading,
    days,
    open,
    setOpen,
    dayIdx,
    setDayIdx,
    time,
    setTime,
    slotsForDay,
    bookingLoading,
    confirm,
  } = useBooking(id);

  if (loading || !therapist) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <PublicNav />
        <div className="max-w-3xl mx-auto px-5 md:px-10 pt-8 space-y-4">
          <Skeleton className="h-64 w-full rounded-large" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <PublicNav />
      <div className="max-w-3xl mx-auto px-5 md:px-10 pt-8">
        <Link
          href="/therapists"
          className="inline-flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary mb-6"
        >
          <ArrowLeft size={16} /> Back to therapists
        </Link>

        <div className="bg-surface-lowest rounded-large shadow-ambient overflow-hidden border border-outline-variant/20">
          <div className="h-64 md:h-72">
            <img src={therapist.img} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="p-8">
            <Badge variant="demo" className="mb-4">
              Demo data — not a verified licence
            </Badge>
            <h1 className="font-display text-headline-lg text-on-surface">{therapist.name}</h1>
            <p className="text-body-lg text-on-surface-variant mt-1">{therapist.title}</p>
            <p className="flex items-center gap-1 mt-3 text-label-md">
              <Star size={14} className="fill-amber-400 text-amber-400" /> {therapist.rating}
            </p>
            <p className="text-body-md text-on-surface-variant mt-5 mb-6">{therapist.bio}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {therapist.tags.map((t) => (
                <Badge key={t} variant="sage">
                  {t}
                </Badge>
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
              onClick={() => {
                setDayIdx(i);
                setTime(null);
              }}
              className={cn(
                'shrink-0 rounded-2xl px-4 py-3 min-w-[72px] text-center border transition-colors',
                dayIdx === i
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-low border-outline-variant/30 text-on-surface',
              )}
            >
              <div className="text-label-sm opacity-80">
                {d.toLocaleDateString(undefined, { weekday: 'short' })}
              </div>
              <div className="font-display text-lg">{d.getDate()}</div>
            </button>
          ))}
        </div>

        <p className="text-label-md text-on-surface mb-3">Available times</p>
        <div className="grid grid-cols-3 gap-2 mb-8">
          {slotsForDay.map((slot) => {
            const disabled = !slot.available;
            return (
              <button
                key={slot.time}
                type="button"
                disabled={disabled}
                onClick={() => setTime(slot.time)}
                className={cn(
                  'rounded-xl py-3 text-label-md border transition-colors min-h-[44px]',
                  disabled && 'opacity-35 cursor-not-allowed',
                  time === slot.time
                    ? 'bg-primary-fixed border-primary text-primary'
                    : 'bg-surface-lowest border-outline-variant/40 hover:bg-surface-low',
                )}
              >
                {slot.time}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="flex-1"
            disabled={!time || bookingLoading}
            loading={bookingLoading}
            onClick={() => void confirm()}
          >
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
