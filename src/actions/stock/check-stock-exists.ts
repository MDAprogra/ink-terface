'use server';

import { prisma } from '@/lib/prisma'; // Adapte selon ton chemin d'import prisma

export const checkStockExists = async (referenceItem: string) => {
  if (!referenceItem) return false;

  try {
    const stock = await prisma.stock.findFirst({
      where: {
        item: {
          reference: referenceItem,
        },
      },
      select: { idItem: true }, // On sélectionne juste l'ID pour optimiser la perf
    });

    return !!stock; // Renvoie true si trouvé, false sinon
  } catch (error) {
    console.error('Erreur vérification stock:', error);
    return false;
  }
};
