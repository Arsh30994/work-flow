'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      sessionStorage.setItem('soulcare_user', 'alex');
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-surface-lowest rounded-large shadow-lift border border-outline-variant/25 p-8 md:p-10">
        <p className="font-display text-2xl font-semibold text-primary mb-6">SoulCare</p>
        <h1 className="font-display text-headline-md mb-2">Create your space</h1>
        <p className="text-body-md text-on-surface-variant mb-8">
          A display name is enough. We never require your legal name.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Display name" name="name" required placeholder="Alex" />
          <Input label="Email" type="email" name="email" required placeholder="you@email.com" />
          <Input label="Password" type="password" name="password" required placeholder="••••••••" minLength={8} />
          <Button type="submit" className="w-full" loading={loading}>
            Create account
          </Button>
        </form>
        <p className="text-center text-label-md text-on-surface-variant mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
