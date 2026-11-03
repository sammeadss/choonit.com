'use client';

import { useActionState } from 'react';
import { resendConfirmation, type ResendState } from './actions';

const initialState: ResendState = {};

export function ResendConfirmationForm({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(resendConfirmation, initialState);

  return (
    <form action={formAction} className="mt-4">
      <input type="hidden" name="email" value={email} />
      <button type="submit" disabled={pending}>
        {pending ? 'Sending...' : 'Resend confirmation email'}
      </button>
      {state.sent ? <p role="status">Email sent. Check your inbox.</p> : null}
      {state.error ? <p role="alert">{state.error}</p> : null}
    </form>
  );
}
