import { UserMenu } from '@/features/layoutComponents/SideBar';

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full">
      <aside className="w-64 border-r">
        <UserMenu />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
