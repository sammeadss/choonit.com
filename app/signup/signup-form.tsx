'use client';

import { useActionState, useState } from 'react';
import { GoogleButton } from '@/components/google-button';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OrDivider } from '@/components/ui/or-divider';
import { PasswordField } from '@/components/ui/password-field';
import { TextField } from '@/components/ui/text-field';
import { TextLink } from '@/components/ui/text-link';
import { UsernameField } from '@/components/username-field';
import { useUsernameAvailability } from '@/lib/use-username-availability';
import { signUp, type SignUpState } from './actions';

const initialState: SignUpState = {};

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [username, setUsername] = useState('');
  const status = useUsernameAvailability(username, username.length > 0);
  // The server's error only applies to the name it was given.
  const serverError = username === state.values?.username ? state.errors?.username?.[0] : undefined;

  return (
    <>
      <Card>
        <GoogleButton />
        <OrDivider />
        <form action={formAction} noValidate className="flex flex-col gap-4">
          <UsernameField
            value={username}
            onChange={setUsername}
            status={status}
            serverError={serverError}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            defaultValue={state.values?.email}
            required
            error={state.errors?.email?.[0]}
          />
          <PasswordField
            label="Password"
            name="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
            hint="Use at least 8 characters."
            error={state.errors?.password?.[0]}
          />

          {state.errors?.form?.[0] ? <Alert>{state.errors.form[0]}</Alert> : null}

          <Button type="submit" disabled={pending || status === 'taken'}>
            {pending ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </Card>
      <p className="mt-4">
        Already have an account? <TextLink href="/login">Log in</TextLink>
      </p>
    </>
  );
}
