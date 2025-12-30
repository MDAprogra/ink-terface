'use server';

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export async function deleteUnit(m_id: string) {
  if (!m_id) {
    throw new Error("Récupération de l'identifiant impossible : Veuillez réessayer !");
  }
  //console.log(m_id);
  try {
    const deletedUnit = await prisma.unit.update({
      where: {
        id: m_id,
      },
      data: {
        isDeleted: true,
      },
    });

    return { success: true, data: deletedUnit };
  } catch (error) {
    console.error('Erreur suppression unité:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2001') {
        throw new Error("Cette unité n'existe pas.");
      }
    }
    throw new Error('Une erreur est survenue lors de la suppression.');
  }
}
