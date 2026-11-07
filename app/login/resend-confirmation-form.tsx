'use client';

import { useActionState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { resendConfirmation, type ResendState } from './actions';

const initialState: ResendState = {};

export function ResendConfirmationForm({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(resendConfirmation, initialState);

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-3">
      <input type="hidden" name="email" value={email} />
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? 'Sending...' : 'Resend confirmation email'}
      </Button>
      {state.sent ? (
        <p role="status" className="text-sm">
          <strong>Sent again.</strong> It can take a few minutes. Check your spam folder too.
        </p>
      ) : null}
      {state.error ? <Alert>{state.error}</Alert> : null}
    </form>
  );
}
