import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'; // Ajout Loader2
import React, { useState } from 'react';
import { toast } from 'sonner'; // Ou ton hook de toast habituel (ex: use-toast)

import { createItem } from '@/actions/items/create-item';
import { getSupplier } from '@/actions/supplier/get-supplier';
import { getTypeItem } from '@/actions/type-item/get-type-item';
import { getUnit } from '@/actions/unit/get-unit';
// Tes composants UI
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Item } from '@/generated/prisma/client';
import { cn } from '@/lib/utils';

export default function CatalogueAdd() {
  // State pour contrôler l'ouverture de la modale (nécessaire pour fermer après succès)
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [openTypeItem, setOpenTypeItem] = React.useState(false);
  const [openUnit, setOpenUnit] = React.useState(false);
  const [openSupplier, setOpenSupplier] = React.useState(false);

  const [newData, setNewData] = useState<Partial<Item>>({});

  // --- QUERIES ---
  const { data: d_supplier } = useQuery({ queryKey: ['supplier'], queryFn: () => getSupplier() });
  const { data: d_unit } = useQuery({ queryKey: ['unit'], queryFn: () => getUnit() });
  const { data: d_type } = useQuery({ queryKey: ['type'], queryFn: () => getTypeItem() });

  // --- MUTATION ---
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      // 1. Validation des Selects (qui sont dans le state newData)
      if (!newData.idTypeItem || !newData.idUnit || !newData.idSupplier) {
        throw new Error('Veuillez sélectionner un Type, une Unité et un Fournisseur.');
      }

      // 2. Récupération et conversion des données du formulaire
      const rawData = {
        name: formData.get('name') as string,
        reference: formData.get('ref') as string, // Attention: 'ref' dans le name de l'input
        description: formData.get('username') as string, // 'username' dans ton input
        color: formData.get('color') as string,
        securityStock: Number(formData.get('securityStock')) || 0,
        shelfLife: Number(formData.get('shelfLife')) || 0,
        purchasePrice: Number(formData.get('purchasePrice')) || 0,

        // Données venant des Selects (state React)
        typeItem: newData.idTypeItem,
        unit: newData.idUnit,
        supplier: newData.idSupplier,
      };

      // 3. Appel au Server Action
      const result = await createItem(rawData);

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la création');
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Article ajouté avec succès !');
      queryClient.invalidateQueries({ queryKey: ['items'] });
      setOpen(false); // Ferme la modale
      setNewData({}); // Reset du state local
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Gestionnaire de soumission
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêche le rechargement de page
    const formData = new FormData(e.currentTarget); // Récupère les champs <input>
    mutate(formData); // Lance la mutation
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Ajouter un article</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        {/* Le formulaire enveloppe tout le contenu */}
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Ajouter un article</DialogTitle>
            <DialogDescription>
              Les champs avec une <strong>*</strong> sont obligatoires
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* INPUTS TEXTE */}
            <div className="grid gap-3">
              <Label htmlFor="name-1">Nom*</Label>
              <Input id="name-1" name="name" required placeholder="EKOCURE ... (Obligatoire)" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="ref-1">Référence*</Label>
              <Input id="ref-1" name="ref" required placeholder="[10 Caractères max.] (Obligatoire)" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Description</Label>
              <Input id="username-1" name="username" placeholder="Décrivez l'article (Option)" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="color-1">Couleur</Label>
              <Input id="color-1" name="color" placeholder="Bleu, Rouge... (Option)" />
            </div>

            {/* INPUTS NOMBRES */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="securityStock-1">Stock sécu.</Label>
                <Input id="securityStock-1" name="securityStock" type="number" step="0.01" placeholder="0" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="shelfLife-1">Conservation (j)</Label>
                <Input id="shelfLife-1" name="shelfLife" type="number" placeholder="0" />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="purchasePrice-1">Prix d'achat*</Label>
              <Input id="purchasePrice-1" name="purchasePrice" type="number" step="0.01" required placeholder="0.00" />
            </div>

            {/* --- SELECT: TYPE ITEM --- */}
            <div className="grid gap-3">
              <Label>Type d'article*</Label>
              <Popover open={openTypeItem} onOpenChange={setOpenTypeItem} modal={true}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {newData?.idTypeItem
                      ? d_type?.find((t) => t.id === newData.idTypeItem)?.name
                      : 'Choisir un type...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandList>
                      <CommandEmpty>Aucun résultat</CommandEmpty>
                      <CommandGroup>
                        {d_type?.map((type) => (
                          <CommandItem
                            key={type.id}
                            value={type.name}
                            onSelect={() => {
                              setNewData((prev) => ({ ...prev, idTypeItem: type.id }));
                              setOpenTypeItem(false);
                            }}
                          >
                            {type.name}
                            <Check
                              className={cn(
                                'ml-auto h-4 w-4',
                                newData?.idTypeItem === type.id ? 'opacity-100' : 'opacity-0',
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

            {/* --- SELECT: UNIT --- */}
            <div className="grid gap-3">
              <Label>Unité*</Label>
              <Popover open={openUnit} onOpenChange={setOpenUnit} modal={true}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {newData?.idUnit ? d_unit?.find((u) => u.id === newData.idUnit)?.name : 'Choisir une unité...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandList>
                      <CommandEmpty>Aucun résultat</CommandEmpty>
                      <CommandGroup>
                        {d_unit?.map((unit) => (
                          <CommandItem
                            key={unit.id}
                            value={unit.name}
                            onSelect={() => {
                              setNewData((prev) => ({ ...prev, idUnit: unit.id }));
                              setOpenUnit(false);
                            }}
                          >
                            {unit.name}
                            <Check
                              className={cn(
                                'ml-auto h-4 w-4',
                                newData?.idUnit === unit.id ? 'opacity-100' : 'opacity-0',
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

            {/* --- SELECT: SUPPLIER --- */}
            <div className="grid gap-3">
              <Label>Fournisseur*</Label>
              <Popover open={openSupplier} onOpenChange={setOpenSupplier} modal={true}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {newData?.idSupplier
                      ? d_supplier?.find((s) => s.id === newData.idSupplier)?.name
                      : 'Choisir un fournisseur...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Rechercher..." />
                    <CommandList>
                      <CommandEmpty>Aucun résultat</CommandEmpty>
                      <CommandGroup>
                        {d_supplier?.map((supplier) => (
                          <CommandItem
                            key={supplier.id}
                            value={supplier.name}
                            onSelect={() => {
                              setNewData((prev) => ({ ...prev, idSupplier: supplier.id }));
                              setOpenSupplier(false);
                            }}
                          >
                            {supplier.name}
                            <Check
                              className={cn(
                                'ml-auto h-4 w-4',
                                newData?.idSupplier === supplier.id ? 'opacity-100' : 'opacity-0',
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
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
