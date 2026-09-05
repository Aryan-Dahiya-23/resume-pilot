import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ensureCurrentDbUser } from "@/lib/db/users";

export const metadata: Metadata = {
  title: "Your workspace",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await ensureCurrentDbUser();

  return <DashboardShell>{children}</DashboardShell>;
}
