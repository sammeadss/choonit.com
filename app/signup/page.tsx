import { SignUpForm } from './signup-form';

export default function SignUpPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="font-heading text-4xl font-extrabold">Make your list.</h1>
      <SignUpForm />
    </main>
  );
}
