import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/organization/access';

const statement = {
  ...defaultStatements,
  catalog: ['read', 'edit', 'create', 'update', 'soft-delete', 'hard-delete', 'label'],
  movement: ['read', 'create'],
  organization: ['update', 'delete', 'read'],
  member: ['create', 'update', 'delete', 'read'],
  invitation: ['create', 'cancel', 'read'],
  settings: ['create', 'edit', 'soft-delete', 'hard-delete', 'read'],
  users: ['read', 'create', 'setInactif', 'setRole'],
} as const;

const ac = createAccessControl(statement);

const member = ac.newRole({
  catalog: ['read'],
  movement: ['read'],
  organization: ['read'],
  member: ['read'],
  invitation: ['read'],
  settings: ['read'],
});

const manager = ac.newRole({
  catalog: ['read', 'edit', 'update'],
  movement: ['read', 'create'],
  organization: ['read'],
  member: ['read'],
  invitation: ['read', 'create'],
});

const admin = ac.newRole({
  catalog: ['read', 'edit', 'create', 'update', 'soft-delete', 'label'],
  movement: ['read', 'create'],
  organization: ['read', 'update'],
  member: ['read', 'update', 'delete'],
  invitation: ['read', 'create', 'cancel'],
  settings: ['create', 'edit', 'soft-delete', 'read'],
  users: ['read', 'create', 'setInactif'],
});

const developer = ac.newRole({
  catalog: ['read', 'edit', 'create', 'update', 'soft-delete', 'hard-delete', 'label'],
  movement: ['read', 'create'],
  settings: ['create', 'edit', 'soft-delete', 'hard-delete', 'read'],
  users: ['read', 'create', 'setInactif', 'setRole'],
  ...adminAc.statements,
});
const owner = ac.newRole({
  catalog: ['read', 'edit', 'create', 'update', 'soft-delete', 'hard-delete', 'label'],
  movement: ['read', 'create'],
  settings: ['create', 'edit', 'soft-delete', 'hard-delete', 'read'],
  users: ['read', 'create', 'setInactif', 'setRole'],
  ...adminAc.statements,
});

export const ORG_ROLES = {
  developer,
  admin,
  manager,
  member,
  owner,
} as const;

export type OrgRole = keyof typeof ORG_ROLES;
