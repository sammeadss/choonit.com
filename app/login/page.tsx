import { Suspense } from 'react';
import { LogInForm } from './login-form';

export default function LogInPage(props: PageProps<'/login'>) {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="font-heading text-4xl font-extrabold">Welcome back.</h1>
      <Suspense>
        <GoogleError searchParams={props.searchParams} />
      </Suspense>
      <LogInForm />
    </main>
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
    <p role="alert" className="mt-4">
      Google sign-in didn&apos;t finish. It may have been cancelled. Try again, or log in with your
      email.
    </p>
  );
}
