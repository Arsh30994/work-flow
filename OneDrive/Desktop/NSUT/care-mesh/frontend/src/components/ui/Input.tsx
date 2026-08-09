import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <label className="block w-full">
        {label && (
          <span className="block text-label-md text-on-surface mb-2">{label}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-input bg-surface-lowest border border-outline-variant/50',
            'px-4 py-3.5 text-body-md text-on-surface placeholder:text-on-surface-variant/60',
            'transition-colors duration-200',
            'focus:border-primary focus:ring-2 focus:ring-primary-fixed/60 focus:outline-none',
            error && 'border-error focus:ring-error-container',
            className,
          )}
          {...props}
        />
        {(hint || error) && (
          <span className={cn('mt-1.5 block text-label-sm', error ? 'text-error' : 'text-on-surface-variant')}>
            {error || hint}
          </span>
        )}
      </label>
    );
  },
);
Input.displayName = 'Input';
