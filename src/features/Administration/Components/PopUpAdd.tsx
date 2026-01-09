'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// On exporte ce type pour l'utiliser dans le parent aussi
export type AddFieldConfig = {
  label: string;
  name: string; // La clé envoyée à la BDD (ex: "name", "description")
  placeholder?: string;
  type?: string;
  required?: boolean;
};

interface PopUpAddProps {
  title: string;
  triggerLabel: string;
  fields: AddFieldConfig[];
  queryKey: string[];
  action: (data: any) => Promise<any>;
}

export default function PopUpAdd({ triggerLabel, title, fields, queryKey, action }: PopUpAddProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const {
    register, // C'est lui qui gère le "state" de l'input
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: action,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      setOpen(false);
      reset();
      toast.success('Ajout réussi !');
    },
    onError: (err: Error) => {
      console.error(err);
      toast.error(err.message || 'Une erreur est survenue');
    },
  });

  const onSubmit: SubmitHandler<any> = (data) => {
    mutate(data);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Le formulaire commence ICI, uniquement dans le contenu */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-4">
            {fields.map((field) => (
              <div className="grid gap-2" key={field.name}>
                <Label htmlFor={field.name}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id={field.name}
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  disabled={isPending}
                  // 👇 C'EST ICI QUE LA MAGIE OPÈRE 👇
                  // Cela remplace le value={state} et onChange={setState}
                  {...register(field.name, { required: field.required })}
                />
                {errors[field.name] && <span className="text-sm text-red-500">Ce champ est requis</span>}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Ajout...' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
