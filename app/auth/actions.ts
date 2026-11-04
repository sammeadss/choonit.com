'use server';

import { redirect } from 'next/navigation';
import { getOrigin } from '@/lib/origin';
import { createClient } from '@/lib/supabase/server';

export async function signInWithGoogle() {
  const origin = await getOrigin();
  if (!origin) redirect('/login?error=google');

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) redirect('/login?error=google');
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
