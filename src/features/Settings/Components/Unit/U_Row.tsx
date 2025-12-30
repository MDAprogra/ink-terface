'use client';

import { MoreHorizontalIcon, Pencil, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { deleteUnit } from '@/actions/unit/delete-unit';
import { editUnit } from '@/actions/unit/edit-unit';
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

// On définit les props attendues
interface UnitRowProps {
  unit: {
    id: string;
    name: string;
    code: string;
  };
}

export const UnitRow = ({ unit }: UnitRowProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeletingOpen, setIsDeletingOpen] = useState(false);
  const [name, setName] = useState(unit.name);
  const [code, setCode] = useState(unit.code);
  useEffect(() => {
    if (isEditOpen) {
      setName(unit.name);
      setCode(unit.code);
    }
  }, [isEditOpen, unit.name, unit.code]);

  return (
    <TableRow>
      <TableCell className="font-medium">{unit.name}</TableCell>
      <TableCell className="font-medium">{unit.code}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="More Options">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
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
          title={`Modifier "${unit.name}"`}
          queryKey={['setting_unit']}
          mutationFn={() => editUnit(name, unit.id, code)}
          isSubmitDisabled={(name === unit.name && code === unit.code) || name.length < 2}
        >
          <div className="grid gap-2">
            <Label htmlFor={`edit-name-${unit.name}`}>Nom</Label>
            <Input id={`edit-name-${unit.name}`} value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`edit-name-${unit.code}`}>Code</Label>
            <Input id={`edit-name-${unit.code}`} value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
        </EditSheet>

        <DialogConfirmDelete
          item={unit}
          open={isDeletingOpen}
          onOpenChange={setIsDeletingOpen}
          action={deleteUnit}
          queryKey={['setting_unit']}
        />
      </TableCell>
    </TableRow>
  );
};
