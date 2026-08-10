'use client';

import { useParams } from 'next/navigation';
import { AdminSessionPanel } from '@/components/admin';

export default function AdminSessionPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="min-h-screen bg-surface-low">
      <AdminSessionPanel sessionId={id} />
    </div>
  );
}
