'use server';

import { prisma } from '@/lib/prisma'; // Adapte selon ton chemin d'import prisma

export const checkStockExists = async (referenceItem: string) => {
  console.log(referenceItem);
  if (!referenceItem) return false;

  try {
    const item = await prisma.item.findFirst({
      where: { reference: referenceItem },
      select: { id: true }, // On sélectionne juste l'ID pour optimiser la perf
    });
    console.log(!!item);

    return !!item; // Renvoie true si trouvé, false sinon
  } catch (error) {
    console.error('Erreur vérification stock:', error);
    return false;
  }
};
