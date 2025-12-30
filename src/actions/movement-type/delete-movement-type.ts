'use server';

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export async function deleteMovementType(m_id: string) {
  if (!m_id) {
    throw new Error("Récupération de l'enregistrement impossible : Veuillez réessayer !");
  }

  try {
    // 2. Création en base
    // Vérifie bien le nom de ton modèle dans schema.prisma (ex: ItemType ou TypeItem)
    const deletedMovementType = await prisma.movementType.update({
      where: {
        id: m_id,
      },
      data: {
        isDeleted: true,
      },
    });

    return { success: true, data: deletedMovementType };
  } catch (error) {
    console.error('Erreur suppression type mouvement:', error);
    // Gestion des doublons (erreur P2002 de Prisma)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2001') {
        throw new Error("Ce type de produit n'existe pas.");
      }
    }
    throw new Error('Une erreur est survenue lors de la suppression.');
  }
}
