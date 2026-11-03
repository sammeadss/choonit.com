import { ForgotPasswordForm } from './forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="font-heading text-4xl font-extrabold">Forgot your password?</h1>
      <ForgotPasswordForm />
    </main>
  );
}
