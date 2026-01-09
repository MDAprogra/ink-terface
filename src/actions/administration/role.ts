'use server';

import { prisma } from '@/lib/prisma';

type CreateRoleInput = {
  name: string;
  description?: string;
};
export async function getRoles() {
  //TODO: A décommenter une fois les roles et permissions (A VERIFIER)
  //await requirePermission('user:manage'); // 🔒 Sécurité

  return await prisma.role.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function createRole(data: CreateRoleInput) {
  //await requirePermission("view:admin"); // Idéalement une permission "role:create"

  const { name, description } = data;

  if (!name) return { success: false, error: 'Le nom est requis' };

  try {
    await prisma.role.create({
      data: { name, description },
    });
    //revalidatePath("/app/admin/roles");
    return { success: true };
  } catch (_e) {
    return { success: false, error: 'Erreur lors de la création (Nom déjà pris ?)' };
  }
}

// 3. Supprimer un rôle
export async function deleteRole(roleId: string) {
  //await requirePermission("view:admin");

  try {
    await prisma.role.delete({
      where: { id: roleId },
    });
    //revalidatePath("/app/admin/roles");
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Impossible de supprimer (Rôle utilisé ?)' };
  }
}
