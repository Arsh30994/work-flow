import { cn } from '@/lib/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'sage' | 'sand' | 'muted' | 'demo' | 'error' | 'success';
  className?: string;
}

const styles = {
  sage: 'bg-primary-fixed text-on-primary-fixed',
  sand: 'bg-secondary-container text-on-secondary-container',
  muted: 'bg-surface-high text-on-surface-variant',
  demo: 'bg-error-container/70 text-on-error-container',
  error: 'bg-error-container text-on-error-container',
  success: 'bg-primary-fixed text-on-primary-fixed',
};

export function Badge({ children, variant = 'muted', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-label-sm font-medium',
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
