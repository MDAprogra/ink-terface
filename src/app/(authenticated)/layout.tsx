import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { UserMenu } from '@/features/layoutComponents/SideBar';
import { auth } from '@/lib/auth';

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div className="flex h-screen w-full">
      {/* On peut passer la session au Sidebar si besoin, ou laisser le Sidebar la récupérer */}
      <aside className="w-64 border-r">
        <UserMenu />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
