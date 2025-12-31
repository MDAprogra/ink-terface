import type { PrismaClient } from '@/generated/prisma/client';

export const seedStocks = async (prisma: PrismaClient) => {
  console.log('🌱 Seeding Stock...');

  const allItems = await prisma.item.findMany();

  if (allItems.length === 0) {
    throw new Error("Aucun article en base. Lancez d'abord le seed des articles.");
  }

  // Pour chaque article existant, on lui crée/met à jour son stock
  for (const item of allItems) {
    // Génère une quantité aléatoire entre 0 et 100
    const randomQuantity = Math.floor(Math.random() * 100);

    await prisma.stock.upsert({
      // ATTENTION : Cela ne fonctionne que si `idItem` est marqué @unique dans ton schema.prisma
      // model Stock { ... idItem String @unique ... }
      where: {
        idItem: item.id,
      },
      update: {
        quantity: randomQuantity,
      },
      create: {
        idItem: item.id,
        quantity: randomQuantity,
      },
    });
  }

  console.log(`✅ Stocks seeded (${allItems.length} items updated)`);
};
