import type { PrismaClient } from '@/generated/prisma/client';

export const seedUnits = async (prisma: PrismaClient) => {
  console.log('🌱 Seeding Units...');

  const units = [
    {
      name: 'Métrage Linéaire',
      code: 'ML',
    },
    {
      name: 'Kilogramme',
      code: 'Kg',
    },
    {
      name: 'Litre',
      code: 'L',
    },
  ];

  for (const unit of units) {
    await prisma.unit.upsert({
      where: { name: unit.name, code: unit.code }, // On vérifie l'existence par l'email (doit être @unique dans ton schema)
      update: {}, // Si existe, on ne change rien (ou tu peux mettre à jour les champs)
      create: {
        name: unit.name,
        code: unit.code,
      },
    });
  }

  console.log(`✅ Units seeded (${units.length})`);
};
