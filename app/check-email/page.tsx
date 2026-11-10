import Link from 'next/link';
import { Suspense } from 'react';
import { AuthShell } from '@/components/auth-shell';
import { ResendConfirmationForm } from '@/components/resend-confirmation-form';
import { buttonStyles } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MailIcon } from '@/components/ui/icons';
import { TextLink } from '@/components/ui/text-link';

const headerAction = { href: '/login', label: 'Log in', variant: 'secondary' } as const;

export default function CheckEmailPage(props: PageProps<'/check-email'>) {
  return (
    <Suspense>
      <CheckEmailContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function CheckEmailContent({
  searchParams,
}: {
  searchParams: PageProps<'/check-email'>['searchParams'];
}) {
  const { email, status } = await searchParams;
  const address = typeof email === 'string' ? email : undefined;

  if (status === 'expired') {
    return (
      <AuthShell
        eyebrow="Confirm email"
        title="This link can't be used."
        description="Confirmation links work once and expire after an hour."
        headerAction={headerAction}
      >
        <Card>
          <p>
            If you already confirmed your email, log in. Otherwise, sign up again for a new link.
          </p>
          <Link href="/login" className={buttonStyles({ className: 'mt-5' })}>
            Log in
          </Link>
        </Card>
        <TextLink href="/signup" className="mt-4">
          Sign up again
        </TextLink>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Confirm email"
      title="Check your email."
      description="Open the link we sent to finish creating your account."
      headerAction={headerAction}
    >
      <Card>
        <MailIcon className="size-8" />
        <p className="mt-4">
          We sent a confirmation link
          {address ? (
            <>
              {' '}
              to <strong className="break-words">{address}</strong>
            </>
          ) : null}
          . It can take a few minutes. Check your spam folder too.
        </p>
        {address ? <ResendConfirmationForm email={address} startCooling /> : null}
      </Card>
      <TextLink href="/signup" className="mt-4">
        Use a different email
      </TextLink>
    </AuthShell>
  );
}
