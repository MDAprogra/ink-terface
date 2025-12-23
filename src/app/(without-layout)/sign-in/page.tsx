import { SignInPage } from '@/features/layoutComponents/auth/SignInPage';

export default function SignIn() {
  return (
    // h-screen = hauteur de l'écran
    // items-center = centré verticalement
    // justify-center = centré horizontalement
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-zinc-950">
      <SignInPage />
    </div>
  );
}
