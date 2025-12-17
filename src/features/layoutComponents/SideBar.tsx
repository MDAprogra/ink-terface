export const SideBar = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <h5>In Progress</h5>
      {children}
    </>
  );
};
