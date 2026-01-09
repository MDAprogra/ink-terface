'use server';

import { createId } from '@paralleldrive/cuid2';
import { revalidatePath } from 'next/cache';

import { requirePermission } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';

type CreateUserInput = {
  name: string;
  email: string;
  roleId: string;
};

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

export async function createUser(data: CreateUserInput) {
  //await requirePermission("view:admin"); // Idéalement une permission "role:create"

  const { name, email, roleId: role_id } = data;

  if (!name || !email) return { success: false, error: "Le nom et l'email sont requis" };

  try {
    await prisma.user.create({
      data: {
        id: createId(),
        name: name,
        email: email,
        roleId: role_id,
      },
    });
    //revalidatePath("/app/admin/roles");
    return { success: true };
  } catch (_e) {
    return { success: false, error: 'Erreur lors de la création (Email déjà utilisée?)' };
  }
}
