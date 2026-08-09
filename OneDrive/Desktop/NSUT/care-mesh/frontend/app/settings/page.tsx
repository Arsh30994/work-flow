'use client';

import Link from 'next/link';
import { AppShell } from '@/components/navigation/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-5 md:px-8 pt-8 pb-12 space-y-6">
        <div>
          <h1 className="font-display text-headline-lg mb-2">Profile</h1>
          <p className="text-body-md text-on-surface-variant">Your personal space — never your legal name.</p>
        </div>

        <Card className="space-y-4">
          <Input label="Display name" defaultValue="Alex" name="displayName" />
          <label className="block">
            <span className="block text-label-md mb-2">Preferred language</span>
            <select
              className="w-full rounded-input bg-surface-lowest border border-outline-variant/50 px-4 py-3.5 text-body-md outline-none focus:ring-2 focus:ring-primary-fixed"
              defaultValue="en"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </label>
          <Button onClick={() => alert('Preferences saved (demo).')}>Save</Button>
        </Card>

        <Card>
          <h2 className="font-display text-headline-md mb-2">Upcoming sessions</h2>
          <p className="text-body-md text-on-surface-variant mb-4">Today · 2:00 PM with Dr. Sarah Jenkins</p>
          <Link href="/dashboard"><Button size="sm" variant="secondary">View dashboard</Button></Link>
        </Card>

        <Card>
          <h2 className="font-display text-headline-md mb-2">Saved resources</h2>
          <p className="text-body-md text-on-surface-variant mb-4">Nothing saved yet. When you find something useful, save it for later.</p>
          <Link href="/resources"><Button size="sm">Explore resources</Button></Link>
        </Card>

        <Card>
          <h2 className="font-display text-headline-md mb-2">Privacy</h2>
          <p className="text-body-md text-on-surface-variant mb-3">
            Identity stays separate from anonymous session signals. Risk events never store raw chat text.
          </p>
          <Badge variant="sage">Guest-friendly by design</Badge>
        </Card>

        <Card>
          <h2 className="font-display text-headline-md mb-3">Settings</h2>
          <Link href="/faq" className="text-primary text-label-md underline underline-offset-2 block mb-3">FAQ & boundaries</Link>
          <Link href="/login"><Button variant="outline" size="sm">Sign out</Button></Link>
        </Card>
      </div>
    </AppShell>
  );
}
