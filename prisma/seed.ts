import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { PrismaClient } from '@/generated/prisma/client';

import { seedItem } from './seeds/item';
import { seedItemType } from './seeds/item_type';
import { seedMovement } from './seeds/movement';
import { seedMovementType } from './seeds/movement_type';
import { seedStocks } from './seeds/stock';
import { seedSuppliers } from './seeds/supplier';
import { seedUnits } from './seeds/unit';
import { seedUser } from './seeds/user';

// 1. Configuration de la connexion PostgreSQL via 'pg'
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. On passe l'adaptateur au client. C'est ça qui manquait !
const prisma = new PrismaClient({ adapter });

async function cleanDatabase() {
  console.log('🧹 Nettoyage de la base de données...');

  // L'ordre est important à cause des clés étrangères (Relations)
  // On supprime d'abord les enfants, puis les parents.

  // 1. Les éléments dépendants (Enfants)
  await prisma.movement.deleteMany();
  await prisma.stock.deleteMany();

  // 2. Les éléments principaux (Parents)
  await prisma.item.deleteMany();

  // 3. Les référentiels (Grands-parents)
  await prisma.itemType.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.movementType.deleteMany();
  await prisma.user.deleteMany();

  console.log('✨ Base de données vide.');
}

async function main() {
  // 👇 On appelle le nettoyage AVANT tout le reste
  await cleanDatabase();

  console.log('🌱 Début des seeds...');

  await seedUser(prisma);
  await seedSuppliers(prisma);
  await seedUnits(prisma);
  await seedMovementType(prisma);
  await seedItemType(prisma);
  await seedItem(prisma);
  await seedStocks(prisma);
  await seedMovement(prisma);

  console.log('✅ Seeds terminés avec succès.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erreur durant les seeds :', e);
    await prisma.$disconnect();
    process.exit(1);
  });
