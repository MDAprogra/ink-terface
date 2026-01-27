'use client';

import { ORG_ROLES, type OrgRole } from '@/auth/roles';
import { authClient } from '@/lib/auth-client';

export function usePermission() {
  const { data: session, isPending } = authClient.useSession();

  /**
   * Vérifie si l'utilisateur actuel a la permission demandée.
   * @param resource Le nom de la ressource (ex: 'catalog', 'member')
   * @param action L'action à vérifier (ex: 'create', 'read')
   */
  const can = (resource: string, action: string): boolean => {
    // 1. Si pas chargé ou pas connecté, c'est non
    if (isPending || !session?.user?.role) return false;

    // 2. On récupère le rôle typé
    const userRole = session.user.role as OrgRole;
    const roleConfig = ORG_ROLES[userRole];

    // 3. Si le rôle n'existe pas dans ta config, c'est non
    if (!roleConfig) return false;

    try {
      // 4. On appelle authorize (avec le hack 'as any' caché ici une fois pour toutes)
      const check = (roleConfig as any).authorize({
        [resource]: [action], // On formate correctement en tableau
      });

      return check.success;
    } catch (error) {
      console.error('Erreur de permission:', error);
      return false;
    }
  };

  return { can, isPending, role: session?.user?.role };
}
