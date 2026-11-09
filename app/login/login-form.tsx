'use client';

import { useActionState } from 'react';
import { GoogleButton } from '@/components/google-button';
import { ResendConfirmationForm } from '@/components/resend-confirmation-form';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OrDivider } from '@/components/ui/or-divider';
import { PasswordField } from '@/components/ui/password-field';
import { TextField } from '@/components/ui/text-field';
import { TextLink } from '@/components/ui/text-link';
import { logIn, type LogInState } from './actions';

const initialState: LogInState = {};

export function LogInForm() {
  const [state, formAction, pending] = useActionState(logIn, initialState);

  return (
    <>
      <Card>
        <GoogleButton />
        <OrDivider />
        <form action={formAction} noValidate className="flex flex-col gap-4">
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
            autoComplete="current-password"
            placeholder="Your password"
            required
            error={state.errors?.password?.[0]}
          />
          <TextLink href="/forgot-password" className="self-start">
            Forgot password?
          </TextLink>

          {state.unconfirmedEmail ? (
            <Alert title="Confirm your email first.">
              We sent a link to {state.unconfirmedEmail} when you signed up.
            </Alert>
          ) : null}
          {state.errors?.form?.[0] ? <Alert>{state.errors.form[0]}</Alert> : null}

          <Button type="submit" disabled={pending}>
            {pending ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
        {state.unconfirmedEmail ? <ResendConfirmationForm email={state.unconfirmedEmail} /> : null}
      </Card>
      <p className="mt-4">
        New here? <TextLink href="/signup">Sign up</TextLink>
      </p>
    </>
  );
}
