'use client';

import { Decimal } from '@prisma/client/runtime/client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, ChevronsUpDown, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { deleteItem } from '@/actions/items/delete-item';
import { editItem } from '@/actions/items/edit-item';
import { getItemRef } from '@/actions/items/get-item-ref';
import { getSupplier } from '@/actions/supplier/get-supplier';
import { getTypeItem } from '@/actions/type-item/get-type-item';
import { getUnit } from '@/actions/unit/get-unit';
import { PermissionGuard } from '@/components/auth/permission-guard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Item } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';

import { DialogConfirmDelete } from '../Global/ConfirmDeleting';
import { EditSheet } from '../Global/EditSheet';
import { ErrorAlert } from '../Global/ErrorAlert';
import { ItemBarcode } from '../Global/ItemBarcode';
import { Loading } from '../Global/Loading';
import { PrintableLabel } from '../Global/PrintableLabel';

interface CatalogueDetailProps {
  reference: string;
}

export default function CatalogueDetailPage({ reference }: CatalogueDetailProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeletingOpen, setIsDeletingOpen] = useState(false);
  const [openTypeItem, setOpenTypeItem] = React.useState(false);
  const [openUnit, setOpenUnit] = React.useState(false);
  const [openSupplier, setOpenSupplier] = React.useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['items', reference],
    queryFn: () => getItemRef(reference),
  });

  const { data: d_supplier } = useQuery({
    queryKey: ['supplier'],
    queryFn: () => getSupplier(),
  });
  const { data: d_unit } = useQuery({
    queryKey: ['unit'],
    queryFn: () => getUnit(),
  });
  const { data: d_type } = useQuery({
    queryKey: ['type'],
    queryFn: () => getTypeItem(),
  });

  const [editedData, setEditedData] = useState<Item | undefined>(undefined);

  useEffect(() => {
    if (data) {
      setEditedData({
        ...data,
        // 👇 On reconvertit le number (du serveur) en Decimal (pour le state local)
        securityStock: new Decimal(data.securityStock ?? 0),
        purchasePrice: data.purchasePrice ? new Decimal(data.purchasePrice) : null,
      });
    }
  }, [data]);

  if (isLoading) return <Loading />;
  if (!data || error) return <ErrorAlert />;

  // const [name, setName] = useState(data.name);
  // useEffect(() => {
  //   if (isEditOpen) {
  //     setName(data.name);
  //   }
  // }, [isEditOpen, data.name]);

  const lastMovements = data?.stocks
    .flatMap((stock) => stock.movements) // On "aplatit" : [[m1, m2], [m3]] devient [m1, m2, m3]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Tri par date
    .slice(0, 5); // On garde les 5 premiers

  return (
    <>
      <ButtonGroup className="ml-auto">
        <PermissionGuard
          resource="catalog"
          action="edit"
          fallback={
            <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
              <Lock className="w-4 h-4 mr-2" /> Création Impossible
            </Button>
          }
        >
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            Modifier
          </Button>
        </PermissionGuard>
        <PermissionGuard
          resource="catalog"
          action="soft-delete"
          fallback={
            <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
              <Lock className="w-4 h-4 mr-2" /> Suppression Impossible
            </Button>
          }
        >
          <Button
            variant="outline"
            onClick={() => setIsDeletingOpen(true)}
            className="hover:bg-red-600 hover:text-white"
          >
            Supprimer
          </Button>
        </PermissionGuard>
      </ButtonGroup>
      <div className="flex-col">
        <div className="flex flex-row justify-between w-full border-b-2 border-gray-400 mb-3">
          <div className="">
            <h1 className="text-2xl">{data.name}</h1>
            <i className="text-sm">
              Référence : <strong>{reference}</strong>
            </i>
            <i className="text-sm"> | </i>
            <i className="text-sm">
              Type : <strong>{data.type.name}</strong>
            </i>
            <i className="text-sm"> | </i>
            <i className="text-sm">
              Unité :{' '}
              <strong>
                {data.unit.name} ({data.unit.code})
              </strong>
            </i>
            <Badge
              title={cn(data.isDeleted ? 'Inactif (Supprimé)' : 'Actif')}
              className={cn(
                'h-5 min-w-5 rounded-full px-1 font-mono tabular-nums',
                data.isDeleted ? 'bg-red-600' : 'bg-green-600',
              )}
            />
          </div>
          <div className="flex flex-col text-sm justify-end text-right">
            <i>
              Créé le : {format(new Date(data.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
            </i>
            <i>
              Mise à jour le :{' '}
              {data.updatedAt
                ? format(new Date(data.updatedAt), 'dd MMMM yyyy à HH:mm', { locale: fr })
                : ''}
            </i>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="border-gray-400 border-r-2 w-1/3 flex flex-col gap-4 pr-4">
            <h1 className="text-xl">Caractéristiques de l'article :</h1>
            <div>
              <h3 className="underline font-semibold">Description :</h3>
              <span className="text-gray-600">{data.description || 'Pas de description ...'}</span>
            </div>

            <div>
              <h3 className="underline font-semibold">Couleur :</h3>
              <span className="text-gray-600">{data.color || 'Pas de couleur ...'}</span>
            </div>

            <div>
              <h3 className="underline font-semibold">Niveau stock de sécurité :</h3>
              <span className="text-gray-600">
                {/* J'ai sécurisé l'affichage du nombre */}
                {data.securityStock && Number(data.securityStock) !== 0
                  ? data.securityStock.toString()
                  : 'Pas de niveau défini ...'}
              </span>
            </div>

            <div>
              <h3 className="underline font-semibold">Durée de conservation :</h3>
              <span className="text-gray-600">
                {data.shelfLife ? `${data.shelfLife} jours` : 'Pas de durée définie ...'}
              </span>
            </div>
          </div>

          <div className="border-gray-400 border-r-2 w-1/3 flex flex-col gap-4 pr-4 ml-2">
            <h1 className="text-xl">Le fournisseur :</h1>
            <div>
              <h3 className="underline font-semibold">Nom :</h3>
              <span className="text-gray-600">{data.supplier.name}</span>
            </div>
          </div>

          <div className="border-gray-4002 w-1/3 flex flex-col gap-4 pr-4 ml-2">
            <h1 className="text-xl">Stock et Mouvements :</h1>
            <div>
              <h3 className="underline font-semibold">Stock :</h3>
              <span className="text-gray-600">
                {data.stocks.reduce((total, stock) => total + stock.quantity, 0)}
              </span>
            </div>

            <div>
              <h3 className="underline font-semibold">Les 5 derniers mouvements :</h3>
              <div className="flex flex-col gap-2 mt-1">
                {lastMovements.length > 0 ? (
                  lastMovements.map((move) => (
                    <div
                      key={move.id}
                      className="flex justify-between items-center text-sm border-b border-gray-100 pb-1 last:border-0"
                    >
                      {/* Date */}
                      <span className="text-gray-500">
                        {format(new Date(move.createdAt), 'dd/MM/yy HH:mm', { locale: fr })}
                      </span>

                      {/* Quantité (Vert si positif, Rouge si négatif) */}
                      <span
                        className={`font-mono font-medium ${move.movementType.isEntry ? 'text-green-600' : 'text-red-500'}`}
                      >
                        {move.movementType.isEntry ? '+' : '-'}
                        {move.quantity} {data.unit.code}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 italic text-sm">Aucun mouvement enregistré.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <PermissionGuard resource="catalog" action="label">
        <ItemBarcode value={reference} />
        <PrintableLabel reference={reference} name={data.name} />
      </PermissionGuard>

      <DialogConfirmDelete
        item={data}
        open={isDeletingOpen}
        onOpenChange={setIsDeletingOpen}
        action={deleteItem}
        queryKey={['items', reference]}
        onSuccess={() => router.push('/app/catalogue')}
      />

      {editedData && (
        <EditSheet
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          title={`Modifier "${data.name}"`}
          queryKey={['items', reference]}
          mutationFn={() => {
            if (!editedData) throw new Error('Aucune donnée à modifier');
            return editItem({
              e_id: editedData.id,
              e_reference: editedData.reference,
              e_name: editedData.name,
              e_description: editedData.description ?? '',
              e_color: editedData.color ?? '',
              e_securityStock: Number(editedData.securityStock) || 0,
              e_shelfLife: editedData.shelfLife ?? 0,
              e_idSupplier: editedData.idSupplier,
              e_idUnit: editedData.idUnit,
              e_idTypeItem: editedData.idTypeItem,
            });
          }}
          //isSubmitDisabled={name === data.name}
        >
          <div className="grid gap-2">
            <Label htmlFor={`edit-name-${data.id}`}>Nom</Label>
            <Input
              id={`edit-name-${data.id}`} // J'ai mis data.id car data.name peut changer et faire perdre le focus
              value={editedData.name} // Utilise bien editedData ici aussi !
              onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`edit-ref-${data.id}`}>Référence</Label>
            <Input
              id={`edit-ref-${data.id}`} // J'ai mis data.id car data.name peut changer et faire perdre le focus
              value={editedData.reference} // Utilise bien editedData ici aussi !
              onChange={(e) => setEditedData({ ...editedData, reference: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`edit-typeItem-${data.id}`}>Type d'article</Label>
            <Popover open={openTypeItem} onOpenChange={setOpenTypeItem}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openTypeItem}
                  className="w-full justify-between"
                >
                  {editedData.idTypeItem
                    ? d_type?.find((item) => item.id === editedData.idTypeItem)?.name
                    : 'Choisir un type...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Rechercher..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>Aucun résultat</CommandEmpty>
                    <CommandGroup id={`edit-stkSecurity-${data.id}`}>
                      {d_type?.map((type) => (
                        <CommandItem
                          key={type.id}
                          value={type.name}
                          onSelect={() => {
                            setEditedData(() => ({ ...editedData, idTypeItem: type.id }));
                            setOpenTypeItem(false);
                          }}
                        >
                          {type.name}
                          <Check
                            className={cn(
                              'ml-auto h-4 w-4',
                              editedData.idTypeItem === type.id ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`edit-description-${data.id}`}>Description</Label>
            <Input
              id={`edit-description-${data.id}`} // J'ai mis data.id car data.name peut changer et faire perdre le focus
              value={editedData.description || ''} // Utilise bien editedData ici aussi !
              placeholder="Renseignez une description (Optionnelle)"
              onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`edit-color-${data.id}`}>Couleur</Label>
            <Input
              id={`edit-color-${data.id}`} // J'ai mis data.id car data.name peut changer et faire perdre le focus
              value={editedData.color || ''} // Utilise bien editedData ici aussi !
              placeholder="Renseignez une couleur (Optionnelle)"
              onChange={(e) => setEditedData({ ...editedData, color: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`edit-stkSecurity-${data.id}`}>Stock de sécurité</Label>
            <Input
              id={`edit-stkSecurity-${data.id}`}
              type="number"
              value={editedData.securityStock.toString() || 0}
              placeholder="Renseignez une couleur (Optionnelle)"
              onChange={(e) => {
                const val = e.target.value;
                setEditedData({
                  ...editedData,
                  securityStock: val ? new Decimal(val) : new Decimal(0),
                });
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`edit-shelfLife-${data.id}`}>Durée de conservation</Label>
            <Input
              id={`edit-shelfLife-${data.id}`}
              type="number"
              value={editedData.shelfLife || ''}
              placeholder="Renseignez une durée max. (Optionnelle)"
              onChange={(e) => {
                const val = e.target.value;
                setEditedData({ ...editedData, shelfLife: val ? Number(val) : null });
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`edit-unit-${data.id}`}>Unité</Label>
            <Popover open={openUnit} onOpenChange={setOpenUnit}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openUnit}
                  className="w-full justify-between"
                >
                  {editedData.idUnit
                    ? d_unit?.find((unit) => unit.id === editedData.idUnit)?.name
                    : 'Choisir une unité...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Rechercher..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>Aucun résultat</CommandEmpty>
                    <CommandGroup id={`edit-stkSecurity-${data.id}`}>
                      {d_unit?.map((unit) => (
                        <CommandItem
                          key={unit.id}
                          value={unit.name}
                          onSelect={() => {
                            setEditedData(() => ({ ...editedData, idUnit: unit.id }));
                            setOpenUnit(false);
                          }}
                        >
                          {unit.name}
                          <Check
                            className={cn(
                              'ml-auto h-4 w-4',
                              editedData.idUnit === unit.id ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`edit-supplier-${data.id}`}>Fournisseur</Label>
            <Popover open={openSupplier} onOpenChange={setOpenSupplier}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openSupplier}
                  className="w-full justify-between"
                >
                  {editedData.idSupplier
                    ? d_supplier?.find((supplier) => supplier.id === editedData.idSupplier)?.name
                    : 'Choisir un fournisseur ...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Rechercher..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>Aucun résultat</CommandEmpty>
                    <CommandGroup id={`edit-supplier-${data.id}`}>
                      {d_supplier?.map((supplier) => (
                        <CommandItem
                          key={supplier.id}
                          value={supplier.name}
                          onSelect={() => {
                            setEditedData(() => ({ ...editedData, idSupplier: supplier.id }));
                            setOpenSupplier(false);
                          }}
                        >
                          {supplier.name}
                          <Check
                            className={cn(
                              'ml-auto h-4 w-4',
                              editedData.idSupplier === supplier.id ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </EditSheet>
      )}
    </>
  );
}
