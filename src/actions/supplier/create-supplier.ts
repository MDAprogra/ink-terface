'use server';

import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export async function createSupplier(name: string) {
  // 1. Validation basique
  if (!name || name.trim().length < 2) {
    throw new Error('Le nom doit contenir au moins 2 caractères.');
  }

  try {
    // 2. Création en base
    // Vérifie bien le nom de ton modèle dans schema.prisma (ex: ItemType ou TypeItem)
    const newSupplier = await prisma.supplier.create({
      data: {
        name: name,
      },
    });

    return { success: true, data: newSupplier };
  } catch (error) {
    console.error('Erreur creation fournisseur:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Ce fournisseur existe déjà.');
      }
    }
    throw new Error('Une erreur est survenue lors de la création.');
  }
}
