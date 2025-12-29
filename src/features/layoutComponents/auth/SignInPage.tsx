'use client';

import Link from 'next/link'; // 👈 Import ajouté pour la navigation
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';

type CreateDataFormValues = {
  email: string;
  password: string;
};

export const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<CreateDataFormValues>();

  const onSubmit: SubmitHandler<CreateDataFormValues> = async (data) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: '/',
        rememberMe: false,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsLoading(false);
          router.replace('/app');
        },
        onError: (ctx) => {
          setIsLoading(false);
          setError('root', {
            message: ctx.error.message,
          });
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:outline-white/10">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Se Connecter</h1>
          <p className="text-sm text-muted-foreground mt-2">Entrez vos identifiants pour accéder à votre compte.</p>
        </div>

        {/* Groupe Email */}
        <div className="space-y-2">
          <Label htmlFor="emailInput" className="flex items-center gap-2">
            Email
            <span className="text-xs font-normal text-muted-foreground">(email@exemple.fr)</span>
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

        {/* Groupe Password */}
        <div className="space-y-2">
          <Label htmlFor="passwordInput">Mot de passe</Label>
          <Input
            type="password"
            placeholder="••••••••"
            id="passwordInput"
            {...register('password', { required: 'Le mot de passe est requis' })}
            disabled={isLoading}
            className="w-full"
          />
          {errors.password && <p className="text-xs font-medium text-red-500">{errors.password.message}</p>}
        </div>

        {/* Bouton et Actions */}
        <div className="flex flex-col gap-4 pt-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Spinner className="size-4 mr-2" />}
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>

          {errors.root && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20">
              {errors.root.message}
            </div>
          )}

          {/* 👇 AJOUT DU LIEN ICI */}
          <div className="text-center text-sm text-muted-foreground">
            Vous n'avez pas encore de compte?{' '}
            <Link href="/sign-up" className="font-semibold text-primary hover:underline">
              S'enregistrer
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};
