import type { PrismaClient } from '@/generated/prisma/client';

export const seedSuppliers = async (prisma: PrismaClient) => {
  console.log('🌱 Seeding Suppliers...');

  const suppliers = [
    {
      name: 'FLINT GROUP',
    },
    {
      name: 'RADIOR',
    },
    {
      name: 'SUNCHEMICAL',
    },
    {
      name: 'LAGUERRE',
    },
  ];

  for (const supplier of suppliers) {
    await prisma.supplier.upsert({
      where: { name: supplier.name }, // On vérifie l'existence par l'email (doit être @unique dans ton schema)
      update: {}, // Si existe, on ne change rien (ou tu peux mettre à jour les champs)
      create: {
        name: supplier.name,
      },
    });
  }

  console.log(`✅ Suppliers seeded (${suppliers.length})`);
};
