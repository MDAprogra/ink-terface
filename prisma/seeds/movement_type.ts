// import type { PrismaClient } from "@/generated/prisma";

import type { PrismaClient } from '@/generated/prisma/client';

export const seedMovementType = async (prisma: PrismaClient) => {
  console.log('🌱 Seeding Movements Types...');

  const movements_types = [
    {
      name: 'Entrée',
    },
    {
      name: 'Sortie',
    },
    {
      name: 'Ajustement',
    },
    {
      name: 'Inventaire',
    },
  ];

  for (const movement_type of movements_types) {
    await prisma.movementType.upsert({
      where: { name: movement_type.name },
      update: {}, // Si existe, on ne change rien (ou tu peux mettre à jour les champs)
      create: {
        name: movement_type.name,
      },
    });
  }

  console.log(`✅ Movements Types seeded (${movements_types.length})`);
};
