'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { getMovement } from '@/actions/movement/get-movement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loading } from '@/features/Global/Loading';

export function ListMovement() {
  // 1. La logique de récupération de données
  const { data, isLoading } = useQuery({
    queryKey: ['movements'],
    queryFn: () => getMovement(),
  });

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">Mouvement</CardTitle>
            <CardDescription>Liste des mouvements</CardDescription>
          </div>
          {/* <Badge variant="secondary" className="text-sm px-4 py-1">
            {data?.length || 0} Mouvements
          </Badge> */}
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-75">Type de mouvement</TableHead>
                  <TableHead className="text-center">Quantité</TableHead>
                  <TableHead className="text-left">Article</TableHead>
                  <TableHead className="text-left">Salarié</TableHead>
                  <TableHead className="text-left">Date / Heure</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Cas où la liste est vide */}
                {data?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Aucun produit trouvé dans la base de données.
                    </TableCell>
                  </TableRow>
                )}

                {/* La boucle d'affichage */}
                {data?.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{movement.movementType.name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center font-mono">
                      {movement.quantity !== null ? (
                        <span>
                          {Number(movement.quantity).toFixed(2)}
                          {/* Affichage conditionnel de l'unité */}
                          {/* @ts-ignore */}
                          <span className="text-xs text-muted-foreground ml-1">{movement.stock.item.unit.code}</span>
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground ml-1">{movement.stock.item.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground ml-1">{movement.user.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground ml-1">
                        {/* Affiche : 31 déc. 2025 */}
                        {format(new Date(movement.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
