import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface AddSheetProps {
  triggerLabel?: string;
  title: string;
  description?: string;

  queryKey: string[];
  mutationFn: () => Promise<unknown>;
  onReset: () => void;

  children: ReactNode;
  isSubmitDisabled?: boolean;
}

export const AddSheet = ({
  triggerLabel = 'Ajouter',
  title,
  description = "Veuillez vérifier que l'enregistrement n'existe pas déjà.",
  queryKey,
  mutationFn,
  onReset,
  children,
  isSubmitDisabled = false,
}: AddSheetProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey });
      onReset();
      toast.info('Ajout réussi !');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </SheetTrigger>

      <SheetContent>
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>

          {/* Zone des Inputs (Flexible) */}
          <div className="flex-1 overflow-y-auto py-6 px-1">
            <div className="grid gap-4">{children}</div>

            {/* Gestion d'erreur globale */}
            {error && (
              <div className="mt-4">
                <Badge variant="destructive" className="whitespace-normal text-center">
                  {error.message || 'Une erreur est survenue'}
                </Badge>
              </div>
            )}
          </div>

          <SheetFooter className="mt-auto">
            <Button type="submit" disabled={isPending || isSubmitDisabled}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {triggerLabel}
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
