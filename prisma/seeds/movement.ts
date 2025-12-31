import type { PrismaClient } from '@/generated/prisma/client';

export const seedMovement = async (prisma: PrismaClient) => {
  console.log('🌱 Seeding Movement ...');

  // 1. Récupération des données existantes
  const allMvtType = await prisma.movementType.findMany({ where: { isDeleted: false } });
  const allStock = await prisma.stock.findMany({ where: { isDeleted: false } });
  const allUser = await prisma.user.findMany();

  const missingData = [];

  // On remplit la liste des accusés
  if (allMvtType.length === 0) missingData.push('MovementType');
  if (allUser.length === 0) missingData.push('User');
  if (allStock.length === 0) missingData.push('Stock');

  // Si la liste n'est pas vide, on affiche le détail et on coupe
  if (missingData.length > 0) {
    console.log(`⚠️ Abort: Impossible de créer les mouvements.`);
    console.log(`❌ Tables vides détectées : ${missingData.join(', ')}`);
    return;
  }

  // 2. Création d'un mouvement pour chaque stock existant
  for (const stock of allStock) {
    // 👉 Pioche un Type au hasard
    const randomType = allMvtType[Math.floor(Math.random() * allMvtType.length)];

    // 👉 Pioche un User au hasard
    const randomUser = allUser[Math.floor(Math.random() * allUser.length)];

    const randomQuantity = Math.floor(Math.random() * 100);

    await prisma.movement.create({
      data: {
        quantity: randomQuantity,

        // On assigne les IDs piochés au hasard
        idMovementType: randomType.id,
        idUser: randomUser.id,

        // Ici, on utilise l'ID du stock actuel de la boucle
        idStock: stock.id,
      },
    });
  }

  console.log(`✅ Movements seeded (${allStock.length} created)`);
};
