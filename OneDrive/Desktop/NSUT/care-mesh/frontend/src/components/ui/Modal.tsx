'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'md' | 'lg' | 'xl';
  showClose?: boolean;
}

const widths = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  size = 'lg',
  showClose = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
          <motion.button
            type="button"
            aria-label="Close dialog backdrop"
            className="absolute inset-0 bg-[#1b1c1c]/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              'relative w-full rounded-modal bg-surface-lowest shadow-lift border border-outline-variant/20 p-8 md:p-10',
              widths[size],
              className,
            )}
          >
            {(title || showClose) && (
              <div className="flex items-start justify-between gap-4 mb-6">
                {title ? (
                  <h2 id="modal-title" className="font-display text-headline-md text-on-surface">
                    {title}
                  </h2>
                ) : (
                  <span />
                )}
                {showClose && onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full p-2 text-on-surface-variant hover:bg-surface-low transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
