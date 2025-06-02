import { Sidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 flex">
      <Sidebar />
      <div className="ml-auto w-[calc(100%-var(--nav-width))] flex flex-col">
        <div className="bg-orange-500 mx-auto gap-y-4">{children}</div>
      </div>
    </div>
  );
}
