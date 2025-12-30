import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { deleteTypeItem } from '@/actions/type-item/delete-type-item';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TypeItemEditProps {
  item: { id: string; name?: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogConfirmDelete({ item, open, onOpenChange }: TypeItemEditProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await deleteTypeItem(item.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['setting_itemType'] });
      onOpenChange(false);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('You are into handleSubmit !');
    e.preventDefault();
    mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sur de vouloir supprimer cette enregistrement ?</AlertDialogTitle>
          <AlertDialogDescription>
            {item.name
              ? `Vous allez supprimer définitivement "${item.name}".`
              : "Cette action est irréversible et supprimera l'enregistrement de la base de données."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white" // Style destructif
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              'Confirmer la suppression'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
