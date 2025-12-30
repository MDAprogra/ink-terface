import { useState } from 'react';

import { createSupplier } from '@/actions/supplier/create-supplier';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddSheet } from '@/features/global/AddSheet';

export const S_AddSheet = () => {
  const [name, setName] = useState('');

  return (
    <AddSheet
      title="Ajouter un fournisseur"
      queryKey={['setting_supplier']}
      mutationFn={() => createSupplier(name)}
      onReset={() => setName('')}
      isSubmitDisabled={name.trim().length < 2}
    >
      <div className="grid gap-3">
        <Label htmlFor="name-supplier">Nom</Label>
        <Input id="name-supplier" onChange={(e) => setName(e.target.value)} value={name} />
      </div>
    </AddSheet>
  );
};
