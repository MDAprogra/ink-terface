'use server';

import { prisma } from '@/lib/prisma';

export async function getSupplier() {
  // Tu peux ajouter une vérification d'authentification ici
  const suppliers = await prisma.supplier.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: { name: 'asc' },
  });
  return suppliers;
}
