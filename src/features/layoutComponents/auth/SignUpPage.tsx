'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';

type CreateDataFormValues = {
  name: string;
  email: string;
  password: string;
  image?: string;
};

export const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<CreateDataFormValues>();

  const router = useRouter();

  const onSubmit: SubmitHandler<CreateDataFormValues> = async (data) => {
    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        image: data?.image,
        callbackURL: '/',
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onError: (ctx) => {
          setIsLoading(false);
          setError('root', {
            message: ctx.error.message,
          });
        },
        onSuccess: () => {
          setIsLoading(false);
          router.replace('/app');
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:outline-white/10">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">S'enregistrer</h1>
          <p className="text-sm text-muted-foreground mt-2">Créez votre compte pour commencer.</p>
        </div>

        {/* Champ Name */}
        <div className="space-y-2">
          <Label htmlFor="nameInput">Nom & Prénom</Label>
          <Input
            type="text"
            placeholder="Votre Nom & Prénom"
            id="nameInput"
            {...register('name', { required: 'Le nom est requis' })}
            disabled={isLoading}
            className="w-full"
          />
          {errors.name && <p className="text-xs font-medium text-red-500">{errors.name.message}</p>}
        </div>

        {/* Champ Email */}
        <div className="space-y-2">
          <Label htmlFor="emailInput" className="flex items-center gap-2">
            Email
            <span className="text-xs font-normal text-muted-foreground">(email@exemple.com)</span>
          </Label>
          <Input
            type="email"
            placeholder="votre@email.com"
            id="emailInput"
            {...register('email', { required: "L'email est requis" })}
            disabled={isLoading}
            className="w-full"
          />
          {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
        </div>

        {/* Champ Password */}
        <div className="space-y-2">
          <Label htmlFor="passwordInput">Mot de passe</Label>
          <Input
            type="password"
            placeholder="••••••••"
            id="passwordInput"
            {...register('password', {
              required: 'Le mot de passe est requis',
              minLength: { value: 8, message: '8 caractères minimum' },
            })}
            disabled={isLoading}
            className="w-full"
          />
          {errors.password && <p className="text-xs font-medium text-red-500">{errors.password.message}</p>}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 pt-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Spinner className="size-4 mr-2" />}
            {isLoading ? 'Création en cours...' : `S'enregistrer`}
          </Button>

          {errors.root && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20">
              {errors.root.message}
            </div>
          )}

          {/* Lien vers Sign In */}
          <div className="text-center text-sm text-muted-foreground">
            Déjà un compte ?{' '}
            <a href="/sign-in" className="font-semibold text-primary hover:underline">
              Se connecter
            </a>
          </div>
        </div>
      </div>
    </form>
  );
};
