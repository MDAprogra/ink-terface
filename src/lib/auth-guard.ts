import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/lib/auth';

/**
 * Vérifie si l'utilisateur connecté possède une permission spécifique.
 * - Si pas connecté -> Redirige vers /sign-in
 * - Si pas la permission -> Renvoie une 404 (Not Found) pour la sécurité
 * * @param requiredPermission La permission requise (ex: "view:admin", "item:create")
 */
export async function requirePermission(requiredPermission: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 1. Si l'utilisateur n'est pas connecté
  if (!session) {
    redirect('/sign-in'); // Remplace par ta route de connexion si différente
  }

  // 2. Récupération des permissions (injectées via auth.ts)
  // On force le typage ici car TypeScript ne sait pas encore que 'permissions' a été ajouté à la session
  const userPermissions = ((session.user as any).permissions as string[]) || [];

  // 3. Si l'utilisateur n'a pas la permission requise
  if (!userPermissions.includes(requiredPermission)) {
    // On renvoie une 404 pour que les utilisateurs curieux ne sachent même pas que la page existe.
    // Tu pourrais aussi utiliser redirect("/") pour les renvoyer à l'accueil.
    notFound();
  }

  // 4. Tout est bon, on retourne la session
  return session;
}
