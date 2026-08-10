'use client';

import Link from 'next/link';
import { AdminSessionTable } from '@/components/admin';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-surface-low">
      <header className="bg-surface-lowest border-b border-outline-variant/30 px-5 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-display font-semibold text-primary">
            SoulCare
          </Link>
          <span className="text-label-md text-on-surface-variant">Counsellor console</span>
        </div>
      </header>
      <AdminSessionTable />
    </div>
  );
}
