import Link from 'next/link';
import type { ReactNode } from 'react';
import { buttonStyles } from '@/components/ui/button';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description?: string;
  headerAction?: { href: string; label: string; variant?: 'primary' | 'secondary' };
  children: ReactNode;
};

export function AuthShell({ eyebrow, title, description, headerAction, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-2 border-ink bg-royal">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="font-heading text-2xl font-extrabold text-on-royal focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-on-royal"
          >
            choonit
          </Link>
          {headerAction ? (
            <Link
              href={headerAction.href}
              className={buttonStyles({
                variant: headerAction.variant,
                className: 'min-h-11 w-auto px-4 text-sm focus-visible:outline-on-royal',
              })}
            >
              {headerAction.label}
            </Link>
          ) : null}
        </div>
      </header>

      <section className="bg-royal pb-24 pt-8 text-on-royal">
        <div className="mx-auto max-w-md px-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-on-royal-muted">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold leading-[1.05] text-balance tracking-tight">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-on-royal-muted text-pretty">{description}</p>
          ) : null}
        </div>
      </section>

      <main className="mx-auto -mt-16 w-full max-w-md flex-1 px-4 pb-10">{children}</main>
    </div>
  );
}
