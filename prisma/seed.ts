import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { PrismaClient } from '@/generated/prisma/client';

import { seedItem } from './seeds/item';
import { seedItemType } from './seeds/item_type';
import { seedMovementType } from './seeds/movement_type';
import { seedSuppliers } from './seeds/supplier';
import { seedUnits } from './seeds/unit';

// 1. Configuration de la connexion PostgreSQL via 'pg'
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. On passe l'adaptateur au client. C'est ça qui manquait !
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Début des seeds...');

  await seedSuppliers(prisma);
  await seedUnits(prisma);
  await seedMovementType(prisma);
  await seedItemType(prisma);
  await seedItem(prisma);

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
