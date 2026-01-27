'use client';

import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useState } from 'react';

// Assure-toi d'avoir une action pour récupérer tous les items
// Si tu ne l'as pas, crée-la (ex: prisma.item.findMany())
import { getItems } from '@/actions/items/get-items';
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

// J'ajoute idItem (optionnel) pour gérer le cas où il n'y a pas de stock
type NewMovementForm = Pick<Movement, 'idStock' | 'idMovementType' | 'idUser'> & {
  quantity: number;
  idItem?: string; // Ajout temporaire pour la logique front
};

export const MVT_AddSheet = ({ pIdItem, isOpen, onOpenChange }: MVT_AddSheetProps) => {
  const { data: session } = authClient.useSession();

  // 1. Récupération des types de mouvement
  const { data: dataMvtTypes } = useQuery({
    queryKey: ['setting_movementType'],
    queryFn: () => getMovementType(),
  });

  // 2. Récupération des STOCKS (pour trouver l'idStock existant)
  const { data: dataStk } = useQuery({
    queryKey: ['stocks'],
    queryFn: () => getStock(),
  });

  // 3. 👇 Récupération des ARTICLES (pour l'affichage complet)
  const { data: dataItems } = useQuery({
    queryKey: ['items'],
    queryFn: () => getItems(), // Tu dois importer cette action
  });

  const [formData, setFormData] = useState<NewMovementForm>({
    quantity: 0,
    idStock: '', // Sera vide si pas de stock
    idItem: '', // Garde la ref de l'article sélectionné
    idMovementType: '',
    idUser: session?.user.id ?? '',
  });

  // --- LOGIQUE DE SCAN / INITIALISATION ---
  React.useEffect(() => {
    if (!pIdItem || !dataItems) return;

    // A. On cherche d'abord l'ARTICLE correspondant au scan (ID ou Référence)
    const foundItem = dataItems.find((i) => i.id === pIdItem || i.reference === pIdItem);

    if (foundItem) {
      // B. On cherche si un stock existe déjà pour cet article
      const associatedStock = dataStk?.find((s) => s.idItem === foundItem.id);

      setFormData((prev) => ({
        ...prev,
        idItem: foundItem.id, // On a l'article
        idStock: associatedStock?.id ?? '', // On met l'ID stock si trouvé, sinon vide
        quantity: 0,
      }));
    } else {
      // Fallback: Si on scanne directement un ID de stock (rare mais possible)
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

  // --- LOGIQUE D'AFFICHAGE ---
  // On récupère l'article sélectionné (via formData.idItem ou via le stock)
  const selectedItem =
    dataItems?.find((i) => i.id === formData.idItem) || dataStk?.find((s) => s.id === formData.idStock)?.item;

  // Récupération du label d'unité
  // @ts-expect-error : gestion safe
  const unitLabel = selectedItem?.unit?.symbol || selectedItem?.unit?.name || '';

  return (
    <AddSheet
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Faire un nouveau mouvement"
      invalidateKeys={[['movements'], ['stocks']]}
      mutationFn={() => {
        // ⚠️ ATTENTION : Si formData.idStock est vide, ton backend createMovement
        // doit être capable de créer le stock à partir de formData.idItem
        return createMovement(formData);
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
      // On désactive si pas de type, pas de user, OU (pas de stock ET pas d'item)
      isSubmitDisabled={
        formData.quantity <= 0 || !formData.idMovementType || (!formData.idStock && !formData.idItem) || !session?.user
      }
    >
      <div className="grid gap-4 py-4">
        {/* --- TYPE DE MOUVEMENT --- */}
        <div className="grid gap-2">
          <Label>Type de mouvement</Label>
          <Popover open={openMvt} onOpenChange={setOpenMvt}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={openMvt} className="w-full justify-between">
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
                {/* 👇 AFFICHE LE NOM DEPUIS L'ITEM SÉLECTIONNÉ (MÊME SANS STOCK) */}
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
                    {/* 👇 ON BOUCLE SUR TOUS LES ITEMS MAINTENANT */}
                    {dataItems?.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.name}
                        onSelect={() => {
                          // Quand on sélectionne un item, on cherche son stock
                          const existingStock = dataStk?.find((s) => s.idItem === item.id);

                          setFormData((prev) => ({
                            ...prev,
                            idItem: item.id,
                            idStock: existingStock?.id ?? '', // ID stock ou vide
                          }));
                          setOpenStk(false);
                        }}
                      >
                        {item.name}
                        {/* On checke si l'item sélectionné est celui affiché */}
                        <Check
                          className={cn('ml-auto h-4 w-4', formData.idItem === item.id ? 'opacity-100' : 'opacity-0')}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {/* Petit indicateur visuel si pas de stock */}
          {formData.idItem && !formData.idStock && (
            <span className="text-xs text-amber-600 font-medium ml-1">⚠️ Cet article n'a pas encore de stock.</span>
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
              className="pr-16"
              value={formData.quantity}
              onChange={(e) => setFormData((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
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
