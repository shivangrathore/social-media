"use client";
import { loadUser } from "@/store/auth";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({});
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    loadUser();
  }, []);
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <body className="dark">{children}</body>
      </QueryClientProvider>
    </html>
  );
}
