'use server';

import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { usernameSchema } from '@/lib/validation/auth';

export type UsernameStatus = 'available' | 'taken' | 'invalid';

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
