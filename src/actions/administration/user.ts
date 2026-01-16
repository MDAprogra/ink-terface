'use server';

import { createId } from '@paralleldrive/cuid2';
import { revalidatePath } from 'next/cache';

import { auth } from '@/lib/auth';
import { requirePermission } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';

export async function getUsers() {
  //TODO: A décommenter une fois les roles et permissions
  //await requirePermission('user:manage'); // 🔒 Sécurité

  return await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      role: true, // On veut le nom du rôle
    },
  });
}

// 2. Récupérer la liste des rôles disponibles (pour le select)
export async function getAllRoles() {
  //TODO: A décommenter une fois les roles et permissions
  //await requirePermission('user:manage');

  return await prisma.role.findMany({
    orderBy: { name: 'asc' },
  });
}

// 3. Modifier le rôle d'un utilisateur
export async function updateUserRole(userId: string, roleId: string) {
  try {
    //TODO: A décommenter une fois les roles et permissions
    //await requirePermission('user:manage'); // 🔒 Seul un admin peut faire ça

    await prisma.user.update({
      where: { id: userId },
      data: { roleId },
    });

    // Rafraîchir la page admin pour voir le changement immédiatement
    revalidatePath('/app/admin/users');

    return { success: true };
  } catch (error) {
    console.error('Erreur update role:', error);
    return { success: false, error: 'Impossible de modifier le rôle.' };
  }
}

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export async function createUser(data: CreateUserInput) {
  //await requirePermission("view:admin"); // Idéalement une permission "role:create"

  const { name, email, password } = data;
  const defaultPassword = password || 'ChangeMoi123!';
  //if (!name || !email) return { success: false, error: "Le nom et l'email sont requis" };

  try {
    // 1. TENTATIVE DE CRÉATION
    // Si ça échoue (ex: email déjà pris), Better Auth VA STOPPER ICI et aller dans le "catch"
    const newUserResponse = await auth.api.signUpEmail({
      body: {
        email,
        password: defaultPassword,
        name,
      },
      asResponse: false,
    });

    revalidatePath('/app/admin/users');
    return { success: true };
  } catch (e: any) {
    // 3. GESTION DES ERREURS
    // Better Auth renvoie souvent l'erreur dans e.body.message ou e.message

    console.error('Erreur création user:', e);

    // On essaie de récupérer le message précis de Better Auth (ex: "User already exists")
    const errorMessage = e.body?.message || e.message || "Impossible de créer l'utilisateur.";

    return { success: false, error: errorMessage };
  }
}
