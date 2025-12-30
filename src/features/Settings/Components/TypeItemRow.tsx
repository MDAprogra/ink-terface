'use client';

import { MoreHorizontalIcon, Pencil, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';

import { TypeItemEdit } from '../Components/TypeItemEdit';

// On définit les props attendues
interface ItemTypeRowProps {
  item: {
    id: string;
    name: string;
  };
}

export const ItemTypeRow = ({ item }: ItemTypeRowProps) => {
  // ✅ Chaque ligne a maintenant son PROPRE état d'ouverture
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <TableRow>
      <TableCell className="font-medium">{item.name}</TableCell>
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
              <DropdownMenuItem variant="destructive">
                <Trash2Icon className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Le Sheet d'édition, lié à l'état local */}
        <TypeItemEdit item={item} open={isEditOpen} onOpenChange={setIsEditOpen} />
      </TableCell>
    </TableRow>
  );
};
