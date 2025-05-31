"use client";
import { useEffect } from "react";
import "./globals.css";
import { loadUser } from "../lib/store/auth";

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
      <body>{children}</body>
    </html>
  );
}
