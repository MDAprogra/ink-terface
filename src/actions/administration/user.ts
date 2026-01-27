'use server';

import { APIError } from 'better-auth';
import { revalidatePath } from 'next/cache';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

// // 3. Modifier le rôle d'un utilisateur
// export async function updateUserRole(userId: string, roleId: string) {
//   try {
//     //TODO: A décommenter une fois les roles et permissions

//     await prisma.user.update({
//       where: { id: userId },
//       data: { roleId },
//     });

//     // Rafraîchir la page admin pour voir le changement immédiatement
//     revalidatePath('/app/admin/users');

//     return { success: true };
//   } catch (error) {
//     console.error('Erreur update role:', error);
//     return { success: false, error: 'Impossible de modifier le rôle.' };
//   }
// }

type CreateUserInput = {
  name: string;
  firstName: string;
  email: string;
  password: string;
  roleId: string;
};

export async function createUser(data: CreateUserInput) {
  const { name, firstName, email, password } = data;
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
