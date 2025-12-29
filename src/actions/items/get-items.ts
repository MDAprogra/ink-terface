'use server'; // 👈 Très important

import { prisma } from '@/lib/prisma';

export async function getItems() {
  // Tu peux ajouter une vérification d'authentification ici
  const items = await prisma.item.findMany({
    orderBy: { name: 'asc' },
    include: {
      unit: true, // Si tu veux récupérer les relations
      supplier: true,
    },
  });
  return items;
}

export async function getTypeItem() {
  const typeItem = await prisma.itemType.findMany({
    orderBy: { name: 'asc' },
  });
  return typeItem;
}
