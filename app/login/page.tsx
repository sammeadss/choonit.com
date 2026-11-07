import { Suspense } from 'react';
import { AuthShell } from '@/components/auth-shell';
import { Alert } from '@/components/ui/alert';
import { LogInForm } from './login-form';

export default function LogInPage(props: PageProps<'/login'>) {
  return (
    <AuthShell
      eyebrow="Log in"
      title="Welcome back."
      description="Your lists are right where you left them."
      headerAction={{ href: '/signup', label: 'Sign up', variant: 'primary' }}
    >
      <Suspense>
        <GoogleError searchParams={props.searchParams} />
      </Suspense>
      <LogInForm />
    </AuthShell>
  );
}

async function GoogleError({
  searchParams,
}: {
  searchParams: PageProps<'/login'>['searchParams'];
}) {
  const { error } = await searchParams;
  if (error !== 'google') return null;

  return (
    <Alert title="Google sign-in didn't finish." className="mb-4">
      It may have been cancelled. Try again, or log in with your email.
    </Alert>
  );
}
