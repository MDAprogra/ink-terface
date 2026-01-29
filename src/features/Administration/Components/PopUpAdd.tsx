'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// 1. On enrichit la configuration
export type AddFieldConfig = {
  label: string;
  name: string;
  // On limite les types possibles pour gérer notre affichage
  type?: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  // Nouveau : Les options pour le select (tableau de label/value)
  options?: { label: string; value: string }[];
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
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: action,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      setOpen(false);
      reset();
      toast.success(`Utilisateur ${data.email} créé avec succès !`);
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

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-4">
            {fields.map((field) => (
              <div className="grid gap-2" key={field.name}>
                <Label htmlFor={field.name}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>

                {/* --- CAS 1 : C'est un SELECT --- */}
                {field.type === 'select' ? (
                  <Controller
                    name={field.name}
                    control={control}
                    rules={{ required: field.required }}
                    render={({ field: { onChange, value } }) => (
                      <Select onValueChange={onChange} value={value} disabled={isPending}>
                        <SelectTrigger>
                          <SelectValue placeholder={field.placeholder || 'Sélectionner...'} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  /* --- CAS 2 : C'est un INPUT Classique --- */
                  <Input
                    id={field.name}
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    disabled={isPending}
                    {...register(field.name, { required: field.required })}
                  />
                )}

                {errors[field.name] && (
                  <span className="text-sm text-red-500">Ce champ est requis</span>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
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
