import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, padding = 'md', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-surface-lowest rounded-card border border-outline-variant/25 shadow-ambient',
        hover &&
          'transition-all duration-300 ease-calm hover:-translate-y-[3px] hover:scale-[1.01] hover:shadow-lift cursor-pointer',
        paddings[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
Card.displayName = 'Card';
