import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { createClient } from '@/lib/supabase/server';

// Id of the signed-in user, or null. Cached per request so repeated calls verify token once.
export const getUserId = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims.sub ?? null;
});

export async function requireProfile() {
  const userId = await getUserId();
  if (!userId) redirect('/login');

  const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
  if (profile && !profile.usernameChosen) redirect('/choose-username');

  return profile ?? null;
}
