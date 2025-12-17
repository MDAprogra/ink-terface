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
  const onSubmit: SubmitHandler<CreateDataFormValues> = (data) => {
    authClient.signIn.email(
      {
        /**
         * The user email
         */
        email: data.email,
        /**
         * The user password
         */
        password: data.password,
        /**
         * A URL to redirect to after the user verifies their email (optional)
         */
        callbackURL: '/',
        /**
         * remember the user session after the browser is closed.
         * @default true
         */
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
          // Bonus : Afficher l'erreur API directement dans le formulaire
          setError('root', {
            message: ctx.error.message,
          });
        },
      },
    );
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="mx-auto flex-col max-w-sm items-center gap-x-4 rounded-xl bg-white p-6 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
        <h1 className="mb-4 text-2xl font-bold tracking-tight text-heading md:text-4xl lg:text-4xl">Sign-In</h1>
        <div className="mb-5">
          <Label className="mb-1" htmlFor="emailInput">
            Email <p className="text-gray-500 italic">(email@example.com)</p>
          </Label>
          <Input type="email" placeholder="Email" id="emailInput" {...register('email')} disabled={isLoading} />
        </div>
        <div className="mb-5">
          <Label className="mb-1" htmlFor="passwordInput">
            Password
          </Label>
          <Input
            type="password"
            placeholder="Password"
            id="passwordInput"
            {...register('password')}
            disabled={isLoading}
          />
        </div>
        <div className="flex">
          <Button type="submit" variant={'outline'} className="hover:bg-gray-200" disabled={isLoading}>
            {isLoading ? <Spinner className="size-6" /> : 'Sign In'}
          </Button>
          {errors.root && <p className="text-red-600 ml-2">Errors: {errors.root.message}</p>}
        </div>
      </div>
    </form>
  );
};
