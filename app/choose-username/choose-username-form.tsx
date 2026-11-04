'use client';

import { useActionState, useEffect, useState } from 'react';
import { checkUsername, type UsernameStatus } from '@/app/signup/actions';
import { saveUsername, type ChooseUsernameState } from './actions';

const initialState: ChooseUsernameState = {};

export function ChooseUsernameForm({ defaultUsername }: { defaultUsername: string }) {
  const [state, formAction, pending] = useActionState(saveUsername, initialState);
  const [username, setUsername] = useState(defaultUsername);
  const [result, setResult] = useState<{ name: string; status: UsernameStatus } | null>(null);

  useEffect(() => {
    if (username === defaultUsername) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      const status = await checkUsername(username);
      if (!cancelled) setResult({ name: username, status });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [username, defaultUsername]);

  const status =
    username === defaultUsername ? 'idle' : result?.name === username ? result.status : 'checking';

  const messages = {
    idle: 'Replace the generated name to continue. Use 3 to 20 letters, numbers or underscores.',
    checking: "Checking if it's available...",
    available: `${username} is available.`,
    taken: 'That username is taken. Try another.',
    invalid: 'Use 3 to 20 letters, numbers or underscores.',
  };

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        Username
        <input
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </label>

      <p role={status === 'taken' || status === 'invalid' ? 'alert' : 'status'}>
        {messages[status]}
      </p>
      <span role="alert">{state.errors?.username?.[0]}</span>
      <span role="alert">{state.errors?.form?.[0]}</span>

      <button type="submit" disabled={status !== 'available' || pending}>
        {pending ? 'Saving...' : 'Save username'}
      </button>
    </form>
  );
}
