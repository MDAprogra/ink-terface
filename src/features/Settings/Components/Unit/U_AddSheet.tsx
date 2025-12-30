import { useState } from 'react';

import { createUnit } from '@/actions/unit/create-unit';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddSheet } from '@/features/global/AddSheet';

export const U_AddSheet = () => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  return (
    <AddSheet
      title="Ajouter une unité"
      queryKey={['setting_unit']}
      mutationFn={() => createUnit(name, code)}
      onReset={() => {
        setName('');
        setCode('');
      }}
      isSubmitDisabled={name.trim().length < 2 || code.trim().length === 0}
    >
      <div className="grid gap-3">
        <Label htmlFor="name-item-type">Nom</Label>
        <Input id="name-item-type" onChange={(e) => setName(e.target.value)} value={name} />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="code-item-type">Code</Label>
        <Input id="code-item-type" onChange={(e) => setCode(e.target.value)} value={code} />
      </div>
    </AddSheet>
  );
};
