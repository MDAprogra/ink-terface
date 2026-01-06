'use server';

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

interface valueParam {
  m_name: string;
  m_id: string;
  m_isEntry: boolean;
}

export async function editMovementType(value: valueParam) {
  if (!value.m_name && !value.m_id) {
    throw new Error("Récupération de l'enregistrement impossible : Veuillez réessayer !");
  }

  try {
    // 2. Création en base
    // Vérifie bien le nom de ton modèle dans schema.prisma (ex: ItemType ou TypeItem)
    const editedMovementType = await prisma.movementType.update({
      where: {
        id: value.m_id,
      },
      data: {
        name: value.m_name,
        isEntry: value.m_isEntry,
      },
    });

    return { success: true, data: editedMovementType };
  } catch (error) {
    console.error('Erreur modification type mouvement:', error);
    // Gestion des doublons (erreur P2002 de Prisma)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Ce type de mouvement existe déjà.');
      }
    }
    throw new Error('Une erreur est survenue lors de la modification.');
  }
}
