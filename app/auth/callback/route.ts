import { eq } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const [profile] = await db
        .select({ usernameChosen: profiles.usernameChosen })
        .from(profiles)
        .where(eq(profiles.id, data.user.id))
        .limit(1);

      const destination = profile && !profile.usernameChosen ? '/choose-username' : '/me';
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  // Cancelled, denied or failed sign-ins all land here.
  return NextResponse.redirect(new URL('/login?error=google', request.url));
}
