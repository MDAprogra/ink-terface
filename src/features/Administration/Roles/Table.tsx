'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { createRole, getRoles } from '@/actions/administration/role';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import PopUpAdd, { type AddFieldConfig } from '../Components/PopUpAdd'; // Assure-toi du bon chemin

export function RolesTable() {
  const {
    data: roles = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin_roles'],
    queryFn: () => getRoles(),
  });

  // Configuration des champs pour la création de rôle
  // Note: Les "name" doivent correspondre exactement à ton Prisma Schema
  const roleFields: AddFieldConfig[] = [
    {
      label: 'Nom du rôle',
      name: 'name', // Important: c'est la clé de l'objet
      placeholder: 'EX: MANAGER',
      required: true,
    },
    {
      label: 'Description',
      name: 'description',
      placeholder: 'Accès complet au catalogue...',
      required: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Chargement des rôles...
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Erreur lors du chargement des rôles.</div>;
  }

  return (
    <div className="space-y-4">
      {/* Bouton Popup générique */}
      <div className="flex justify-end">
        <PopUpAdd
          triggerLabel="Nouveau Rôle"
          title="Créer un nouveau rôle"
          fields={roleFields}
          queryKey={['admin_roles']}
          action={createRole}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="w-12.5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  Aucun rôle trouvé.
                </TableCell>
              </TableRow>
            )}
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400">
                    {role.name}
                  </span>
                </TableCell>
                <TableCell>{role.description || '-'}</TableCell>
                <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{/* Tes actions ici (DropdownMenu) */}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
