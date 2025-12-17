export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //   const session = await auth.api.getSession({
  //     headers: await headers(),
  //   });
  //   if (session) {
  //     redirect('/app');
  //   }

  return children;
}
