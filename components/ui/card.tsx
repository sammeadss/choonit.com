import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('rounded-md border-2 border-ink bg-card p-5 shadow-card', className)}
      {...props}
    />
  );
}
