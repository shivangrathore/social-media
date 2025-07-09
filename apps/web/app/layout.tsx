"use client";
import { useEffect } from "react";
import "./globals.css";
import { loadUser } from "@/store/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({});

export default function RootLayout({
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
