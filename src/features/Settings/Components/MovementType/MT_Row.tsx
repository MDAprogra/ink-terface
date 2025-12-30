'use client';

import { MoreHorizontalIcon, Pencil, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { deleteMovementType } from '@/actions/movement-type/delete-movement-type';
import { editMovementType } from '@/actions/movement-type/edit-movement-type';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TableCell, TableRow } from '@/components/ui/table';
import { EditSheet } from '@/features/global/EditSheet';

import { DialogConfirmDelete } from '../../../global/ConfirmDeleting';
import { MovementTypeEdit } from '../MovementTypeEdit';

// On définit les props attendues
interface MovementTypeRowProps {
  movement: {
    id: string;
    name: string;
  };
}

export const MovementTypeRow = ({ movement }: MovementTypeRowProps) => {
  // TODO : delete underscore (x2)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeletingOpen, setIsDeletingOpen] = useState(false);
  const [name, setName] = useState(movement.name);
  useEffect(() => {
    if (isEditOpen) {
      setName(movement.name);
    }
  }, [isEditOpen, movement.name]);

  return (
    <TableRow>
      <TableCell className="font-medium">{movement.name}</TableCell>
      <TableCell className="text-right">
        {/* Le Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="More Options">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              {/* Le clic active le state LOCAL de cette ligne uniquement */}
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onClick={() => setIsDeletingOpen(true)}>
                <Trash2Icon className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Le Sheet d'édition, lié à l'état local */}
        {/* //TODO: Edit and Delete */}
        <MovementTypeEdit movement={movement} open={isEditOpen} onOpenChange={setIsEditOpen} />

        <EditSheet
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          title={`Modifier "${movement.name}"`}
          queryKey={['setting_movementType']}
          mutationFn={() => editMovementType(name, movement.id)}
          isSubmitDisabled={name === movement.name || name.length < 2}
        >
          <div className="grid gap-2">
            <Label htmlFor={`edit-name-${movement.id}`}>Nom</Label>
            <Input id={`edit-name-${movement.id}`} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </EditSheet>
        <DialogConfirmDelete
          item={movement}
          open={isDeletingOpen}
          onOpenChange={setIsDeletingOpen}
          action={deleteMovementType}
          queryKey={['setting_movementType']}
        />
      </TableCell>
    </TableRow>
  );
};
