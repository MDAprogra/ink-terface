'use server';

import { revalidatePath } from 'next/cache';

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export async function deleteTypeItem(m_id: string) {
  if (!m_id) {
    throw new Error("Récupération de l'identifiant impossible : Veuillez réessayer !");
  }
  console.log(m_id);
  try {
    const deletedItemType = await prisma.itemType.update({
      where: {
        id: m_id,
      },
      data: {
        isDeleted: true,
      },
    });

    revalidatePath('/dashboard/items');

    return { success: true, data: deletedItemType };
  } catch (error) {
    console.error('Erreur suppression type:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2001') {
        throw new Error("Ce type de produit n'existe pas.");
      }
    }
    throw new Error('Une erreur est survenue lors de la suppression.');
  }
}
