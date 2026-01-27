import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/lib/auth';

export async function requirePermission(requiredPermission: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  const userPermissions = ((session.user as any).permissions as string[]) || [];

  if (!userPermissions.includes(requiredPermission)) {
    notFound();
  }
  return session;
}
