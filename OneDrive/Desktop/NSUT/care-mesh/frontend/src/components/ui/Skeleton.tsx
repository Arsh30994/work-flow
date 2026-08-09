import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn('shimmer-skeleton rounded-xl', className)}
      aria-hidden="true"
    />
  );
}

export function TherapistSkeleton() {
  return (
    <div className="bg-surface-lowest rounded-card p-5 shadow-ambient border border-outline-variant/20">
      <Skeleton className="w-full h-44 rounded-2xl mb-4" />
      <Skeleton className="h-5 w-2/3 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-10 w-full rounded-btn" />
    </div>
  );
}

export function ResourceSkeleton() {
  return (
    <div className="bg-surface-lowest rounded-card p-6 shadow-ambient">
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
