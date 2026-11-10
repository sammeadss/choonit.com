'use client';

import { useActionState } from 'react';
import { resendConfirmation, type ResendState } from '@/app/login/actions';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useCooldown } from '@/lib/use-cooldown';

// Matches Supabase's default 60 second minimum between emails to one address.
const COOLDOWN_SECONDS = 60;
const initialState: ResendState = {};

export function ResendConfirmationForm({
  email,
  startCooling = false,
}: {
  email: string;
  startCooling?: boolean;
}) {
  const { remaining, start } = useCooldown(startCooling ? COOLDOWN_SECONDS : 0);
  const [state, formAction, pending] = useActionState(
    async (previous: ResendState, formData: FormData) => {
      const result = await resendConfirmation(previous, formData);
      if (result.sent) start(COOLDOWN_SECONDS);
      return result;
    },
    initialState,
  );

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-3">
      <input type="hidden" name="email" value={email} />
      <Button type="submit" variant="secondary" disabled={pending || remaining > 0}>
        {pending
          ? 'Sending...'
          : remaining > 0
            ? `Resend in ${remaining}s`
            : 'Resend confirmation email'}
      </Button>
      {state.sent ? (
        <p role="status" className="text-sm">
          <strong>Sent again.</strong> It can take a few minutes. Check your spam folder too.
        </p>
      ) : null}
      {state.error ? <Alert>{state.error}</Alert> : null}
    </form>
  );
}
