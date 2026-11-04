'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getUserId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { resetPasswordSchema } from '@/lib/validation/auth';

export type ResetPasswordState = {
  errors?: { password?: string[]; form?: string[] };
};

export async function updatePassword(
  _prev: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    password: String(formData.get('password') ?? ''),
  });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const supabase = await createClient();

  if (!(await getUserId())) redirect('/reset-password?status=expired');

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    if (error.code === 'same_password') {
      return { errors: { password: ['Choose a password you are not already using.'] } };
    }
    if (error.code === 'weak_password') {
      return { errors: { password: ['Choose a stronger password.'] } };
    }
    return { errors: { form: ['We could not update your password. Please try again.'] } };
  }

  // End every session, including the recovery one, so the user logs in fresh.
  await supabase.auth.signOut({ scope: 'global' });
  redirect('/reset-password?status=success');
}
