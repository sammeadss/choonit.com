import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { signOut } from '@/app/auth/actions';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { createClient } from '@/lib/supabase/server';

export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <Suspense>
        <ProfileContent />
      </Suspense>
    </main>
  );
}

async function ProfileContent() {
  // Supabase's token check reads the current time, so this must render at request time.
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  if (!userId) redirect('/login');

  const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);

  return (
    <>
      <h1 className="font-heading text-4xl font-extrabold">{profile?.username ?? 'Profile'}</h1>
      <p className="mt-2">
        {profile ? (profile.bio ?? 'No bio yet.') : "We couldn't find your profile."}
      </p>
      <form action={signOut} className="mt-6">
        <button type="submit">Log out</button>
      </form>
    </>
  );
}
