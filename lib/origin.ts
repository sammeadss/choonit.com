import { headers } from 'next/headers';

export async function getOrigin() {
  return (await headers()).get('origin');
}
