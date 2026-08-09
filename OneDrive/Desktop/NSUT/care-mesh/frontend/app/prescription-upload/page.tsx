'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PublicNav } from '@/components/navigation/PublicNav';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function PrescriptionUploadPage() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PublicNav />
      <div className="max-w-lg mx-auto px-5 pt-12">
        <Badge variant="demo" className="mb-4">Coming in production</Badge>
        <h1 className="font-display text-headline-lg mb-3">Prescription upload</h1>
        <p className="text-body-md text-on-surface-variant mb-8">
          Secure OCR and pharmacy fulfillment are outside this prototype. You can attach a file to preview the flow only.
        </p>
        <Card>
          <label className="block">
            <span className="text-label-md mb-2 block">Choose a file (demo)</span>
            <input
              type="file"
              accept="image/*,.pdf"
              className="block w-full text-label-md"
              onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
            />
          </label>
          {fileName && (
            <p className="mt-4 text-body-md text-on-surface">Selected: {fileName}</p>
          )}
          <Button
            className="mt-6"
            disabled={!fileName}
            onClick={() => alert('Demo only — file is not uploaded or processed.')}
          >
            Upload (demo)
          </Button>
        </Card>
        <Link href="/pharmacy" className="inline-block mt-8 text-label-md text-primary underline underline-offset-2">
          Back to pharmacy
        </Link>
      </div>
    </div>
  );
}
