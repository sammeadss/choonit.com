import Link from 'next/link';
import { Suspense } from 'react';

export default function CheckEmailPage(props: PageProps<'/check-email'>) {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <Suspense>
        <CheckEmailContent searchParams={props.searchParams} />
      </Suspense>
    </main>
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
      <>
        <h1 className="font-heading text-4xl font-extrabold">This link can&apos;t be used.</h1>
        <p className="mt-4">
          Confirmation links work once and expire after an hour. If you already confirmed your
          email, log in. Otherwise, sign up again to get a new link.
        </p>
        <p className="mt-6 flex gap-4">
          <Link href="/login">Log in</Link>
          <Link href="/signup">Sign up again</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1 className="font-heading text-4xl font-extrabold">Check your email.</h1>
      <p className="mt-4">
        We sent a confirmation link{address ? ` to ${address}` : ''}. Open it to finish creating
        your account.
      </p>
      <p className="mt-6 flex gap-4">
        <Link href="/signup">Use a different email</Link>
        <Link href="/login">Back to log in</Link>
      </p>
    </>
  );
}
