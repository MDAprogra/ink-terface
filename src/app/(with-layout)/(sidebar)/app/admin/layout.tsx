'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // On affiche le bouton retour seulement si on n'est PAS à la racine de l'admin
  const showBackButton = pathname !== '/app/admin';

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* En-tête avec Navigation conditionnelle */}
      <div className="space-y-4">
        {showBackButton && (
          <Button variant="ghost" size="sm" asChild className="-ml-3 text-muted-foreground hover:text-foreground">
            <Link href="/app/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Link>
          </Button>
        )}

        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
          <p className="text-muted-foreground">Gérez les utilisateurs, les rôles et les paramètres système.</p>
        </div>
      </div>

      {/* Contenu de la page */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
