import Link from 'next/link';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { AuthShell } from '@/components/auth-shell';
import { buttonStyles } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getUserId } from '@/lib/auth';
import { ResetPasswordForm } from './reset-password-form';

const headerAction = { href: '/login', label: 'Log in', variant: 'secondary' } as const;

export default function ResetPasswordPage(props: PageProps<'/reset-password'>) {
  return (
    <Suspense>
      <ResetPasswordContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function ResetPasswordContent({
  searchParams,
}: {
  searchParams: PageProps<'/reset-password'>['searchParams'];
}) {
  // Supabase's token check reads the current time, so this must render at request time.
  await connection();
  const { status } = await searchParams;

  if (status === 'success') {
    return (
      <AuthShell
        eyebrow="Reset password"
        title="Password updated."
        description="You're signed out everywhere. Log in with your new password."
        headerAction={headerAction}
      >
        <Card role="status">
          <p>Your password has been changed.</p>
          <Link href="/login" className={buttonStyles({ className: 'mt-5' })}>
            Log in
          </Link>
        </Card>
      </AuthShell>
    );
  }

  if (status !== 'expired' && (await getUserId())) {
    return (
      <AuthShell
        eyebrow="Reset password"
        title="Choose a new password."
        description="You'll log in again with it afterwards."
        headerAction={headerAction}
      >
        <Card>
          <ResetPasswordForm />
        </Card>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Reset password"
      title="This link can't be used."
      description="It may have expired or already been used."
      headerAction={headerAction}
    >
      <Card>
        <p>Reset links work once and expire after an hour. Request a new one to continue.</p>
        <Link href="/forgot-password" className={buttonStyles({ className: 'mt-5' })}>
          Request a new link
        </Link>
      </Card>
    </AuthShell>
  );
}
