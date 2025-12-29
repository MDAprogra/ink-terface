'use server';

// TODO: Voir si import moins "gros"
import { revalidatePath } from 'next/cache';

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export async function createTypeItem(name: string) {
  // 1. Validation basique
  if (!name || name.trim().length < 2) {
    throw new Error('Le nom doit contenir au moins 2 caractères.');
  }

  try {
    // 2. Création en base
    // Vérifie bien le nom de ton modèle dans schema.prisma (ex: ItemType ou TypeItem)
    const newItemType = await prisma.itemType.create({
      data: {
        name: name,
      },
    });

    // 3. Optionnel : Revalider le cache Next.js si tu n'utilises pas que TanStack Query
    revalidatePath('/dashboard/items');

    return { success: true, data: newItemType };
  } catch (error) {
    console.error('Erreur creation type:', error);
    // Gestion des doublons (erreur P2002 de Prisma)
    // TODO: A Régler plus tard
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Ce type de produit existe déjà.');
      }
    }
    throw new Error('Une erreur est survenue lors de la création.');
  }
}
