import { useEffect, useState } from 'react';
import { checkUsername, type UsernameStatus } from '@/app/signup/actions';

export type UsernameAvailability = UsernameStatus | 'idle' | 'checking';

export function useUsernameAvailability(username: string, enabled: boolean): UsernameAvailability {
  const [result, setResult] = useState<{ name: string; status: UsernameStatus } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      const status = await checkUsername(username);
      if (!cancelled) setResult({ name: username, status });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [username, enabled]);

  if (!enabled) return 'idle';
  return result?.name === username ? result.status : 'checking';
}
