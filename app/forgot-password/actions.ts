'use server';

import { z } from 'zod';
import { getOrigin } from '@/lib/origin';
import { createClient } from '@/lib/supabase/server';
import { forgotPasswordSchema } from '@/lib/validation/auth';

export type ForgotPasswordState = {
  errors?: { email?: string[]; form?: string[] };
  sentTo?: string;
  values?: { email: string };
};

export async function requestPasswordReset(
  _prev: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const raw = { email: String(formData.get('email') ?? '') };
  const values = { email: raw.email };

  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors, values };
  }

  const origin = await getOrigin();
  if (!origin) {
    return { errors: { form: ['Something went wrong. Please try again.'] }, values };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/confirm`,
  });

  if (error) {
    const message =
      error.code === 'over_email_send_rate_limit'
        ? 'Too many emails sent. Try again in a little while.'
        : 'Something went wrong. Please try again.';
    return { errors: { form: [message] }, values };
  }

  // Same result whether or not an account exists, so this can't be used to look up emails.
  return { sentTo: parsed.data.email };
}
