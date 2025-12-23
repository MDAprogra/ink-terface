'use client';

import { ArrowLeftRight, Home, LogOut, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

const menuItems = [
  { label: 'Accueil', icon: Home, href: '/app' },
  { label: 'Stock', icon: Package, href: '/app/profile' },
  { label: 'Mouvements', icon: ArrowLeftRight, href: '/app/notifications' },
  //{ label: 'Paramètres', icon: Settings, href: '/app/settings' },
];

export function UserMenu() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) return <div>Chargement...</div>;
  if (!session) return null;

  return (
    <div className="flex flex-col h-full w-full">
      {/* 1. Zone de Navigation (Prend toute la place disponible) */}
      <nav className="flex-1 flex flex-col gap-1 p-2">
        {menuItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            asChild
            className="w-full justify-start gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </Button>
        ))}
      </nav>

      {/* 2. Zone Utilisateur & Déconnexion (Collée en bas via mt-auto si le parent est h-full) */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-800 mt-auto flex flex-col gap-2">
        {/* Info User */}
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ''} />
            <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate max-w-30">{session.user.name}</span>
            <span className="text-xs text-gray-500 truncate max-w-30">{session.user.email}</span>
          </div>
        </div>

        {/* Bouton Déconnexion */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          onClick={async () => {
            await authClient.signOut();
            router.push('/sign-in');
          }}
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </Button>
      </div>
    </div>
  );
}
