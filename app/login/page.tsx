import { LogInForm } from './login-form';

export default function LogInPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="font-heading text-4xl font-extrabold">Welcome back.</h1>
      <LogInForm />
    </main>
  );
}
