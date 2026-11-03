'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { requestPasswordReset, type ForgotPasswordState } from './actions';

const initialState: ForgotPasswordState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  if (state.sentTo) {
    return (
      <div role="status" className="mt-6">
        <p>
          If there&apos;s an account for {state.sentTo}, we&apos;ve sent a link to reset its
          password. It can take a few minutes, and the link works once.
        </p>
        <p className="mt-4">
          <Link href="/login">Back to log in</Link>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <p>Enter the email you signed up with and we&apos;ll send you a link to choose a new one.</p>

      <label className="flex flex-col gap-1">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.values?.email}
          required
        />
        <span role="alert">{state.errors?.email?.[0]}</span>
      </label>

      <span role="alert">{state.errors?.form?.[0]}</span>

      <button type="submit" disabled={pending}>
        {pending ? 'Sending...' : 'Send reset link'}
      </button>

      <Link href="/login">Back to log in</Link>
    </form>
  );
}
