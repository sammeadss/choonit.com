import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  if (tokenHash && type === 'email') {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type: 'email', token_hash: tokenHash });

    if (!error) {
      return NextResponse.redirect(new URL('/me', request.url));
    }
  }

  return NextResponse.redirect(new URL('/check-email?status=expired', request.url));
}
