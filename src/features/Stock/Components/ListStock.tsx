'use client';

import { useQuery } from '@tanstack/react-query';

import { getStock } from '@/actions/stock/get-stock';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loading } from '@/features/Global/Loading';

export function ListStock() {
  // 1. La logique de récupération de données
  const { data, isLoading } = useQuery({
    queryKey: ['stocks'],
    queryFn: () => getStock(),
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">Stock</CardTitle>
            <CardDescription>Gérez votre inventaire et vos stocks d'encres.</CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm px-4 py-1">
            {data?.length || 0} Produits
          </Badge>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-75">Nom du produit</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-left">Fournisseur</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Cas où la liste est vide */}
                {data?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      Aucun produit trouvé dans la base de données.
                    </TableCell>
                  </TableRow>
                )}

                {/* La boucle d'affichage */}
                {data?.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{stock.item.name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center font-mono">
                      {stock.quantity !== null ? (
                        <span
                          className={
                            Number(stock.quantity) < Number(stock.item.securityStock) ? 'text-red-500 font-bold' : ''
                          }
                        >
                          {Number(stock.quantity).toFixed(2)}
                          {/* Affichage conditionnel de l'unité */}
                          {/* @ts-ignore */}
                          <span className="text-xs text-muted-foreground ml-1">{stock.item.unit?.name}</span>
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground ml-1">{stock.item.type?.name}</span>
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
