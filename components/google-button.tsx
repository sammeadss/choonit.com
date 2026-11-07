import { signInWithGoogle } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';

export function GoogleButton() {
  return (
    <form action={signInWithGoogle}>
      <Button type="submit" variant="secondary" className="gap-2">
        {/* TODO: swap in the official Google logo. */}
        <span
          aria-hidden="true"
          className="grid size-6 place-items-center rounded-full border-2 border-ink text-xs font-extrabold"
        >
          G
        </span>
        Continue with Google
      </Button>
    </form>
  );
}
