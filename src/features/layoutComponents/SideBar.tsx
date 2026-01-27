'use client';

import {
  ArrowLeftRight,
  BookOpenText,
  Home,
  LogIn,
  LogOut,
  Package,
  ShieldCheck, // Icône pour l'admin
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton'; // Assure-toi d'avoir ce composant Shadcn
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils'; // Utilitaire classique de Shadcn pour fusionner les classes

// Définition des items du menu standard
const menuItems = [
  { label: 'Accueil', icon: Home, href: '/app', exact: true }, // exact: true pour l'accueil uniquement
  { label: 'Catalogue', icon: BookOpenText, href: '/app/catalogue' },
  {
    label: 'Stock',
    icon: Package,
    href: '/app/stock',
    roles: ['admin', 'manager', 'developer', 'owner'],
  },
  {
    label: 'Mouvements',
    icon: ArrowLeftRight,
    href: '/app/movement',
    roles: ['admin', 'manager', 'developer', 'owner'],
  },
];

export function UserMenu() {
  const { data: session, isPending } = authClient.useSession();

  const router = useRouter();
  const pathname = usePathname();

  // 1. Loading State : Skeleton (Squelette) au lieu de texte brut
  if (isPending) {
    return (
      <div className="flex flex-col h-full w-full p-2 gap-4">
        <div className="flex-1 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <div className="border-t pt-4 flex gap-3 items-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2 w-32" />
          </div>
        </div>
      </div>
    );
  }

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!session?.user?.role) return false;
    return item.roles.includes(session.user.role);
  });

  return (
    <div className="flex flex-col h-full w-full">
      {/* --- NAVIGATION --- */}
      <nav className="flex-1 flex flex-col gap-1 p-2">
        {/* Liste standard */}
        {filteredMenuItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Button
              key={item.href}
              variant={isActive ? 'secondary' : 'ghost'}
              asChild
              className={cn(
                'w-full justify-start gap-2 transition-all',
                isActive && 'bg-gray-200 dark:bg-slate-700 text-black dark:text-white font-medium',
              )}
            >
              <Link href={item.href}>
                <item.icon
                  className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')}
                />
                <span>{item.label}</span>
              </Link>
            </Button>
          );
        })}

        <div className="my-2 border-t border-gray-100 dark:border-gray-800" />

        {session && ['owner', 'developer', 'admin'].includes(session.user.role || '') && (
          <>
            <Button
              variant={pathname.startsWith('/app/settings') ? 'secondary' : 'ghost'}
              asChild
              className="w-full justify-start gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
            >
              <Link href="/app/settings">
                <ShieldCheck className="h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </Button>

            <Button
              variant={pathname.startsWith('/app/admin') ? 'secondary' : 'ghost'}
              asChild
              className="w-full justify-start gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
            >
              <Link href="/app/admin">
                <ShieldCheck className="h-4 w-4" />
                <span>Administration</span>
              </Link>
            </Button>
          </>
        )}
      </nav>

      {/* --- FOOTER UTILISATEUR --- */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-800 mt-auto flex flex-col gap-1">
        {session ? (
          <>
            <div className="flex items-center gap-3 px-2 py-2 mb-1 rounded-md hover:bg-muted/50 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image || ''} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {session.user.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">
                  {session.user.name}{' '}
                  <span className="text-xs text-muted-foreground truncate">
                    {session.user.role}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground truncate" title={session.user.email}>
                  {session.user.email}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-9"
              onClick={async () => {
                await authClient.signOut();
                router.push('/sign-in');
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-dashed text-muted-foreground hover:text-foreground hover:border-solid"
            onClick={() => router.push('/sign-in')}
          >
            <LogIn className="h-4 w-4" />
            <span>Se connecter</span>
          </Button>
        )}
      </div>
    </div>
  );
}
