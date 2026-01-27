'use client';

import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getItems } from '@/actions/items/get-items';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import CatalogueAdd from '@/features/Catalogue/CatalogueAdd';

// Utilitaire de formatage
const formatCurrency = (value: number | string | null) => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value));
};

export function ListItems() {
  const router = useRouter();

  // 1. La logique de récupération de données
  const { data, isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: () => getItems(),
  });
  // 2. Gestion du chargement (Spinner centré)
  if (isLoading) {
    return (
      <div className="flex h-50 w-full items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Chargement du catalogue...</span>
      </div>
    );
  }

  // 3. Gestion de l'erreur
  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>
            Impossible de charger les produits. Veuillez vérifier votre connexion.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 4. L'affichage des données
  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          {/* Partie Gauche : Titre et Description */}
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">Catalogue des produits</CardTitle>
            <CardDescription>Gérez votre inventaire et vos stocks d'encres.</CardDescription>
          </div>

          {/* Partie Droite : Badge et Bouton d'ajout */}
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm px-4 py-1">
              {data?.length || 0} Produits
            </Badge>

            <PermissionGuard
              resource="catalog"
              action="create"
              fallback={
                <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
                  <Lock className="w-4 h-4 mr-2" /> Création Impossible
                </Button>
              }
            >
              <CatalogueAdd />
            </PermissionGuard>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-75">Nom du produit</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Quantité en Stock</TableHead>
                  <TableHead className="text-center">Stock Sécurité</TableHead>
                  <TableHead className="text-right">Prix d'achat</TableHead>
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
                {data?.map((item) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(`/app/catalogue/${item.reference}`)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        {/* Affichage conditionnel du fournisseur */}
                        {item.supplier && (
                          <span className="text-xs text-muted-foreground">
                            {/* @ts-ignore : Adapte selon ton typage réel */}
                            {item.supplier.name}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell
                      className="max-w-75 truncate text-muted-foreground"
                      title={item.description || ''}
                    >
                      {item.description || <span className="italic opacity-50 text-xs">N/A</span>}
                    </TableCell>

                    <TableCell className="text-center font-mono">
                      {item.stocks !== null ? (
                        // {data.stocks.reduce((total, stock) => total + stock.quantity, 0)}
                        <span
                          className={
                            Number(
                              item.stocks.reduce((total, stock) => total + stock.quantity, 0),
                            ) === 0
                              ? 'text-red-500'
                              : ''
                          }
                        >
                          {Number(
                            item.stocks.reduce((total, stock) => total + stock.quantity, 0),
                          ).toFixed(2)}
                          {/* Affichage conditionnel de l'unité */}
                          {/* @ts-ignore */}
                          <span className="text-xs text-muted-foreground ml-1">
                            {item.unit?.name}
                          </span>
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {item.securityStock !== null ? (
                        <span
                          className={Number(item.securityStock) > 5 ? 'text-red-500 font-bold' : ''}
                        >
                          {Number(item.securityStock).toFixed(2)}
                          {/* Affichage conditionnel de l'unité */}
                          {/* @ts-ignore */}
                          <span className="text-xs text-muted-foreground ml-1">
                            {item.unit?.name}
                          </span>
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>

                    <TableCell className="text-right font-mono tabular-nums">
                      {formatCurrency(
                        item.purchasePrice ? Number(item.purchasePrice).toFixed(2) : '00,00',
                      )}
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
