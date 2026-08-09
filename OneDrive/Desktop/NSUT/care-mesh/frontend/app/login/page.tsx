'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
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
    <div className="min-h-screen relative flex items-center justify-center p-5">
      <img
        src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&h=1200&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#1b1c1c]/35 backdrop-blur-[2px]" />

      <div className="relative w-full max-w-md bg-surface-lowest/95 rounded-large shadow-lift border border-white/30 p-8 md:p-10">
        <p className="font-display text-2xl font-semibold text-primary mb-6">SoulCare</p>
        <h1 className="font-display text-headline-md text-on-surface mb-2">Welcome back to your space.</h1>
        <p className="text-body-md text-on-surface-variant mb-8">
          We&apos;re here for you, whenever you&apos;re ready.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Email address" type="email" name="email" required placeholder="you@email.com" autoComplete="email" />
          <Input label="Password" type="password" name="password" required placeholder="••••••••" autoComplete="current-password" />
          <Button type="submit" className="w-full" loading={loading}>
            Sign in →
          </Button>
        </form>

        <Button
          variant="outline"
          className="w-full mt-3"
          type="button"
          onClick={() => alert('Google OAuth — coming in production. Use email demo or continue as guest.')}
        >
          Continue with Google
        </Button>

        <p className="text-center text-label-md text-on-surface-variant mt-8">
          New to SoulCare?{' '}
          <Link href="/signup" className="text-primary font-semibold underline underline-offset-2">
            Create an account
          </Link>
        </p>
        <p className="text-center mt-4">
          <Link href="/consent" className="text-label-md text-on-surface-variant hover:text-primary">
            Or continue as guest →
          </Link>
        </p>
      </div>
    </div>
  );
}
