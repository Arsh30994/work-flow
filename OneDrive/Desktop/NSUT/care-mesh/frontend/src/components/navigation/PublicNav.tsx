'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShieldAlert, User } from 'lucide-react';
import { cn } from '@/lib/cn';

const LINKS = [
  { href: '/chat', label: 'Talk' },
  { href: '/therapists', label: 'Therapists' },
  { href: '/help', label: 'Find Help' },
  { href: '/resources', label: 'Resources' },
  { href: '/pharmacy', label: 'Pharmacy' },
];

export function PublicNav({ translucent = true }: { translucent?: boolean }) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-outline-variant/20',
        translucent
          ? 'bg-background/80 backdrop-blur-md'
          : 'bg-background',
      )}
    >
      <div className="max-w-content mx-auto px-5 md:px-10 h-16 md:h-[72px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-8 min-w-0">
          <Link
            href="/"
            className="font-display text-xl md:text-2xl font-semibold text-primary tracking-tight shrink-0"
          >
            SoulCare
          </Link>
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-2 rounded-full text-label-md transition-colors duration-200',
                    active
                      ? 'bg-primary-fixed/60 text-primary'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-low',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/resources"
            className="hidden md:inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-label-md text-on-surface-variant hover:bg-surface-low transition-colors min-h-[44px]"
            aria-label="Search resources"
          >
            <Search size={16} />
            <span className="hidden xl:inline">Search</span>
          </Link>
          <Link
            href="/help"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-label-md text-error bg-error-container/40 hover:bg-error-container/70 transition-colors min-h-[44px]"
          >
            <ShieldAlert size={16} />
            <span className="hidden sm:inline">Emergency Support</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-surface-low hover:bg-surface-high p-2.5 min-h-[44px] min-w-[44px] text-on-surface-variant transition-colors"
            aria-label="Profile"
          >
            <User size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
