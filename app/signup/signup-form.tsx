'use client';

import { useActionState } from 'react';
import { signUp, type SignUpState } from './actions';

const initialState: SignUpState = {};

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        Username
        <input
          name="username"
          type="text"
          autoComplete="username"
          defaultValue={state.values?.username}
          required
        />
        <span role="alert">{state.errors?.username?.[0]}</span>
      </label>

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
        <input name="password" type="password" autoComplete="new-password" minLength={8} required />
        <span role="alert">{state.errors?.password?.[0]}</span>
      </label>

      <span role="alert">{state.errors?.form?.[0]}</span>

      <button type="submit" disabled={pending}>
        {pending ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
