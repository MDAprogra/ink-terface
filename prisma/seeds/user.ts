import { faker } from '@faker-js/faker';

import type { PrismaClient } from '@/generated/prisma/client';

// Hash pour "password123" (Bcrypt standard)
// Si tu utilises une autre méthode de hashage, remplace cette string.
const PASSWORD_HASH = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/0Je.9q.d2';

export const seedUser = async (prisma: PrismaClient) => {
  console.log('🌱 Seeding Users...');

  // --- 1. CRÉATION DE L'ADMIN (FIXE) ---
  const adminEmail = 'admin@interfas.fr'; // Ton email de login

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // On ne change rien s'il existe déjà
    create: {
      id: 'admin-user-id', // ID fixe pour le retrouver facilement
      name: 'Matthias Admin',
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

  // --- 2. CRÉATION D'UTILISATEURS ALÉATOIRES (FAKER) ---
  // On génère 10 employés fictifs pour tes mouvements de stock
  const usersToCreate = 10;

  for (let i = 0; i < usersToCreate; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });

    // On utilise create car on veut des nouveaux à chaque seed complet (ou upsert via email si tu préfères)
    // Ici j'utilise upsert pour éviter les erreurs si tu relances le seed sans clean
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        id: faker.string.uuid(), // Ton schema n'a pas de @default(cuid()), il faut générer l'ID
        name: `${firstName} ${lastName}`,
        email: email,
        emailVerified: faker.datatype.boolean(),
        image: `https://api.dicebear.com/9.x/avataaars/svg?seed=${firstName}`,

        // Optionnel : On leur crée aussi un compte pour qu'ils puissent se connecter
        accounts: {
          create: {
            id: faker.string.uuid(),
            //type: 'credentials',
            providerId: 'credentials',
            accountId: faker.string.uuid(),
            password: PASSWORD_HASH,
          },
        },
      },
    });
  }

  console.log(`✅ Users seeded (1 Admin + ${usersToCreate} Randoms)`);
};
