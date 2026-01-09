import { getAllRoles, getUsers } from '@/actions/administration/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersTable } from '@/features/Administration/Users/Table';

export default async function AdminUsersPage() {
  const [users, roles] = await Promise.all([getUsers(), getAllRoles()]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Utilisateurs</CardTitle>
        <CardDescription>Visualisez les utilisateurs inscrits et gérez leurs rôles d'accès.</CardDescription>
      </CardHeader>
      <CardContent>
        <UsersTable />
      </CardContent>
    </Card>
  );
}
