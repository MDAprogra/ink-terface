'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeftRight, Lock } from 'lucide-react';

import { getUnit } from '@/actions/unit/get-unit';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ErrorAlert } from '@/features/Global/ErrorAlert';
import { Loading } from '@/features/Global/Loading';

import { U_AddSheet } from '../Components/Unit/U_AddSheet';
import { UnitRow } from '../Components/Unit/U_Row';

export const UnitComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['setting_unit'],
    queryFn: () => getUnit(),
  });
  if (isLoading) return <Loading />;
  if (!data) return <ErrorAlert />;
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <ArrowLeftRight className="h-6 w-6 text-primary" />
              Unités
            </CardTitle>
          </div>
          <PermissionGuard
            resource="settings"
            action="edit"
            fallback={
              <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
                <Lock className="w-4 h-4 mr-4" /> Ajout Impossible
              </Button>
            }
          >
            <U_AddSheet />
          </PermissionGuard>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-100">Nom de l'unité</TableHead>
                  <TableHead className="w-100">Code</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                      Aucun type de mouvement configuré pour le moment.
                    </TableCell>
                  </TableRow>
                )}
                {data?.map((item) => (
                  <UnitRow key={item.id} unit={item} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
