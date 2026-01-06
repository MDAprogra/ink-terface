import { useState } from 'react';

import { createMovementType } from '@/actions/movement-type/create-movement-type';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddSheet } from '@/features/Global/AddSheet';

export const MT_AddSheet = () => {
  const [name, setName] = useState('');
  const [isEntry, setIsEntry] = useState(false);

  return (
    <AddSheet
      title="Ajouter un type de mouvement"
      queryKey={['setting_movementType']}
      mutationFn={() => createMovementType(name)}
      onReset={() => setName('')}
      isSubmitDisabled={name.trim().length < 2}
    >
      <div className="grid gap-3">
        <Label htmlFor="name-movement-type">Nom</Label>
        <Input id="name-movement-type" onChange={(e) => setName(e.target.value)} value={name} />
      </div>
      <div className="flex items-center gap-3">
        <Label htmlFor="isEntry">Ajoute du Stock :</Label>
        <Checkbox id="isEntry" checked={isEntry} onCheckedChange={(checked) => setIsEntry(checked as boolean)} />
      </div>
    </AddSheet>
  );
};
