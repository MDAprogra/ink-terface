import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin, organization, role } from 'better-auth/plugins';

import { ORG_ROLES } from '@/auth/roles';

import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      defaultRole: ORG_ROLES.member,

      roles: ORG_ROLES,
    }),
    admin(),
  ],
});
