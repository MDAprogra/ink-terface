import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { toast } from 'sonner'; // ou ton système de toast préféré

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
} from '@/components/ui/sheet';

interface UniversalSheetEditProps {
  // --- Gestion de l'état (OBLIGATOIRE pour un Edit) ---
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // --- UI ---
  title: string;
  description?: string;
  submitLabel?: string;

  // --- Logique Métier ---
  queryKey: string[]; // La clé à invalider (ex: ['setting_itemType'])
  mutationFn: () => Promise<unknown>; // L'appel à ton Server Action

  // --- Contenu ---
  children: ReactNode; // Les inputs
  isSubmitDisabled?: boolean; // Validation
}

export const EditSheet = ({
  open,
  onOpenChange,
  title,
  description = 'Modifiez la ou les information(s) ci-dessous.',
  submitLabel = 'Enregistrer la ou les modification(s)',
  queryKey,
  mutationFn,
  children,
  isSubmitDisabled = false,
}: UniversalSheetEditProps) => {
  const queryClient = useQueryClient();

  // Configuration de la mutation
  const { mutate, isPending, error } = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      // 1. Fermer le sheet
      onOpenChange(false);
      // 2. Rafraîchir les données
      queryClient.invalidateQueries({ queryKey });
      // 3. Feedback
      toast.success('Modification effectuée avec succès !');
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
    // Note : Pas de <SheetTrigger> ici, car l'ouverture est gérée par le parent
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>

          {/* Zone de contenu scrollable */}
          <div className="flex-1 overflow-y-auto py-6 px-1">
            <div className="grid gap-4">{children}</div>

            {/* Affichage des erreurs API */}
            {error && (
              <div className="mt-4">
                <Badge variant="destructive" className="whitespace-normal text-center w-full">
                  {(error as Error).message || 'Une erreur est survenue'}
                </Badge>
              </div>
            )}
          </div>

          <SheetFooter className="mt-auto">
            <Button type="submit" disabled={isPending || isSubmitDisabled}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitLabel}
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
