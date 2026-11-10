import { TextField } from '@/components/ui/text-field';
import type { UsernameAvailability } from '@/lib/use-username-availability';

type UsernameFieldProps = {
  value: string;
  onChange: (value: string) => void;
  status: UsernameAvailability;
  serverError?: string;
  idleHint?: string;
};

export function UsernameField({
  value,
  onChange,
  status,
  serverError,
  idleHint = '3 to 20 letters, numbers or underscores.',
}: UsernameFieldProps) {
  const hints = {
    idle: idleHint,
    checking: "Checking if it's available...",
    available: `${value} is available.`,
    taken: undefined,
    invalid: undefined,
  };
  const liveError =
    status === 'taken'
      ? 'That username is taken. Try another.'
      : status === 'invalid'
        ? 'Use 3 to 20 letters, numbers or underscores.'
        : undefined;

  return (
    <TextField
      label="Username"
      name="username"
      autoComplete="username"
      placeholder="your_name"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required
      hint={hints[status]}
      error={liveError ?? serverError}
    />
  );
}
