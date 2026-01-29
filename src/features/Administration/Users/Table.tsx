'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { updateRole } from '@/actions/administration/role';
import { createUser, getUsers, setIsInactive } from '@/actions/administration/user';
import { ROLE_LABELS } from '@/auth/roles-list';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import PopUpAdd, { type AddFieldConfig } from '../Components/PopUpAdd';

export function UsersTable() {
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ['admin_users'],
    queryFn: () => getUsers(),
  });

  const roleFields: AddFieldConfig[] = [
    {
      label: 'Prénom',
      name: 'firstName',
      required: true,
      type: 'text',
    },
    {
      label: 'Nom',
      name: 'name',
      required: true,
      type: 'text',
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      placeholder: 'email@interfas.fr',
      required: true,
    },
    {
      label: 'Mot de passe',
      name: 'password',
      type: 'password',
      placeholder: '********',
      required: true,
    },
    // {
    //   label: 'Rôle',
    //   name: 'roleId',
    //   type: 'select',
    //   required: true,
    //   options: allRoles.map((role) => ({
    //     label: role.name,
    //     value: role.id,
    //   })),
    // },
  ];

  const { mutate: mutateInactive, isPending: isPendingInactive } = useMutation({
    mutationFn: async ({ id, isInactive }: { id: string; isInactive: boolean }) => {
      const result = await setIsInactive(id, isInactive);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onMutate: async ({ id, isInactive }) => {
      await queryClient.cancelQueries({ queryKey: ['admin_users'] });
      const previousUsers = queryClient.getQueryData(['admin_users']);
      queryClient.setQueryData(['admin_users'], (old: any[]) => {
        return old?.map((u) => (u.id === id ? { ...u, isInactive: isInactive } : u));
      });
      return { previousUsers };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(['admin_users'], context?.previousUsers);
      toast.error('Échec de la mise à jour');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
    },
    onSuccess: (_, variables) => {
      const isNowActive = !variables.isInactive;
      toast.success(isNowActive ? 'Utilisateur activé' : 'Utilisateur désactivé');
    },
  });

  const { mutate: mutateRole, isPending: isPendingRole } = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const result = await updateRole(id, role);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    // ⚡ Optimistic Update
    onMutate: async ({ id, role }) => {
      await queryClient.cancelQueries({ queryKey: ['admin_users'] });
      const previousUsers = queryClient.getQueryData(['admin_users']);

      queryClient.setQueryData(['admin_users'], (old: any[]) => {
        return old?.map((u) =>
          // On met à jour le roleId localement tout de suite
          u.id === id ? { ...u, roleId: role } : u,
        );
      });

      return { previousUsers };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(['admin_users'], context?.previousUsers);
      toast.error('Impossible de changer le rôle');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
    },
    onSuccess: () => {
      toast.success('Rôle mis à jour');
    },
  });

  // if (isLoadingRoles || isLoadingUsers) {
  //   return (
  //     <div className="flex justify-center p-8">
  //       <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  //     </div>
  //   );
  // }

  if (!users.length) {
    return <div className="p-4 text-center text-muted-foreground">Aucun utilisateur trouvé.</div>;
  }

  return (
    <>
      <div className="flex justify-end">
        <PermissionGuard resource="users" action="create">
          <PopUpAdd
            triggerLabel="Nouvel utilisateur"
            title="Créer un nouvel utilisateur"
            fields={roleFields}
            queryKey={['admin_users']}
            action={createUser}
          />
        </PermissionGuard>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Actif ?</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name || 'Sans nom'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm')}</TableCell>
                {/* <TableCell>{user.role}</TableCell> */}
                <TableCell>
                  <PermissionGuard
                    resource="users"
                    action="setRole"
                    fallback={<Badge variant={'outline'}>{user.role}</Badge>}
                  >
                    <Select
                      disabled={isPendingRole}
                      // IMPORTANT : On utilise 'value' pour que l'UI suive le cache optimiste
                      // Si user.roleId est null, on met "no-role" pour éviter les bugs d'affichage
                      value={user.role || 'no-role'}
                      onValueChange={(newRoleId) => {
                        // On déclenche la mutation
                        mutateRole({ id: user.id, role: newRoleId });
                      }}
                    >
                      <SelectTrigger className="w-45 h-8">
                        <SelectValue placeholder="Choisir un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-role" disabled>
                          Aucun rôle
                        </SelectItem>
                        {Object.keys(ROLE_LABELS).map((roleKey) => (
                          <SelectItem key={roleKey} value={roleKey}>
                            {/* Affiche "admin", "manager", etc. */}
                            {roleKey}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </PermissionGuard>
                </TableCell>
                <TableCell>
                  <PermissionGuard
                    resource="users"
                    action="setInactif"
                    fallback={
                      user.isInactive ? (
                        <Badge variant={'destructive'} className="bg-red-700 h-5 w-3"></Badge>
                      ) : (
                        <Badge className="bg-green-700 h-5 w-3"></Badge>
                      )
                    }
                  >
                    <Switch
                      id={user.id}
                      disabled={isPendingInactive}
                      checked={!user.isInactive}
                      onCheckedChange={(isChecked) => {
                        mutateInactive({ id: user.id, isInactive: !isChecked });
                      }}
                    />
                  </PermissionGuard>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
