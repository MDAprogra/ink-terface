import { useState } from 'react';

import { createTypeItem } from '@/actions/type-item/create-type-item';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddSheet } from '@/features/Global/AddSheet';

export const TI_AddSheet = () => {
  const [name, setName] = useState('');

  return (
    <AddSheet
      title="Ajouter un type de produit"
      queryKey={['setting_itemType']}
      mutationFn={() => createTypeItem(name)}
      onReset={() => setName('')}
      isSubmitDisabled={name.trim().length < 2}
    >
      <div className="grid gap-3">
        <Label htmlFor="name-item-type">Nom</Label>
        <Input id="name-item-type" onChange={(e) => setName(e.target.value)} value={name} />
      </div>
    </AddSheet>
  );
};
