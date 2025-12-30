'use client';

import { useQuery } from '@tanstack/react-query';
import { PackageOpen } from 'lucide-react';

import { getTypeItem } from '@/actions/type-item/get-type-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ErrorAlert } from '../../global/ErrorAlert';
import { Loading } from '../../global/Loading';
import { TI_AddSheet } from '../Components/TypeItem/TI_AddSheet';
import { ItemTypeRow } from '../Components/TypeItem/TI_Row';

export const ItemTypeComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['setting_itemType'],
    queryFn: () => getTypeItem(),
  });
  if (isLoading) return <Loading />;
  if (!data) return <ErrorAlert />;
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <PackageOpen className="h-6 w-6 text-primary" />
              Types de produits
            </CardTitle>
          </div>
          <TI_AddSheet />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-100">Nom de la catégorie</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                      Aucun type de produit configuré pour le moment.
                    </TableCell>
                  </TableRow>
                )}
                {data?.map((item) => (
                  <ItemTypeRow key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
