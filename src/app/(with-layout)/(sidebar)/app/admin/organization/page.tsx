'use client';

import { CircleCheckBig } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

export default function CreateOrgPage() {
  const { data: orgs, isPending } = authClient.useListOrganizations();
  const { data: activeOrg } = authClient.useActiveOrganization();

  const [name, setName] = useState('');

  const createOrg = async () => {
    await authClient.organization.create(
      {
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
      },
      {
        onSuccess: () => {
          toast('Organisation créée !');
          window.location.href = '/app/admin/organization';
        },
        onError: (ctx) => {
          toast(ctx.error.message);
        },
      },
    );
  };

  if (isPending) return <div>Chargement de vos équipes...</div>;

  return (
    <div className="flex-col flex">
      <div className="flex ml-auto items-center">
        <input
          className="border p-2 rounded-xl mr-2"
          placeholder="Nouvelle organisation ..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={createOrg}>
          <CircleCheckBig />{' '}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orgs?.map((org) => {
          const isActive = activeOrg?.id === org.id;

          return (
            <Card
              key={org.id}
              className={cn(
                'transition-all duration-200 hover:shadow-md',
                isActive
                  ? 'border-primary border-2 bg-primary/5 shadow-sm' // Style pour l'actif (bordure + fond léger)
                  : 'hover:border-primary/50', // Style au survol pour les inactifs
              )}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold">{org.name}</CardTitle>
                  <CardDescription className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md w-fit">
                    {org.slug}
                  </CardDescription>
                </div>
                {isActive && (
                  <Badge variant="default" className="ml-2 pointer-events-none">
                    Active
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="pt-4">
                <div className="flex gap-2">
                  <Button
                    variant={isActive ? 'secondary' : 'default'} // Inverse les couleurs pour attirer l'attention sur l'action principale
                    size="sm"
                    className="w-full"
                    onClick={async () => {
                      await authClient.organization.setActive({ organizationId: org.id });
                      window.location.reload();
                    }}
                    disabled={isActive}
                  >
                    {isActive ? 'Sélectionné' : 'Basculer'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* État vide stylisé */}
        {orgs?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted"></div>
            <h3 className="mt-4 text-lg font-semibold">Aucune organisation</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Vous ne faites partie d'aucune équipe pour le moment.
            </p>
            {/* Tu pourrais ajouter un bouton "Créer" ici */}
          </div>
        )}
      </div>
    </div>
  );
}
