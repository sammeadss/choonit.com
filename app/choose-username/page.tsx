import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { getUserId } from '@/lib/auth';
import { ChooseUsernameForm } from './choose-username-form';

export default function ChooseUsernamePage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <Suspense>
        <ChooseUsernameContent />
      </Suspense>
    </main>
  );
}

async function ChooseUsernameContent() {
  // Supabase's token check reads the current time, so this must render at request time.
  await connection();
  const userId = await getUserId();
  if (!userId) redirect('/login');

  const [profile] = await db
    .select({ username: profiles.username, usernameChosen: profiles.usernameChosen })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (!profile || profile.usernameChosen) redirect('/me');

  return (
    <>
      <h1 className="font-heading text-4xl font-extrabold">Choose your username.</h1>
      <p className="mt-4">Pick the name that will show on your profile.</p>
      <ChooseUsernameForm defaultUsername={profile.username} />
    </>
  );
}
