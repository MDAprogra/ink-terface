'use server';

import { prisma } from '@/lib/prisma'; // Adapte selon ton chemin d'import prisma

export const checkStockExists = async (idItem: string) => {
  if (!idItem) return false;

  try {
    const stock = await prisma.stock.findUnique({
      where: { idItem },
      select: { idItem: true }, // On sélectionne juste l'ID pour optimiser la perf
    });

    return !!stock; // Renvoie true si trouvé, false sinon
  } catch (error) {
    console.error('Erreur vérification stock:', error);
    return false;
  }
};
