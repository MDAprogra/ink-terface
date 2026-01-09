import Link from 'next/link';

import { getAllRoles, getUsers } from '@/actions/administration/user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UsersTable } from '@/features/Administration/Users/Table';

export default async function AdminPage() {
  return (
    <>
      <Button variant="link">
        <Link href="admin/users">
          <span>Vers les utilisateurs</span>
        </Link>
      </Button>
      <Button variant="link">
        <Link href="admin/roles">
          <span>Vers les roles</span>
        </Link>
      </Button>
    </>
  );
}
