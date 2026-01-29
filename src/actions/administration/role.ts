//import { APIError } from 'better-auth';
'use server';

import { prisma } from '@/lib/prisma';

export async function updateRole(id: string, role: string) {
  try {
    await prisma.user.update({
      where: { id: id },
      data: { role: role },
    });
    return { success: true };
  } catch (e) {
    // if (e instanceof APIError) {
    //   // Better Auth met souvent le message utilisateur dans 'body.message'
    //   return { success: false, error: e.body?.message || e.message };
    // }

    if (e instanceof Error) {
      return { success: false, error: e.message };
    }

    return { success: false, error: 'Erreur interne du serveur' };
  }
}
