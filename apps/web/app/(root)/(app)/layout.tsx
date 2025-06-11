import AppSidebar from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 flex min-h-screen">
      <AppSidebar />
      <div className="ml-auto w-[calc(100%-var(--nav-width))] flex flex-col">
        <div className="mx-auto gap-y-4">{children}</div>
      </div>
    </div>
  );
}
