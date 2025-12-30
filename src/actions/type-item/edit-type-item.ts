'use server';

import { revalidatePath } from 'next/cache';

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export async function editTypeItem(m_name: string, m_id: string) {
  if (!m_name && !m_id) {
    throw new Error("Récupération de l'enregistrement impossible : Veuillez réessayer !");
  }

  try {
    // 2. Création en base
    // Vérifie bien le nom de ton modèle dans schema.prisma (ex: ItemType ou TypeItem)
    const editedItemType = await prisma.itemType.update({
      where: {
        id: m_id,
      },
      data: {
        name: m_name,
      },
    });

    // 3. Optionnel : Revalider le cache Next.js si tu n'utilises pas que TanStack Query
    revalidatePath('/dashboard/items');

    return { success: true, data: editedItemType };
  } catch (error) {
    console.error('Erreur modification type:', error);
    // Gestion des doublons (erreur P2002 de Prisma)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Ce type de produit existe déjà.');
      }
    }
    throw new Error('Une erreur est survenue lors de la modification.');
  }
}
