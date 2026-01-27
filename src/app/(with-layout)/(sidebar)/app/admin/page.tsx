import { Activity, ArrowRight, Settings, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma'; // Assure-toi que le chemin est bon

// 1. Fonction pour récupérer les stats rapidement (Server Side)
// async function getAdminStats() {
//   const [userCount, roleCount] = await Promise.all([prisma.user.count(), prisma.role.count()]);

//   return { userCount, roleCount };
// }

export default async function AdminPage() {
  // 2. On récupère les données
  //const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      {/* --- Section 1 : Les KPIs (Chiffres clés) --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{stats.userCount}</div> */}
            <p className="text-xs text-muted-foreground">Inscrits sur la plateforme</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rôles Définis</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{stats.roleCount}</div> */}
            <p className="text-xs text-muted-foreground">Niveaux d'accès configurés</p>
          </CardContent>
        </Card>

        {/* Exemples de placeholders pour le futur */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">État Système</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Opérationnel</div>
            <p className="text-xs text-muted-foreground">Aucune erreur détectée</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Section 2 : Navigation Rapide (Tes liens améliorés) --- */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Gestion</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Carte Utilisateurs */}
          <Link href="/app/admin/users" className="block group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Utilisateurs
                </CardTitle>
                <CardDescription>Gérez les comptes, les accès et les informations personnelles.</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary flex items-center group-hover:underline">
                  Accéder à la liste{' '}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </CardContent>
            </Card>
          </Link>

          {/* Carte Rôles */}
          <Link href="/app/admin/roles" className="block group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-purple-500" />
                  Rôles & Permissions
                </CardTitle>
                <CardDescription>Définissez qui a le droit de voir ou modifier quoi.</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary flex items-center group-hover:underline">
                  Configurer les rôles{' '}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/app/admin/organization" className="block group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-purple-500" />
                  Organisation
                </CardTitle>
                <CardDescription>Créer et Changer d'organisation</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary flex items-center group-hover:underline">
                  Configurer les organisations{' '}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </CardContent>
            </Card>
          </Link>

          {/* Carte Paramètres (Future) */}
          <Link href="/app/settings" className="block group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-500" />
                  Configuration
                </CardTitle>
                <CardDescription>Paramètres globaux de l'application.</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary flex items-center group-hover:underline">
                  Configurer les paramètres{' '}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
