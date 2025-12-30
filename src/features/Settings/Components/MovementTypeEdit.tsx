import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { editMovementType } from '@/actions/movement-type/edit-movement-type';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';

// Definition de l'interface des props
interface TypeItemEditProps {
  movement: { id: string; name: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MovementTypeEdit = ({ movement, open, onOpenChange }: TypeItemEditProps) => {
  //TODO: Possible changement
  const [name, setName] = useState(movement.name);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setName(movement.name);
    }
  }, [movement.name, open]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (newName: string) => {
      await editMovementType(newName, movement.id);
    },
    onSuccess: () => {
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['setting_movementType'] });
      toast.info(`Modification de ${movement.name}`);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(name);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <SheetHeader>
            {/* //TODO: A completer */}
            <SheetTitle>Modification de {movement.name}</SheetTitle>
            {/* <SheetDescription>Veuillez vérifier que le nouveau type n'existe pas déjà.</SheetDescription> */}
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="grid gap-3">
              <Label htmlFor="nom-type-item">Nom</Label>
              <Input id="nom-type-item" onChange={(e) => setName(e.target.value)} disabled={isPending} value={name} />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit" disabled={isPending}>
              Valider la modification
            </Button>
            <SheetClose asChild>
              <Button variant="outline" type="button" disabled={isPending}>
                Annuler
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
