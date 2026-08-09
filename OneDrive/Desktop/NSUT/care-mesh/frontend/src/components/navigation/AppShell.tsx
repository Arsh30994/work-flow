'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Activity,
  LifeBuoy,
  Settings,
  LogOut,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/cn';

const SIDEBAR = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/therapists', label: 'Therapists', icon: Users },
  { href: '/resources', label: 'Resources', icon: BookOpen },
  { href: '/journey', label: 'Tracker', icon: Activity },
  { href: '/help', label: 'Support', icon: LifeBuoy },
];

const TOP = [
  { href: '/therapists', label: 'Therapists' },
  { href: '/resources', label: 'Library' },
  { href: '/journey', label: 'Progress' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="hidden md:flex sticky top-0 z-30 h-16 items-center gap-6 px-6 border-b border-outline-variant/25 bg-surface-lowest/90 backdrop-blur-md">
        <Link href="/dashboard" className="font-display text-xl font-semibold text-primary">
          SoulCare
        </Link>
        <div className="flex-1 max-w-md">
          <label className="relative block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="search"
              placeholder="Search therapists, resources…"
              className="w-full rounded-full bg-surface-low border-0 pl-9 pr-4 py-2.5 text-body-md placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary-fixed outline-none"
            />
          </label>
        </div>
        <nav className="flex items-center gap-1 ml-auto" aria-label="App sections">
          {TOP.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-3 py-2 rounded-full text-label-md transition-colors',
                pathname.startsWith(item.href)
                  ? 'bg-primary-fixed/50 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-low',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-outline-variant/25 bg-surface-low/60 py-6 px-3">
          <nav className="flex flex-col gap-1 flex-1" aria-label="Sidebar">
            {SIDEBAR.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-label-md transition-colors min-h-[44px]',
                    active
                      ? 'bg-primary-fixed/55 text-primary'
                      : 'text-on-surface-variant hover:bg-surface-high/80 hover:text-on-surface',
                  )}
                >
                  <Icon size={18} strokeWidth={1.75} />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-outline-variant/30">
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-label-md text-on-surface-variant hover:bg-surface-high/80 min-h-[44px]"
            >
              <Settings size={18} strokeWidth={1.75} />
              Settings
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-label-md text-on-surface-variant hover:bg-surface-high/80 min-h-[44px]"
            >
              <LogOut size={18} strokeWidth={1.75} />
              Sign Out
            </Link>
          </div>
        </aside>

        <main className="flex-1 min-w-0 pb-24 md:pb-8">{children}</main>
      </div>
    </div>
  );
}
