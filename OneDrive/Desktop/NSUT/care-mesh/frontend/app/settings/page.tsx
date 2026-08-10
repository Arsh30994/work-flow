'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/navigation/AppShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { authService, settingsApi, type SettingsData } from '@/services';

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [displayName, setDisplayName] = useState('Alex');
  const [language, setLanguage] = useState('en');
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    settingsApi.get().then((row) => {
      if (cancelled) return;
      setData(row);
      setDisplayName(row.profile.display_name || 'Alex');
      setLanguage(row.profile.preferred_language || 'en');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNote(null);
    try {
      if (authService.isAuthenticated()) {
        await settingsApi.updateProfile(displayName, language);
        setNote('Preferences saved.');
      } else {
        sessionStorage.setItem(
          'soulcare_user',
          JSON.stringify({
            userId: 'local',
            displayName,
            preferredLanguage: language,
            role: 'guest',
          }),
        );
        setNote('Saved locally (sign in to sync).');
      }
    } catch (err) {
      setNote(err instanceof Error ? err.message : 'Could not save');
    } finally {
      setSaving(false);
    }
  };

  const upcoming = data?.upcoming_sessions?.[0];

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-5 md:px-8 pt-8 pb-12 space-y-6">
        <div>
          <h1 className="font-display text-headline-lg mb-2">Profile</h1>
          <p className="text-body-md text-on-surface-variant">Your personal space — never your legal name.</p>
        </div>

        {!data ? (
          <Skeleton className="h-48 w-full rounded-card" />
        ) : (
          <Card className="space-y-4">
            <form onSubmit={onSave} className="space-y-4">
              <Input
                label="Display name"
                name="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <label className="block">
                <span className="block text-label-md mb-2">Preferred language</span>
                <select
                  className="w-full rounded-input bg-surface-lowest border border-outline-variant/50 px-4 py-3.5 text-body-md outline-none focus:ring-2 focus:ring-primary-fixed"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </label>
              {note && <p className="text-label-md text-on-surface-variant">{note}</p>}
              <Button type="submit" loading={saving}>
                Save
              </Button>
            </form>
          </Card>
        )}

        <Card>
          <h2 className="font-display text-headline-md mb-2">Upcoming sessions</h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            {upcoming
              ? `${upcoming.date} · ${upcoming.time} with ${upcoming.therapist_name}`
              : 'No upcoming sessions yet.'}
          </p>
          <Link href="/dashboard">
            <Button size="sm" variant="secondary">
              View dashboard
            </Button>
          </Link>
        </Card>

        <Card>
          <h2 className="font-display text-headline-md mb-2">Saved resources</h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            {data?.saved_resource_ids?.length
              ? `${data.saved_resource_ids.length} saved`
              : 'Nothing saved yet. When you find something useful, save it for later.'}
          </p>
          <Link href="/resources">
            <Button size="sm">Explore resources</Button>
          </Link>
        </Card>

        <Card>
          <h2 className="font-display text-headline-md mb-2">Privacy</h2>
          <p className="text-body-md text-on-surface-variant mb-3">
            {data?.privacy_note ||
              'Identity stays separate from anonymous session signals. Risk events never store raw chat text.'}
          </p>
          <Badge variant="sage">Guest-friendly by design</Badge>
        </Card>

        <Card>
          <h2 className="font-display text-headline-md mb-3">Settings</h2>
          <Link href="/faq" className="text-primary text-label-md underline underline-offset-2 block mb-3">
            FAQ & boundaries
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              authService.logout();
              window.location.href = '/login';
            }}
          >
            Sign out
          </Button>
        </Card>
      </div>
    </AppShell>
  );
}
