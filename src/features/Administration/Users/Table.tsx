'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react'; // Pour le spinner
import { useTransition } from 'react';
import { toast } from 'sonner';

import { createUser, getAllRoles, getUsers, updateUserRole } from '@/actions/administration/user';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import PopUpAdd, { type AddFieldConfig } from '../Components/PopUpAdd';

export function UsersTable() {
  const { data: allRoles = [] } = useQuery({
    // " = []" assure que ce n'est jamais undefined
    queryKey: ['admin_roles'],
    queryFn: () => getAllRoles(), // Ton server action
  });
  const roleFields: AddFieldConfig[] = [
    {
      label: 'Prénom & NOM',
      name: 'name', // Important: c'est la clé de l'objet
      placeholder: 'Ex: Matthias DAUVEL',
      required: true,
      type: 'text',
    },
    {
      label: 'Email',
      name: 'email',
      placeholder: 'email@interfas.fr',
      required: true,
    },
    {
      label: 'Mot de passe',
      name: 'password',
      placeholder: '********',
      required: true,
    },
    {
      label: 'Rôle',
      name: 'roleId',
      type: 'select',
      required: true,
      options: allRoles.map((role) => ({
        label: role.name,
        value: role.id,
      })),
    },
  ];
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (userId: string, newRoleId: string) => {
    startTransition(async () => {
      const result = await updateUserRole(userId, newRoleId);
      if (result.success) {
        toast.success('Rôle mis à jour avec succès');
      } else {
        toast.error(result.error);
      }
    });
  };

  const { data: roles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ['admin_roles'], // C'était 'admin_users' avant (erreur)
    queryFn: () => getAllRoles(),
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin_users'],
    queryFn: () => getUsers(),
  });

  if (isLoadingRoles || isLoadingUsers) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!users.length) {
    return <div className="p-4 text-center text-muted-foreground">Aucun utilisateur trouvé.</div>;
  }

  return (
    <>
      <div className="flex justify-end">
        <PopUpAdd
          triggerLabel="Nouvel utilisateur"
          title="Créer un nouvel utilisateur"
          fields={roleFields}
          queryKey={['admin_users']}
          action={createUser}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead>Rôle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name || 'Sans nom'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Select
                    disabled={isPending}
                    defaultValue={user.roleId || 'no-role'}
                    onValueChange={(val) => handleRoleChange(user.id, val)}
                  >
                    <SelectTrigger className="w-45 h-8">
                      <SelectValue placeholder="Choisir un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-role" disabled>
                        Aucun rôle
                      </SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
