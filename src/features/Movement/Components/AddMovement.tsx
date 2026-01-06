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
}

type NewMovementForm = Pick<Movement, 'idStock' | 'idMovementType' | 'idUser'> & {
  quantity: number;
};

export const MVT_AddSheet = ({ pIdItem }: MVT_AddSheetProps) => {
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
  const [openMvt, setOpenMvt] = React.useState(false);
  const [openStk, setOpenStk] = React.useState(false);

  // 👉 1. LOGIQUE D'UNITÉ : On cherche le stock sélectionné pour trouver son unité
  // On assume ici que stock.item.unit existe. Adapte selon ton schéma (ex: item.unit.symbol)
  const selectedStock = dataStk?.find((s) => s.id === formData.idStock);
  // @ts-expect-error (au cas où le typage TS strict bloque sans le include)
  const unitLabel = selectedStock?.item?.unit?.symbol || selectedStock?.item?.unit?.name || '';
  return (
    <AddSheet
      title="Faire un nouveau mouvement"
      queryKey={['movements', 'stocks']} // On invalide aussi les stocks
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
        {/* --- SELECTEUR TYPE MOUVEMENT --- */}
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

        {/* --- SELECTEUR STOCK (ARTICLE) --- */}
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
