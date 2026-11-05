import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { AlertIcon } from './icons';

type AlertProps = {
  title?: string;
  children: ReactNode;
  id?: string;
  role?: 'alert' | 'status';
  className?: string;
};

export function Alert({ title, children, id, role = 'alert', className }: AlertProps) {
  return (
    <div
      id={id}
      role={role}
      className={cn('flex gap-3 rounded-md border-2 border-ink bg-tint p-3 text-sm', className)}
    >
      <AlertIcon className="mt-0.5 size-5 shrink-0" />
      <p>
        {title ? <strong className="font-bold text-pink-ink">{title} </strong> : null}
        {children}
      </p>
    </div>
  );
}
