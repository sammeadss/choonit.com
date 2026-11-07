import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Alert } from './alert';

type TextFieldProps = ComponentProps<'input'> & {
  label: string;
  hint?: string;
  error?: string;
  endSlot?: ReactNode;
};

export function TextField({ label, hint, error, endSlot, className, ...props }: TextFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          // text-base is 16px, which stops iOS Safari from zooming the page on focus.
          className={cn(
            'min-h-12 min-w-0 flex-1 rounded-md border-2 border-ink bg-card px-3 text-base placeholder:text-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink',
            error && 'border-[3px]',
            className,
          )}
          {...props}
        />
        {endSlot}
      </div>
      {hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? <Alert id={errorId}>{error}</Alert> : null}
    </div>
  );
}
