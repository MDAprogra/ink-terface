'use client';

import { MoreHorizontalIcon, Pencil, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { deleteMovementType } from '@/actions/movement-type/delete-movement-type';
import { editMovementType } from '@/actions/movement-type/edit-movement-type';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { EditSheet } from '@/features/Global/EditSheet';

import { DialogConfirmDelete } from '../../../Global/ConfirmDeleting';

// On définit les props attendues
interface MovementTypeRowProps {
  movement: {
    id: string;
    name: string;
    isEntry: boolean;
  };
}

export const MovementTypeRow = ({ movement }: MovementTypeRowProps) => {
  // TODO : delete underscore (x2)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeletingOpen, setIsDeletingOpen] = useState(false);
  const [name, setName] = useState(movement.name);
  const [isEntry, setIsEntry] = useState(movement.isEntry);
  useEffect(() => {
    if (isEditOpen) {
      setName(movement.name);
      setIsEntry(movement.isEntry);
    }
  }, [isEditOpen, movement.name, movement.isEntry]);

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
        <EditSheet
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          title={`Modifier "${movement.name}"`}
          queryKey={['setting_movementType']}
          mutationFn={() =>
            editMovementType({
              m_name: name,
              m_id: movement.id,
              m_isEntry: isEntry,
            })
          }
          isSubmitDisabled={(name === movement.name && isEntry === movement.isEntry) || name.length < 2}
        >
          <div className="grid gap-2">
            <Label htmlFor={`edit-name-${movement.id}`}>Nom</Label>
            <Input id={`edit-name-${movement.id}`} value={name} onChange={(e) => setName(e.target.value)} />
            <Checkbox id="isEntry" checked={isEntry} onCheckedChange={(checked) => setIsEntry(checked as boolean)} />
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
