'use client';

import { useActionState, useState } from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UsernameField } from '@/components/username-field';
import { useUsernameAvailability } from '@/lib/use-username-availability';
import { saveUsername, type ChooseUsernameState } from './actions';

const initialState: ChooseUsernameState = {};

export function ChooseUsernameForm({ defaultUsername }: { defaultUsername: string }) {
  const [state, formAction, pending] = useActionState(saveUsername, initialState);
  const [username, setUsername] = useState(defaultUsername);
  const status = useUsernameAvailability(username, username !== defaultUsername);
  const serverError = username === state.values?.username ? state.errors?.username?.[0] : undefined;

  return (
    <Card>
      <form action={formAction} noValidate className="flex flex-col gap-4">
        <UsernameField
          value={username}
          onChange={setUsername}
          status={status}
          serverError={serverError}
          idleHint="Replace the generated name to continue. Use 3 to 20 letters, numbers or underscores."
        />

        {state.errors?.form?.[0] ? <Alert>{state.errors.form[0]}</Alert> : null}

        <Button type="submit" disabled={status !== 'available' || pending}>
          {pending ? 'Saving...' : 'Save username'}
        </Button>
      </form>
    </Card>
  );
}
