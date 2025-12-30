'use client';

import { useQuery } from '@tanstack/react-query';

import { getTypeItem } from '@/actions/items/get-items';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ErrorAlert } from '../Components/ErrorAlert';
import { Loading } from '../Components/Loading';
import { TypeItemAdd } from '../Components/TypeItemAdd';
import { ItemTypeRow } from '../Components/TypeItemRow';

export const ItemTypeComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['setting_itemType'],
    queryFn: () => getTypeItem(),
  });
  if (isLoading) return <Loading />;
  if (!data) return <ErrorAlert />; // Gestion simple si data est undefined
  return (
    <div className="p-6">
      <div className="mb-4">
        <TypeItemAdd />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">Nom</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <ItemTypeRow key={item.id} item={item} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
