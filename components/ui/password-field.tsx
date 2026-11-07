'use client';

import { useState, type ComponentProps } from 'react';
import { Button } from './button';
import { TextField } from './text-field';

export function PasswordField(props: Omit<ComponentProps<typeof TextField>, 'type' | 'endSlot'>) {
  const [shown, setShown] = useState(false);

  return (
    <TextField
      {...props}
      type={shown ? 'text' : 'password'}
      endSlot={
        <Button
          type="button"
          variant="secondary"
          className="w-auto px-4 text-sm"
          aria-label={shown ? 'Hide password' : 'Show password'}
          onClick={() => setShown((value) => !value)}
        >
          {shown ? 'Hide' : 'Show'}
        </Button>
      }
    />
  );
}
