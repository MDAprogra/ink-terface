'use client';

import { MoreHorizontalIcon, Pencil, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { deleteSupplier } from '@/actions/supplier/delete-supplier';
import { editSupplier } from '@/actions/supplier/edit-supplier';
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
import { EditSheet } from '@/features/Global/EditSheet';

import { DialogConfirmDelete } from '../../../Global/ConfirmDeleting';

interface SupplierRowProps {
  supplier: {
    id: string;
    name: string;
  };
}

export const S_Row = ({ supplier }: SupplierRowProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeletingOpen, setIsDeletingOpen] = useState(false);
  const [name, setName] = useState(supplier.name);
  useEffect(() => {
    if (isEditOpen) {
      setName(supplier.name);
    }
  }, [isEditOpen, supplier.name]);

  return (
    <TableRow>
      <TableCell className="font-medium">{supplier.name}</TableCell>
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
          title={`Modifier "${supplier.name}"`}
          queryKey={['setting_supplier']}
          mutationFn={() => editSupplier(name, supplier.id)}
          isSubmitDisabled={name === supplier.name || name.length < 2}
        >
          <div className="grid gap-2">
            <Label htmlFor={`edit-name-${supplier.id}`}>Nom</Label>
            <Input id={`edit-name-${supplier.id}`} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </EditSheet>
        <DialogConfirmDelete
          item={supplier}
          open={isDeletingOpen}
          onOpenChange={setIsDeletingOpen}
          action={deleteSupplier}
          queryKey={['setting_supplier']}
        />
      </TableCell>
    </TableRow>
  );
};
