'use server';

import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { getUserId } from '@/lib/auth';
import { chooseUsernameSchema } from '@/lib/validation/auth';

export type ChooseUsernameState = {
  errors?: { username?: string[]; form?: string[] };
  values?: { username: string };
};

// Postgres reports a unique-index violation as code 23505; Drizzle may wrap the driver in `cause`.
function isUniqueViolation(error: unknown) {
  const e = error as { code?: string; cause?: { code?: string } };
  return e.code === '23505' || e.cause?.code === '23505';
}

export async function saveUsername(
  _prev: ChooseUsernameState,
  formData: FormData,
): Promise<ChooseUsernameState> {
  const raw = String(formData.get('username') ?? '');
  const values = { username: raw };

  const parsed = chooseUsernameSchema.safeParse({ username: raw });
  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors, values };
  }

  const userId = await getUserId();
  if (!userId) redirect('/login');

  try {
    // Only profiles still on a generated name can use this; later changes go through Edit profile.
    await db
      .update(profiles)
      .set({ username: parsed.data.username, usernameChosen: true })
      .where(and(eq(profiles.id, userId), eq(profiles.usernameChosen, false)));
  } catch (error) {
    if (isUniqueViolation(error)) {
      return { errors: { username: ['That username is taken. Try another.'] }, values };
    }
    return { errors: { form: ['We could not save your username. Please try again.'] }, values };
  }

  redirect('/me');
}
