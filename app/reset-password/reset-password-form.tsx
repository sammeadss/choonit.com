'use client';

import { useActionState } from 'react';
import { updatePassword, type ResetPasswordState } from './actions';

const initialState: ResetPasswordState = {};

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        New password
        <input name="password" type="password" autoComplete="new-password" minLength={8} required />
        <span role="alert">{state.errors?.password?.[0]}</span>
      </label>

      <span role="alert">{state.errors?.form?.[0]}</span>

      <button type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save new password'}
      </button>
    </form>
  );
}
