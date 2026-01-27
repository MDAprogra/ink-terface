import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

import type { PrismaClient } from '@/generated/prisma/client';

// Hash pour "password123" (Bcrypt standard)
// Si tu utilises une autre méthode de hashage, remplace cette string.
const PASSWORD_HASH = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/0Je.9q.d2';

export const seedUser = async (prisma: PrismaClient) => {
  console.log('🌱 Seeding Users...');

  // --- 1. CRÉATION DE L'ADMIN (FIXE) ---
  const adminEmail = 'matthias.dauvel@interfas.fr'; // Ton email de login
  const adminCUID = createId();
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // On ne change rien s'il existe déjà
    create: {
      id: adminCUID, // ID fixe pour le retrouver facilement
      name: 'Matthias DAUVEL',
      email: adminEmail,
      emailVerified: true, // Important pour éviter les flags de vérification
      image: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Matthias',

      // On lie directement un compte pour le login
      accounts: {
        create: {
          id: 'admin-account-id',
          //type: 'credentials',
          providerId: 'credentials',
          accountId: 'admin-user-id',
          password: PASSWORD_HASH, // Mdp: password123
        },
      },
    },
  });

  console.log(`👤 Admin created: ${adminEmail} (pwd: password123)`);
};
