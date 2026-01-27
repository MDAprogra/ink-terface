import { headers } from 'next/headers';

import { ORG_ROLES, type OrgRole } from '@/auth/roles';
import { auth } from '@/lib/auth';

interface RoleWithAuthorize {
  authorize: (request: Record<string, string[]>) => { success: boolean; error?: string };
}

export async function requirePermission(resource: string, action: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('🔒 Vous devez être connecté pour effectuer cette action.');
  }

  const userRole = session.user.role as OrgRole;
  const roleConfig = ORG_ROLES[userRole];

  if (!roleConfig) {
    throw new Error('🚫 Votre rôle est invalide ou inconnu.');
  }

  const check = (roleConfig as unknown as RoleWithAuthorize).authorize({
    [resource]: [action],
  });

  if (!check.success) {
    throw new Error(" Vous n'avez pas la permission d'effectuer cette action.");
  }

  return session;
}
