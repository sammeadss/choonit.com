'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { logInSchema } from '@/lib/validation/auth';

export type LogInState = {
  errors?: { email?: string[]; password?: string[]; form?: string[] };
  unconfirmedEmail?: string;
  values?: { email: string };
};

export async function logIn(_prev: LogInState, formData: FormData): Promise<LogInState> {
  const raw = {
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  };
  const values = { email: raw.email };

  const parsed = logInSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors, values };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    if (error.code === 'email_not_confirmed') {
      return { unconfirmedEmail: parsed.data.email, values };
    }
    return { errors: { form: ["That email or password isn't right."] }, values };
  }

  redirect('/me');
}
