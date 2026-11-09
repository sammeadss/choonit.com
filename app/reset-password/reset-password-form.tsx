'use client';

import { useActionState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PasswordField } from '@/components/ui/password-field';
import { updatePassword, type ResetPasswordState } from './actions';

const initialState: ResetPasswordState = {};

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <PasswordField
        label="New password"
        name="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        required
        hint="Use at least 8 characters."
        error={state.errors?.password?.[0]}
      />

      {state.errors?.form?.[0] ? <Alert>{state.errors.form[0]}</Alert> : null}

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save new password'}
      </Button>
    </form>
  );
}
