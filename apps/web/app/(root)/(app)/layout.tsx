import AppSidebar from "@/components/app-sidebar";
import MainContainer from "@/components/main-container";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-neutral-950 flex min-h-screen">
      <AppSidebar />
      <MainContainer>
        <div className="mx-auto gap-y-4">{children}</div>
      </MainContainer>
    </div>
  );
}
