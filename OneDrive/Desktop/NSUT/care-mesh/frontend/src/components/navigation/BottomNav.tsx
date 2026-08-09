'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageCircle, Users, LifeBuoy, User } from 'lucide-react';
import { cn } from '@/lib/cn';

const ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chat', label: 'Talk', icon: MessageCircle },
  { href: '/therapists', label: 'Therapists', icon: Users },
  { href: '/help', label: 'Help', icon: LifeBuoy },
  { href: '/settings', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  // Hide on immersive chat/call where chrome competes with keyboard
  if (pathname.startsWith('/chat') || pathname.startsWith('/call') || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-outline-variant/30 bg-surface-lowest/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5 h-16">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/'
              ? pathname === '/'
              : pathname === href || pathname.startsWith(href + '/');
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 h-full text-[11px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-on-surface-variant',
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.25 : 1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
