import { ArrowRight, Settings, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Carte Utilisateurs */}
          <Link href="/app/admin/users" className="block group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Utilisateurs
                </CardTitle>
                <CardDescription>
                  Gérez les comptes, les accès et les informations personnelles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary flex items-center group-hover:underline">
                  Accéder à la liste{' '}
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
