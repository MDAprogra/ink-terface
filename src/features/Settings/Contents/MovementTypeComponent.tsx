'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeftRight } from 'lucide-react';

import { getMovementType } from '@/actions/movement-type/get-movement-type';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ErrorAlert } from '../../Global/ErrorAlert';
import { Loading } from '../../Global/Loading';
import { MT_AddSheet } from '../Components/MovementType/MT_AddSheet';
import { MovementTypeRow } from '../Components/MovementType/MT_Row';

export const MovementTypeComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['setting_movementType'],
    queryFn: () => getMovementType(),
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
              Types de mouvement
            </CardTitle>
          </div>
          <MT_AddSheet />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-100">Nom du mouvement</TableHead>
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
                  <MovementTypeRow key={item.id} movement={{ ...item, isEntry: item.isEntry ?? false }} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
