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

const { data: session } = await authClient.getSession();
// if (error) {
//   toast.error(error.message);
//   redirect('app');
// }
interface MVT_AddSheetProps {
  pIdItem?: string;
}

type NewMovementForm = Pick<Movement, 'idStock' | 'idMovementType' | 'idUser'> & {
  quantity: number;
};

export const MVT_AddSheet = ({ pIdItem }: MVT_AddSheetProps) => {
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

  return (
    <AddSheet
      title="Faire un nouveau mouvement"
      queryKey={['movements']}
      mutationFn={() => createMovement(formData)}
      onReset={() =>
        setFormData({
          quantity: 0,
          idStock: pIdItem ?? '',
          idMovementType: '',
          idUser: session?.user.id ?? '',
        })
      }
      isSubmitDisabled={
        formData.quantity <= 0 || // On bloque si 0 ou négatif
        !formData.idMovementType || // Vérifie si vide ou null
        !formData.idStock || // Vérifie si vide ou null
        !session?.user
      }
    >
      <div>
        <Popover open={openMvt} onOpenChange={setOpenMvt}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openMvt} className="w-full justify-between">
              {/* LOGIQUE D'AFFICHAGE : On cherche le nom basé sur l'ID stocké */}
              {formData.idMovementType
                ? data?.find((item) => item.id === formData.idMovementType)?.name
                : 'Choisir un type de mouvement'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Rechercher un type ..." className="h-9" />
              <CommandList>
                <CommandEmpty>Pas de type trouvé</CommandEmpty>
                <CommandGroup>
                  {data?.map((item) => (
                    <CommandItem
                      key={item.id}
                      // IMPORTANT : value doit être le NOM pour que la recherche fonctionne
                      value={item.name}
                      onSelect={() => {
                        // MISE À JOUR DU STATE : On stocke l'ID
                        setFormData((prev) => ({
                          ...prev,
                          idMovementType: item.id === prev.idMovementType ? '' : item.id,
                        }));
                        setOpenMvt(false);
                      }}
                    >
                      {item.name}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          // COMPARAISON : On vérifie si l'ID est celui sélectionné
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

      <div>
        <Popover open={openStk} onOpenChange={setOpenStk}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openStk}
              className="w-full justify-between disabled:opacity-80"
              disabled={!!pIdItem}
            >
              {/* LOGIQUE D'AFFICHAGE : On cherche le nom basé sur l'ID stocké */}
              {formData.idStock
                ? dataStk?.find((item) => item.id === formData.idStock)?.item.name
                : 'Choisir un article'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Rechercher un article ..." className="h-9" />
              <CommandList>
                <CommandEmpty>Pas de stock trouvé</CommandEmpty>
                <CommandGroup>
                  {dataStk?.map((item) => (
                    <CommandItem
                      key={item.id}
                      // IMPORTANT : value doit être le NOM pour que la recherche fonctionne
                      value={item.item.name}
                      onSelect={() => {
                        // MISE À JOUR DU STATE : On stocke l'ID
                        setFormData((prev) => ({
                          ...prev,
                          idStock: item.id === prev.idStock ? '' : item.id,
                        }));
                        setOpenStk(false);
                      }}
                    >
                      {item.item.name}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          // COMPARAISON : On vérifie si l'ID est celui sélectionné
                          formData.idStock === item.id ? 'opacity-100' : 'opacity-0',
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

      <div className="grid gap-3">
        <Label htmlFor="quantity">Quantité</Label>
        <Input
          id="quantity"
          type="number"
          min={0}
          value={formData.quantity}
          onChange={(e) => {
            // Pour un input standard, on récupère e.target.value
            setFormData((prev) => ({
              ...prev,
              quantity: Number(e.target.value), // Conversion importante en nombre
            }));
          }}
        />
      </div>
    </AddSheet>
  );
};
