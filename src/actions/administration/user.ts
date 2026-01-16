'use server';

import { APIError } from 'better-auth';
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
  firstName: string;
  email: string;
  password: string;
  roleId: string;
};

export async function createUser(data: CreateUserInput) {
  //await requirePermission("view:admin"); // Idéalement une permission "role:create"

  const { name, firstName, email, password, roleId } = data;
  const fullName = `${firstName} ${name.toLocaleUpperCase()}`;
  const defaultPassword = password || 'ChangeMoi123!';

  try {
    const newUserResponse = await auth.api.signUpEmail({
      body: {
        email,
        password: defaultPassword,
        name: fullName,
      },
      asResponse: false,
    });
    await prisma.user.update({
      where: { email },
      data: { roleId: roleId },
    });

    revalidatePath('/app/admin/users');
    return { success: true, email: email, user: newUserResponse };
  } catch (e) {
    if (e instanceof APIError) {
      // Better Auth met souvent le message utilisateur dans 'body.message'
      return { success: false, error: e.body?.message || e.message };
    }

    if (e instanceof Error) {
      return { success: false, error: e.message };
    }

    return { success: false, error: 'Erreur interne du serveur' };
  }
}

export async function setIsInactive(id: string, vIsInactive: boolean) {
  try {
    await prisma.user.update({
      where: { id: id },
      data: { isInactive: vIsInactive },
    });
    return { success: true };
  } catch (e) {
    if (e instanceof APIError) {
      // Better Auth met souvent le message utilisateur dans 'body.message'
      return { success: false, error: e.body?.message || e.message };
    }

    if (e instanceof Error) {
      return { success: false, error: e.message };
    }

    return { success: false, error: 'Erreur interne du serveur' };
  }
}
