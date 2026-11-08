import { AuthShell } from '@/components/auth-shell';
import { SignUpForm } from './signup-form';

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Sign up"
      title="Make your list."
      description="Rank every record you hear, one comparison at a time."
      headerAction={{ href: '/login', label: 'Log in', variant: 'secondary' }}
    >
      <SignUpForm />
    </AuthShell>
  );
}
