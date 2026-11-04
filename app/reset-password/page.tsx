import Link from 'next/link';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { getUserId } from '@/lib/auth';
import { ResetPasswordForm } from './reset-password-form';

export default function ResetPasswordPage(props: PageProps<'/reset-password'>) {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <Suspense>
        <ResetPasswordContent searchParams={props.searchParams} />
      </Suspense>
    </main>
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
      <>
        <h1 className="font-heading text-4xl font-extrabold">Password updated.</h1>
        <p className="mt-4" role="status">
          Your password has been changed. Log in with it next.
        </p>
        <p className="mt-6">
          <Link href="/login">Log in</Link>
        </p>
      </>
    );
  }

  if (status !== 'expired' && (await getUserId())) {
    return (
      <>
        <h1 className="font-heading text-4xl font-extrabold">Choose a new password.</h1>
        <ResetPasswordForm />
      </>
    );
  }

  return (
    <>
      <h1 className="font-heading text-4xl font-extrabold">This link can&apos;t be used.</h1>
      <p className="mt-4">
        Reset links work once and expire after an hour. Request a new one to continue.
      </p>
      <p className="mt-6">
        <Link href="/forgot-password">Request a new link</Link>
      </p>
    </>
  );
}
