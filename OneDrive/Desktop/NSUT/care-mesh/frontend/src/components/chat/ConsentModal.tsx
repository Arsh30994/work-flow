'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Bot, Lock, Phone } from 'lucide-react';

interface ConsentModalProps {
  open: boolean;
  onContinue: () => void;
  onGuest: () => void;
  onClose?: () => void;
}

export function ConsentModal({ open, onContinue, onGuest, onClose }: ConsentModalProps) {
  return (
    <Modal open={open} onClose={onClose} showClose={!!onClose} size="lg">
      <div className="space-y-8">
        <div>
          <h2 className="font-display text-headline-lg text-on-surface mb-3">Before we begin</h2>
          <p className="text-body-md text-on-surface-variant">
            A few gentle things to know — then you can talk whenever you&apos;re ready.
          </p>
        </div>

        <ul className="space-y-5">
          <li className="flex gap-4">
            <div className="shrink-0 w-11 h-11 rounded-2xl bg-primary-fixed/50 flex items-center justify-center text-primary">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-display text-body-lg font-medium text-on-surface mb-1">
                You&apos;ll be talking to an AI
              </h3>
              <p className="text-body-md text-on-surface-variant">
                This is not a human counsellor. If something serious comes up, we can help you reach a real person.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="shrink-0 w-11 h-11 rounded-2xl bg-secondary-container flex items-center justify-center text-secondary">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="font-display text-body-lg font-medium text-on-surface mb-1">
                We keep almost nothing
              </h3>
              <p className="text-body-md text-on-surface-variant">
                Conversations aren&apos;t stored as a lasting record. Risk signals never include your raw message text.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="shrink-0 w-11 h-11 rounded-2xl bg-error-container/60 flex items-center justify-center text-error">
              <Phone size={20} />
            </div>
            <div>
              <h3 className="font-display text-body-lg font-medium text-on-surface mb-1">
                Emergency help is always one tap away
              </h3>
              <p className="text-body-md text-on-surface-variant">
                Call <strong>112</strong> for emergencies, or Tele-MANAS <strong>14416</strong> for mental health support.
              </p>
            </div>
          </li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button className="flex-1" onClick={onContinue}>
            I understand, continue
          </Button>
          <Button className="flex-1" variant="secondary" onClick={onGuest}>
            Continue as guest
          </Button>
        </div>
      </div>
    </Modal>
  );
}
