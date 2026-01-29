export const ROLE_LABELS: Record<string, string> = {
  owner: 'Propriétaire',
  admin: 'Administrateur',
  manager: 'Manager',
  developer: 'Développeur',
  member: 'Membre',
};

// Si tu as besoin juste de la liste des clés (['owner', 'admin', ...])
const AVAILABLE_ROLES = Object.keys(ROLE_LABELS);
