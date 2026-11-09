import { useEffect, useState } from 'react';

export function useCooldown(initialSeconds = 0) {
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (remaining <= 0) return;

    const timer = setTimeout(() => setRemaining((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  return { remaining, start: (seconds: number) => setRemaining(seconds) };
}
