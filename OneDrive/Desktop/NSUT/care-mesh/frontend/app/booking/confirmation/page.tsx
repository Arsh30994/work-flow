'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Calendar, ArrowLeft } from 'lucide-react';
import { PublicNav } from '@/components/navigation/PublicNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useBookingConfirmation } from '@/hooks';
import type { Booking } from '@/types';

function buildIcs(b: Booking) {
  const start = new Date(b.date);
  const [hh, mm] = b.time.split(':').map(Number);
  if (!Number.isNaN(hh)) start.setHours(hh, mm || 0, 0, 0);
  const end = new Date(start.getTime() + 50 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SoulCare//EN',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:SoulCare session with ${b.therapistName}`,
    `DESCRIPTION:${b.sessionType}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

function ConfirmationInner() {
  const params = useSearchParams();
  const bookingId = params.get('id');
  const { booking, loading, error } = useBookingConfirmation(bookingId);

  const downloadIcs = () => {
    if (!booking) return;
    const blob = new Blob([buildIcs(booking)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'soulcare-session.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  const whenLabel = booking
    ? `${new Date(booking.date).toLocaleDateString(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })} · ${booking.time}`
    : '';

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <div className="max-w-lg mx-auto px-5 pt-16 pb-24 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary-fixed/60 text-primary flex items-center justify-center mb-6">
          <Check size={28} strokeWidth={2.5} />
        </div>
        <h1 className="font-display text-headline-lg text-on-surface mb-8">Your session is booked</h1>

        {loading ? (
          <Skeleton className="h-24 w-full rounded-card mb-8" />
        ) : booking ? (
          <Card className="text-left mb-8 space-y-4">
            {booking.bookingId && (
              <div>
                <p className="text-label-sm text-on-surface-variant">Confirmation</p>
                <p className="font-mono text-sm">{booking.bookingId}</p>
              </div>
            )}
            <div>
              <p className="text-label-sm text-on-surface-variant">Therapist</p>
              <p className="font-display text-body-lg">{booking.therapistName}</p>
            </div>
            <div>
              <p className="text-label-sm text-on-surface-variant">When</p>
              <p className="font-display text-body-lg">{whenLabel}</p>
            </div>
            <div>
              <p className="text-label-sm text-on-surface-variant">Session type</p>
              <p className="font-display text-body-lg">{booking.sessionType}</p>
            </div>
          </Card>
        ) : (
          <p className="text-on-surface-variant mb-8">
            {error || 'No booking found. Choose a therapist to schedule.'}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {booking && (
            <Button onClick={downloadIcs}>
              <Calendar size={16} /> Add to calendar
            </Button>
          )}
          <Link href="/therapists">
            <Button variant="secondary" className="w-full">
              <ArrowLeft size={16} /> Back to therapists
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <PublicNav />
          <div className="max-w-lg mx-auto px-5 pt-16">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-6" />
          </div>
        </div>
      }
    >
      <ConfirmationInner />
    </Suspense>
  );
}
