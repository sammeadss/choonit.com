import { z } from 'zod';

export const usernameSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z0-9_]{3,20}$/, 'Use 3 to 20 letters, numbers or underscores.');

export const signUpSchema = z.object({
  username: usernameSchema,
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
