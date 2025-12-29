"use client";

import { SessionProvider } from "next-auth/react";
import DashboardLayout from "./DashboardLayout";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </SessionProvider>
  );
}
