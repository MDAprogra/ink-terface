// Assure-toi que l'import est correct selon nos discussions précédentes
// import { PrismaClient } from '../src/generated/prisma';
import type { PrismaClient } from '@/generated/prisma/client';

export const seedItem = async (prisma: PrismaClient) => {
  console.log('🌱 Seeding Items ...');

  const items = [
    // FLEXO
    {
      name: 'FLEXOCURE GLOSS TTR VARNISH 5KG',
      reference: 'FLEXTTRVA5',
      description: null,
      color: '',
      active: true,
      purchasePrice: 14.84,
      typeItem: 'Encre Flexo',
      unit: 'Kilogramme',
      supplier: 'FLINT GROUP',
    },
    {
      name: 'EKOCURE PROCESS BLUE - 5.5Kg',
      reference: 'EKOPROBL55',
      description: null,
      color: '',
      active: true,
      purchasePrice: 21.92,
      typeItem: 'Encre Flexo',
      unit: 'Kilogramme',
      supplier: 'FLINT GROUP',
    },
    {
      name: 'BLANC COUVRANT OPALE - 7 Kg',
      reference: 'BLCCOUVOP7',
      description: null,
      color: '',
      active: true,
      purchasePrice: 12.5,
      typeItem: 'Encre Offset UV',
      unit: 'Kilogramme',
      supplier: 'LAGUERRE',
    },
    {
      name: 'TRANSPARENT WHITE HRL - 3Kg',
      reference: 'TRANSWHRL3',
      description: null,
      color: '',
      active: true,
      purchasePrice: 10.54,
      typeItem: 'Encre Offset UV',
      unit: 'Kilogramme',
      supplier: 'SUNCHEMICAL',
    },
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { name: item.name },

      // Si l'item existe déjà, on ne fait rien
      update: {},

      create: {
        name: item.name,
        description: item.description,
        color: item.color,
        active: item.active,
        purchasePrice: item.purchasePrice,

        // 1. Liaison avec ItemType
        type: {
          connect: { name: item.typeItem },
        },

        // 2. Liaison avec Unit
        unit: {
          connect: { name: item.unit },
        },

        // 3. Liaison avec Supplier
        supplier: {
          connect: { name: item.supplier },
        },
      },
    });
  }

  console.log(`✅ Items seeded (${items.length})`);
};
