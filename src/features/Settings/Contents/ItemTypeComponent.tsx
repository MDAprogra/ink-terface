'use client';

import { useQuery } from '@tanstack/react-query';
import { MoreHorizontalIcon, Pencil, Trash2Icon } from 'lucide-react';

import { getTypeItem } from '@/actions/items/get-items';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ErrorAlert } from '../Components/ErrorAlert';
import { Loading } from '../Components/Loading';
import { TypeItemAdd } from '../Components/TypeItemAdd';

export const ItemTypeComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['setting_itemType'],
    queryFn: () => getTypeItem(),
  });

  return (
    <div className="p-6">
      <TypeItemAdd />
      {isLoading ? (
        <Loading />
      ) : !isLoading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Nom</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" aria-label="More Options">
                        <MoreHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Pencil />
                          Modifier
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem variant="destructive">
                          <Trash2Icon />
                          Trash
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <ErrorAlert />
      )}
    </div>
  );
};
