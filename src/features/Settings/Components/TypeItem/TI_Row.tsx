'use client';

import { Lock, MoreHorizontalIcon, Pencil, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { deleteTypeItem } from '@/actions/type-item/delete-type-item';
import { editTypeItem } from '@/actions/type-item/edit-type-item';
import { PermissionGuard } from '@/components/auth/permission-guard';
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

// On définit les props attendues
interface ItemTypeRowProps {
  item: {
    id: string;
    name: string;
  };
}

export const ItemTypeRow = ({ item }: ItemTypeRowProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeletingOpen, setIsDeletingOpen] = useState(false);
  const [name, setName] = useState(item.name);
  useEffect(() => {
    if (isEditOpen) {
      setName(item.name);
    }
  }, [isEditOpen, item.name]);

  return (
    <TableRow>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell className="text-right">
        <PermissionGuard
          resource="settings"
          action="edit"
          fallback={
            <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
              <Lock className="w-4 h-4" />
            </Button>
          }
        >
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
        </PermissionGuard>

        <EditSheet
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          title={`Modifier "${item.name}"`}
          queryKey={['setting_itemType']}
          mutationFn={() => editTypeItem(name, item.id)}
          isSubmitDisabled={name === item.name || name.length < 2}
        >
          <div className="grid gap-2">
            <Label htmlFor={`edit-name-${item.id}`}>Nom</Label>
            <Input
              id={`edit-name-${item.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </EditSheet>

        <DialogConfirmDelete
          item={item}
          open={isDeletingOpen}
          onOpenChange={setIsDeletingOpen}
          action={deleteTypeItem}
          queryKey={['setting_itemType']}
        />
      </TableCell>
    </TableRow>
  );
};
