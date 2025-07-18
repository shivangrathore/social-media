export default function MainContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="ml-auto w-[calc(100%-var(--nav-width))] flex flex-col">
      <div className="mx-auto gap-y-4">{children}</div>
    </div>
  );
}
