import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export function TextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        'inline-flex min-h-11 items-center font-bold text-pink-ink underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink',
        className,
      )}
      {...props}
    />
  );
}
