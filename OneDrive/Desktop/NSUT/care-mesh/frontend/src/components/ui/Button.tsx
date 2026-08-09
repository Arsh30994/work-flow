'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-container shadow-ambient hover:shadow-card',
  secondary:
    'bg-secondary-container text-on-secondary-container hover:bg-surface-high',
  ghost: 'bg-transparent text-primary hover:bg-primary-fixed/40',
  danger: 'bg-error-container text-on-error-container hover:bg-error/20',
  outline:
    'bg-transparent border border-outline-variant text-on-surface hover:bg-surface-low',
};

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-label-sm min-h-[40px]',
  md: 'px-5 py-3 text-label-md min-h-[44px]',
  lg: 'px-7 py-3.5 text-label-md min-h-[52px]',
  icon: 'p-3 min-h-[44px] min-w-[44px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-btn font-display font-medium',
        'transition-all duration-200 ease-calm',
        'hover:scale-[1.02] active:scale-[0.97]',
        'disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? <span className="opacity-80">Please wait…</span> : children}
    </button>
  ),
);
Button.displayName = 'Button';
