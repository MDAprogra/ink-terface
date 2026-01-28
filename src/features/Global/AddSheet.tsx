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

  queryKey?: string[];
  invalidateKeys?: string[][];

  mutationFn: () => Promise<unknown>;
  onReset: () => void;

  children: ReactNode;
  isSubmitDisabled?: boolean;

  // PROPS POUR LE SCAN (Mode Contrôlé)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AddSheet = ({
  triggerLabel = 'Ajouter',
  title,
  description = "Veuillez vérifier que l'enregistrement n'existe pas déjà.",
  queryKey,
  invalidateKeys,
  mutationFn,
  onReset,
  children,
  isSubmitDisabled = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddSheetProps) => {
  const queryClient = useQueryClient();

  // 1. STATE INTERNE (Pour usage classique avec bouton)
  const [internalOpen, setInternalOpen] = useState(false);

  // 2. LOGIQUE HYBRIDE
  // On vérifie si la prop 'open' est passée (mode Scan/Contrôlé)
  const isControlled = controlledOpen !== undefined;

  // La valeur réelle de l'ouverture (soit celle du parent, soit celle interne)
  const isOpen = isControlled ? controlledOpen : internalOpen;

  // Le wrapper pour gérer la fermeture
  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled && controlledOnOpenChange) {
      // Mode Scan : on prévient le parent
      controlledOnOpenChange(newOpen);
    } else {
      // Mode Bouton : on gère nous-mêmes
      setInternalOpen(newOpen);
    }

    // Reset du formulaire à la fermeture (avec petit délai pour l'animation)
    if (!newOpen && onReset) {
      setTimeout(() => onReset(), 300);
    }
  };

  const { mutate, isPending, error } = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      // ✅ CORRECTION : On utilise notre wrapper, pas un setOpen local
      handleOpenChange(false);
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }

      // 2. Gestion des multiples clés (Pour ton cas Mouvements + Stocks)
      if (invalidateKeys) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      onReset();
      toast.info('Ajout réussi !');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Une erreur est survenue');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    // ✅ CORRECTION : On lie les props calculées ici
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      {/* ✅ CORRECTION TRIGGER : 
         On n'affiche le bouton que si on n'est PAS en mode contrôlé.
         Si c'est le scanner qui pilote (isControlled), on ne veut pas de bouton visible.
      */}
      {!isControlled && (
        <SheetTrigger asChild>
          <Button variant="outline">{triggerLabel}</Button>
        </SheetTrigger>
      )}

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
              Valider
            </Button>

            <SheetClose asChild>
              {/* ✅ CORRECTION : Le bouton Annuler ferme via le wrapper */}
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Annuler
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
