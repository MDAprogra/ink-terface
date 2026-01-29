'use client';

import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Check, ChevronsUpDown } from 'lucide-react'; // Ajout de l'icône d'alerte
import React, { useState } from 'react';
import { toast } from 'sonner';

import { getItems } from '@/actions/items/get-items';
import { createMovement } from '@/actions/movement/create-movement';
import { getMovementType } from '@/actions/movement-type/get-movement-type';
import { getStock } from '@/actions/stock/get-stock';
import { Button } from '@/components/ui/button';
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
  idItem?: string;
};

export const MVT_AddSheet = ({ pIdItem, isOpen, onOpenChange }: MVT_AddSheetProps) => {
  const { data: session } = authClient.useSession();

  const { data: dataMvtTypes } = useQuery({
    queryKey: ['setting_movementType'],
    queryFn: () => getMovementType(),
  });

  const { data: dataStk } = useQuery({
    queryKey: ['stocks'],
    queryFn: () => getStock(),
  });

  const { data: dataItems } = useQuery({
    queryKey: ['items'],
    queryFn: () => getItems(),
  });

  const [formData, setFormData] = useState<NewMovementForm>({
    quantity: 0,
    idStock: '',
    idItem: '',
    idMovementType: '',
    idUser: session?.user.id ?? '',
  });

  // --- INITIALISATION ---
  React.useEffect(() => {
    if (!pIdItem || !dataItems) return;

    const foundItem = dataItems.find((i) => i.id === pIdItem || i.reference === pIdItem);

    if (foundItem) {
      const associatedStock = dataStk?.find((s) => s.idItem === foundItem.id);
      setFormData((prev) => ({
        ...prev,
        idItem: foundItem.id,
        idStock: associatedStock?.id ?? '',
        quantity: 0,
      }));
    } else {
      const foundStockById = dataStk?.find((s) => s.id === pIdItem);
      if (foundStockById) {
        setFormData((prev) => ({
          ...prev,
          idItem: foundStockById.idItem,
          idStock: foundStockById.id,
          quantity: 0,
        }));
      }
    }
  }, [pIdItem, dataItems, dataStk]);

  const [openMvt, setOpenMvt] = React.useState(false);
  const [openStk, setOpenStk] = React.useState(false);

  const selectedItem =
    dataItems?.find((i) => i.id === formData.idItem) ||
    dataStk?.find((s) => s.id === formData.idStock)?.item;

  // @ts-expect-error : gestion safe de l'unité
  const unitLabel = selectedItem?.unit?.symbol || selectedItem?.unit?.name || '';

  // --- VALIDATION UX SUPPLÉMENTAIRE ---
  // On récupère le type de mouvement sélectionné pour savoir si c'est une Entrée ou une Sortie
  const selectedType = dataMvtTypes?.find((t) => t.id === formData.idMovementType);
  const isEntry = selectedType?.isEntry; // true, false, ou undefined

  // Bloquant : Si c'est une SORTIE (!isEntry) et qu'il n'y a PAS de stock (!idStock)
  const isImpossibleExit = isEntry === false && !formData.idStock;

  return (
    <AddSheet
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Faire un nouveau mouvement"
      invalidateKeys={[['movements'], ['stocks']]}
      mutationFn={() => {
        // 🛡️ SÉCURITÉ : On s'assure d'envoyer une string pour idItem
        if (!formData.idItem) {
          throw new Error('Aucun article sélectionné');
        }
        return createMovement({
          ...formData,
          idItem: formData.idItem, // TypeScript est content maintenant
        });
      }}
      onReset={() =>
        setFormData({
          quantity: 0,
          idStock: '',
          idItem: '',
          idMovementType: '',
          idUser: session?.user?.id ?? '',
        })
      }
      isSubmitDisabled={
        formData.quantity <= 0 ||
        !formData.idMovementType ||
        (!formData.idStock && !formData.idItem) || // Pas d'item sélectionné
        !session?.user ||
        isImpossibleExit // 👈 On bloque le bouton si on essaie de sortir un truc qui n'existe pas
      }
    >
      <div className="grid gap-4 py-4">
        {/* --- TYPE DE MOUVEMENT --- */}
        <div className="grid gap-2">
          <Label>Type de mouvement</Label>
          <Popover open={openMvt} onOpenChange={setOpenMvt}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openMvt}
                className="w-full justify-between"
              >
                {formData.idMovementType
                  ? dataMvtTypes?.find((item) => item.id === formData.idMovementType)?.name
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
                    {dataMvtTypes?.map((item) => (
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

        {/* --- ARTICLE CONCERNÉ --- */}
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
                {selectedItem ? selectedItem.name : 'Choisir un article...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Rechercher un article..." className="h-9" />
                <CommandList>
                  <CommandEmpty>Aucun article trouvé</CommandEmpty>
                  <CommandGroup>
                    {dataItems?.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.name}
                        onSelect={() => {
                          const existingStock = dataStk?.find((s) => s.idItem === item.id);
                          setFormData((prev) => ({
                            ...prev,
                            idItem: item.id,
                            idStock: existingStock?.id ?? '',
                          }));
                          setOpenStk(false);
                        }}
                      >
                        {item.name}
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            formData.idItem === item.id ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* --- MESSAGES D'INFORMATION / ERREUR --- */}
          {formData.idItem && !formData.idStock && (
            <div className="flex flex-col gap-1 mt-1">
              {/* Message info : Nouveau stock */}
              <span className="text-xs text-amber-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Cet article n'a pas encore de stock.
              </span>

              {/* Message erreur : Sortie impossible */}
              {isImpossibleExit && (
                <span className="text-xs text-red-600 font-bold animate-pulse">
                  ⛔ Impossible d'effectuer une sortie sur un stock inexistant.
                </span>
              )}
            </div>
          )}
        </div>

        {/* --- CHAMP QUANTITÉ --- */}
        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantité</Label>
          <div className="relative">
            <Input
              id="quantity"
              type="number"
              min={0}
              // Pour éviter les bugs d'UX, on vide le champ s'il est à 0 au focus
              onFocus={(e) => e.target.select()}
              className="pr-16"
              value={formData.quantity}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, quantity: Number(e.target.value) }))
              }
            />
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
