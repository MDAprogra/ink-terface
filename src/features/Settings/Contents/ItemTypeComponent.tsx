'use client';

import { useQuery } from '@tanstack/react-query';
import { PackageOpen } from 'lucide-react';

import { getTypeItem } from '@/actions/type-item/get-type-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ErrorAlert } from '../Components/ErrorAlert';
import { Loading } from '../Components/Loading';
import { TypeItemAdd } from '../Components/TypeItemAdd';
import { ItemTypeRow } from '../Components/TypeItemRow';

export const ItemTypeComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['setting_itemType'],
    queryFn: () => getTypeItem(),
  });
  if (isLoading) return <Loading />;
  if (!data) return <ErrorAlert />; // Gestion simple si data est undefined
  return (
    <div className="p-6 space-y-6">
      {/* On utilise une Card pour encadrer le contenu */}
      <Card>
        {/* HEADER : Titre à gauche, Bouton à droite */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <PackageOpen className="h-6 w-6 text-primary" />
              Types de produits
            </CardTitle>
          </div>
          <TypeItemAdd />
        </CardHeader>

        <CardContent>
          {/* Un conteneur avec bordure arrondie pour le tableau */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {' '}
                  {/* Petit fond gris pour l'entête */}
                  <TableHead className="w-100">Nom de la catégorie</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Gestion du cas vide */}
                {data && data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                      Aucun type de produit configuré pour le moment.
                    </TableCell>
                  </TableRow>
                )}

                {/* Ta boucle existante */}
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
