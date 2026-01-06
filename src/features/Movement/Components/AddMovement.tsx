'use client';

import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useState } from 'react';

import { createMovement } from '@/actions/movement/create-movement';
import { getMovementType } from '@/actions/movement-type/get-movement-type';
import { getStock } from '@/actions/stock/get-stock';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AddSheet } from '@/features/Global/AddSheet';
import type { Movement } from '@/generated/prisma/client';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

interface MVT_AddSheetProps {
  pIdItem?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type NewMovementForm = Pick<Movement, 'idStock' | 'idMovementType' | 'idUser'> & {
  quantity: number;
};

export const MVT_AddSheet = ({
  pIdItem,
  isOpen, // Peut être undefined
  onOpenChange, // Peut être undefined
}: MVT_AddSheetProps) => {
  const { data: session } = authClient.useSession();
  const { data } = useQuery({
    queryKey: ['setting_movementType'],
    queryFn: () => getMovementType(),
  });

  const { data: dataStk } = useQuery({
    queryKey: ['stocks'],
    queryFn: () => getStock(),
  });

  const [formData, setFormData] = useState<NewMovementForm>({
    quantity: 0,
    idStock: pIdItem ?? '',
    idMovementType: '',
    idUser: session?.user.id ?? '',
  });

  React.useEffect(() => {
    // On ne fait rien si pas d'ID scanné ou si les données ne sont pas encore chargées
    if (!pIdItem || !dataStk) return;

    // CAS 1 : On cherche si l'ID scanné correspond directement à un ID de STOCK
    let foundStock = dataStk.find((s) => s.id === pIdItem);

    // CAS 2 : Si pas trouvé, on cherche si l'ID scanné correspond à un ID d'ARTICLE (Item)
    // (C'est souvent ce qu'on veut : on scanne le produit, on trouve le stock associé)
    if (!foundStock) {
      foundStock = dataStk.find((s) => s.item.id === pIdItem); // ou s.itemId selon ton schéma
    }

    if (foundStock) {
      console.log('✅ Stock trouvé pour le scan :', foundStock.item.name);
      setFormData((prev) => ({
        ...prev,
        idStock: foundStock.id, // On stocke bien l'ID du STOCK, pas de l'item
        quantity: 0,
      }));
    } else {
      console.log('⚠️ ID scanné introuvable dans la liste des stocks :', pIdItem);
    }
  }, [pIdItem, dataStk]); // 👈 IMPORTANT : On ré-exécute quand les données arrivent
  const [openMvt, setOpenMvt] = React.useState(false);
  const [openStk, setOpenStk] = React.useState(false);

  // 👉 1. LOGIQUE D'UNITÉ : On cherche le stock sélectionné pour trouver son unité
  // On assume ici que stock.item.unit existe. Adapte selon ton schéma (ex: item.unit.symbol)
  const selectedStock = dataStk?.find((s) => s.id === formData.idStock);
  // @ts-expect-error (au cas où le typage TS strict bloque sans le include)
  const unitLabel = selectedStock?.item?.unit?.symbol || selectedStock?.item?.unit?.name || '';
  return (
    <AddSheet
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Faire un nouveau mouvement"
      invalidateKeys={[
        ['movements'], // Rafraîchit l'historique des mouvements
        ['stocks'], // Rafraîchit les quantités en stock
      ]}
      mutationFn={() => createMovement(formData)}
      onReset={() =>
        setFormData({
          quantity: 0,
          idStock: pIdItem ?? '',
          idMovementType: '',
          idUser: session?.user?.id ?? '',
        })
      }
      isSubmitDisabled={formData.quantity <= 0 || !formData.idMovementType || !formData.idStock || !session?.user}
    >
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label>Type de mouvement</Label>
          <Popover open={openMvt} onOpenChange={setOpenMvt}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={openMvt} className="w-full justify-between">
                {formData.idMovementType
                  ? data?.find((item) => item.id === formData.idMovementType)?.name
                  : 'Choisir un type...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Rechercher..." className="h-9" />
                <CommandList>
                  <CommandEmpty>Aucun résultat</CommandEmpty>
                  <CommandGroup>
                    {data?.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.name}
                        onSelect={() => {
                          setFormData((prev) => ({ ...prev, idMovementType: item.id }));
                          setOpenMvt(false);
                        }}
                      >
                        {item.name}
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            formData.idMovementType === item.id ? 'opacity-100' : 'opacity-0',
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
          <Label>Article concerné</Label>
          <Popover open={openStk} onOpenChange={setOpenStk}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openStk}
                className="w-full justify-between disabled:opacity-80"
                disabled={!!pIdItem}
              >
                {formData.idStock
                  ? dataStk?.find((item) => item.id === formData.idStock)?.item.name
                  : 'Choisir un article...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Rechercher un article..." className="h-9" />
                <CommandList>
                  <CommandEmpty>Aucun stock trouvé</CommandEmpty>
                  <CommandGroup>
                    {dataStk?.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.item.name}
                        onSelect={() => {
                          setFormData((prev) => ({ ...prev, idStock: item.id }));
                          setOpenStk(false);
                        }}
                      >
                        {item.item.name}
                        <Check
                          className={cn('ml-auto h-4 w-4', formData.idStock === item.id ? 'opacity-100' : 'opacity-0')}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* --- CHAMP QUANTITÉ AVEC UNITÉ --- */}
        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantité</Label>
          <div className="relative">
            <Input
              id="quantity"
              type="number"
              min={0}
              className="pr-16" // Espace pour l'unité
              value={formData.quantity}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  quantity: Number(e.target.value),
                }));
              }}
            />
            {/* AFFICHE L'UNITÉ SI ELLE EXISTE */}
            {unitLabel && (
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center pl-3">
                <span className="text-sm text-muted-foreground font-medium">{unitLabel}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AddSheet>
  );
};
