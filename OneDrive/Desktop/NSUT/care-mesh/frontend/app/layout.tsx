import './globals.css';
import type { Metadata } from 'next';
import { EmergencyStrip } from '@/components/emergency/EmergencyStrip';
import { BottomNav } from '@/components/navigation/BottomNav';

export const metadata: Metadata = {
  title: 'SoulCare — A calmer place to talk',
  description:
    'A private place to talk, with real human support when you need it. Anonymous, free, and calm.',
  keywords: 'mental health, wellness, support, therapy, crisis help, SoulCare',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-background text-on-surface min-h-screen flex flex-col antialiased font-sans">
        <EmergencyStrip />
        <div className="flex-1 flex flex-col pb-0">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
