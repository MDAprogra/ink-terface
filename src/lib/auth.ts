import type { Session, User } from 'better-auth';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },

  callbacks: {
    session: async ({ session, user }: { session: Session; user: User }) => {
      const userWithPermissions = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      });

      const permissions = userWithPermissions?.role?.permissions.map((p) => p.action) || [];
      const roleName = userWithPermissions?.role?.name || null;

      // CORRECTION ICI
      return {
        session, // 1. On renvoie l'objet session tel quel
        user: {
          ...user, // 2. On spread l'objet 'user' (le 2ème argument), et non 'session.user'
          role: roleName,
          permissions: permissions,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any; // 3. On ignore l'erreur de linter juste pour cette ligne
    },
  },
});
