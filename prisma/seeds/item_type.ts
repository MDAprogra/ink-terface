// import type { PrismaClient } from "@/generated/prisma";

import type { PrismaClient } from '@/generated/prisma/client';

export const seedItemType = async (prisma: PrismaClient) => {
  console.log('🌱 Seeding Items Types...');

  const items_types = [
    {
      name: 'Encre Flexo',
    },
    {
      name: 'Encre Offset UV',
    },
  ];

  for (const item_type of items_types) {
    await prisma.itemType.upsert({
      where: { name: item_type.name },
      update: {}, // Si existe, on ne change rien (ou tu peux mettre à jour les champs)
      create: {
        name: item_type.name,
      },
    });
  }

  console.log(`✅ Items Types seeded (${items_types.length})`);
};
