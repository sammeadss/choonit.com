import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Where each kind of emailed link sends the user after token is checked.
const DESTINATIONS = {
  email: { success: '/me', failure: '/check-email?status=expired' },
  recovery: { success: '/reset-password', failure: '/reset-password?status=expired' },
} as const;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  if (tokenHash && (type === 'email' || type === 'recovery')) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    const destination = DESTINATIONS[type];

    return NextResponse.redirect(
      new URL(error ? destination.failure : destination.success, request.url),
    );
  }

  // Expired, already-used and malformed links all land here; don't reveal which.
  return NextResponse.redirect(new URL('/check-email?status=expired', request.url));
}
