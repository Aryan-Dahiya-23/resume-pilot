import { DashboardShell } from "@/components/layout/dashboard-shell";
import { syncCurrentUserToDatabase } from "@/lib/db/users";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await syncCurrentUserToDatabase();

  return <DashboardShell>{children}</DashboardShell>;
}
