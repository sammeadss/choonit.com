'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { AuthShell } from '@/components/auth-shell';
import { Alert } from '@/components/ui/alert';
import { Button, buttonStyles } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MailIcon } from '@/components/ui/icons';
import { TextField } from '@/components/ui/text-field';
import { TextLink } from '@/components/ui/text-link';
import { requestPasswordReset, type ForgotPasswordState } from './actions';

const initialState: ForgotPasswordState = {};
const headerAction = { href: '/signup', label: 'Sign up', variant: 'primary' } as const;

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  if (state.sentTo) {
    return (
      <AuthShell
        eyebrow="Reset password"
        title="Check your email."
        description="Open the link in that email to choose a new password."
        headerAction={headerAction}
      >
        <Card role="status">
          <MailIcon className="size-8" />
          <p className="mt-4">
            If there&apos;s an account for <strong>{state.sentTo}</strong>, we&apos;ve sent a link
            to reset its password. It can take a few minutes, and the link works once.
          </p>
          <Link href="/login" className={buttonStyles({ className: 'mt-5' })}>
            Back to log in
          </Link>
        </Card>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Reset password"
      title="Forgot your password?"
      description="Enter the email you signed up with and we'll send you a link to choose a new one."
      headerAction={headerAction}
    >
      <Card>
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
          {state.errors?.form?.[0] ? <Alert>{state.errors.form[0]}</Alert> : null}
          <Button type="submit" disabled={pending}>
            {pending ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>
      </Card>
      <div className="mt-4">
        <TextLink href="/login">Back to log in</TextLink>
      </div>
    </AuthShell>
  );
}
