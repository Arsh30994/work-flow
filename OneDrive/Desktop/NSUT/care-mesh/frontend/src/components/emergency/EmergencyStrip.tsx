'use client';

import Link from 'next/link';
import { Phone } from 'lucide-react';

/**
 * Persistent muted emergency strip — visible, never frightening.
 */
export function EmergencyStrip() {
  return (
    <div
      role="region"
      aria-label="Emergency support"
      className="w-full bg-error-container/55 text-on-error-container border-b border-error/10"
    >
      <div className="max-w-content mx-auto px-5 md:px-10 py-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-label-sm md:text-label-md">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Phone size={14} aria-hidden />
          In crisis? Call{' '}
          <a href="tel:112" className="underline underline-offset-2 font-semibold hover:opacity-80">
            112
          </a>{' '}
          for emergency help.
        </span>
        <span className="hidden sm:inline text-on-error-container/50">·</span>
        <span>
          Talk to Tele-MANAS{' '}
          <a href="tel:14416" className="underline underline-offset-2 font-semibold hover:opacity-80">
            14416
          </a>
        </span>
        <Link
          href="/help"
          className="underline underline-offset-2 opacity-80 hover:opacity-100 ml-1"
        >
          Find help nearby
        </Link>
      </div>
    </div>
  );
}
