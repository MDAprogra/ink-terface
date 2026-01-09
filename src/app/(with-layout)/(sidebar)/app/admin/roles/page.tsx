import { useQuery } from '@tanstack/react-query';

import { getRoles } from '@/actions/administration/role';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RolesTable } from '@/features/Administration/Roles/Table';

export default async function AdminRolesPage() {
  //const roles = await getRoles();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Rôles</CardTitle>
        <CardDescription>Visualisez les rôles, modifiez les ou créés en des nouveaux.</CardDescription>
      </CardHeader>
      <CardContent>
        <RolesTable />
      </CardContent>
    </Card>
  );
}
