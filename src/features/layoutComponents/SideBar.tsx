'use client';

import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export function UserMenu() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) return <div>Chargement...</div>;
  if (!session) return null;

  return (
    <div className="flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={session.user.image || ''} />
          <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <span>{session.user.name}</span>
      </div>

      <Button
        variant="destructive"
        onClick={async () => {
          await authClient.signOut();
          router.push('/sign-in');
        }}
      >
        Déconnexion
      </Button>
    </div>
  );
}
