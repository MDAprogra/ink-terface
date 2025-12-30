import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { createTypeItem } from '@/actions/type-item/create-type-item';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export const TypeItemAdd = () => {
  const [open, setOpen] = useState(false); // Pour contrôler l'ouverture
  const [name, setName] = useState('');

  const queryClient = useQueryClient();

  // Configuration de la mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async (newName: string) => {
      // On appelle la server action
      await createTypeItem(newName);
    },
    onSuccess: () => {
      // 1. On ferme le sheet
      setOpen(false);
      // 2. On reset le champ
      setName('');
      // 3. On dit à TanStack Query de recharger la liste des types (si tu en as une ailleurs)
      // Assure-toi que la clé correspond à celle utilisée dans ton composant de liste
      queryClient.invalidateQueries({ queryKey: ['setting_itemType'] });

      // toast.success("Type ajouté avec succès !")
    },
    onError: (err) => {
      // toast.error(err.message)
      console.error(err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(name);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Ajouter</Button>
      </SheetTrigger>
      <SheetContent>
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <SheetHeader>
            <SheetTitle>Ajouter un Type de produit</SheetTitle>
            <SheetDescription>Veuillez vérifier que le nouveau type n'existe pas déjà.</SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="grid gap-3">
              <Label htmlFor="nom-type-item">Nom</Label>
              <Input id="nom-type-item" onChange={(e) => setName(e.target.value)} disabled={isPending} value={name} />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit" disabled={isPending}>
              Ajouter
            </Button>
            <SheetClose asChild>
              <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={isPending}>
                Annuler
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
