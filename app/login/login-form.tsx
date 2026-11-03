'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { logIn, type LogInState } from './actions';

const initialState: LogInState = {};

export function LogInForm() {
  const [state, formAction, pending] = useActionState(logIn, initialState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
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

      <label className="flex flex-col gap-1">
        Password
        <input name="password" type="password" autoComplete="current-password" required />
        <span role="alert">{state.errors?.password?.[0]}</span>
      </label>

      <Link href="/forgot-password">Forgot password?</Link>

      {state.unconfirmedEmail ? (
        <p role="alert">
          Confirm your email first. We sent a link to {state.unconfirmedEmail} when you signed up.
        </p>
      ) : null}
      <span role="alert">{state.errors?.form?.[0]}</span>

      <button type="submit" disabled={pending}>
        {pending ? 'Logging in...' : 'Log in'}
      </button>

      <p>
        New here? <Link href="/signup">Sign up</Link>
      </p>
    </form>
  );
}
