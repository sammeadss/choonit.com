import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary';

const base =
  'inline-flex min-h-12 w-full items-center justify-center rounded-md border-2 border-ink px-5 font-bold text-ink shadow-hard focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ink active:translate-x-px active:translate-y-px active:shadow-none disabled:cursor-not-allowed disabled:border-dashed disabled:bg-tint disabled:text-muted disabled:shadow-none';

const variants: Record<Variant, string> = {
  primary: 'bg-pink',
  secondary: 'bg-card',
};

export function buttonStyles({
  variant = 'primary',
  className,
}: { variant?: Variant; className?: string } = {}) {
  return cn(base, variants[variant], className);
}

export function Button({
  variant,
  className,
  ...props
}: ComponentProps<'button'> & { variant?: Variant }) {
  return <button className={buttonStyles({ variant, className })} {...props} />;
}
