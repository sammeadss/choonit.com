import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { AuthShell } from '@/components/auth-shell';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { getUserId } from '@/lib/auth';
import { ChooseUsernameForm } from './choose-username-form';

export default function ChooseUsernamePage() {
  return (
    <AuthShell
      eyebrow="Almost there"
      title="Choose your username."
      description="Pick the name that will show on your profile."
    >
      <Suspense>
        <ChooseUsernameContent />
      </Suspense>
    </AuthShell>
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

  return <ChooseUsernameForm defaultUsername={profile.username} />;
}
