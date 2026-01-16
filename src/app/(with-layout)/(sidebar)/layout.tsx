import { UserMenu } from '@/features/layoutComponents/SideBar';

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 1. h-screen : Force la hauteur à 100% de l'écran
    // 2. overflow-hidden : Empêche le scroll sur la fenêtre principale (c'est le main qui scrollera)
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* SIDEBAR : Fixe à gauche */}
      {/* h-full force la sidebar à prendre toute la hauteur du parent (h-screen) */}
      <aside className="w-64 flex-none border-r bg-background h-full hidden md:block">
        <UserMenu />
      </aside>

      {/* ZONE PRINCIPALE : C'est elle qui scrolle */}
      <main className="flex-1 overflow-y-auto">
        {/* Conteneur pour centrer ou marger le contenu */}
        <div className="min-h-full w-full p-6">{children}</div>
      </main>
    </div>
  );
}
