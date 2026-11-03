'use server';

import { headers } from 'next/headers';
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

export type ResendState = { sent?: boolean; error?: string };

export async function resendConfirmation(
  _prev: ResendState,
  formData: FormData,
): Promise<ResendState> {
  const parsed = z.email().safeParse(String(formData.get('email') ?? ''));
  const origin = (await headers()).get('origin');
  if (!parsed.success || !origin) {
    return { error: 'Something went wrong. Please try again.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: parsed.data,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });

  if (error) {
    return {
      error:
        error.code === 'over_email_send_rate_limit'
          ? 'Too many emails sent. Try again in a little while.'
          : "We couldn't resend the email. Try again.",
    };
  }
  return { sent: true };
}
