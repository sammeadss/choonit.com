'use server';

import { sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { createClient } from '@/lib/supabase/server';
import { signUpSchema, usernameSchema } from '@/lib/validation/auth';

export type UsernameStatus = 'available' | 'taken' | 'invalid';

export type SignUpState = {
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    form?: string[];
  };
  values?: { username: string; email: string };
};

// TODO: rate-limit before launch; lets callers enumerate usernames.
export async function checkUsername(raw: string): Promise<UsernameStatus> {
  const parsed = usernameSchema.safeParse(raw);
  if (!parsed.success) return 'invalid';

  const existing = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(sql`lower(${profiles.username}) = ${parsed.data.toLowerCase()}`)
    .limit(1);

  return existing.length > 0 ? 'taken' : 'available';
}

export async function signUp(_prev: SignUpState, formData: FormData): Promise<SignUpState> {
  const raw = {
    username: String(formData.get('username') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  };
  const values = { username: raw.username, email: raw.email };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors, values };
  }

  const origin = (await headers()).get('origin');
  if (!origin) {
    return { errors: { form: ['Something went wrong. Please try again.'] }, values };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    // Read by the on_auth_user_created trigger to create the profile.
    options: {
      data: { username: parsed.data.username },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    if (error.code === 'over_email_send_rate_limit') {
      return {
        errors: { form: ['Too many sign-up emails. Try again in a little while.'] },
        values,
      };
    }
    if (error.message.includes('Database error')) {
      return { errors: { username: ['That username was just taken. Try another.'] }, values };
    }
    return {
      errors: { form: ["We couldn't create your account. Check your details and try again."] },
      values,
    };
  }

  // redirect() throws internally, so it must stay outside any try/catch.
  redirect(`/check-email?email=${encodeURIComponent(parsed.data.email)}`);
}
