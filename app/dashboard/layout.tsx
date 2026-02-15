import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ensureCurrentDbUser } from "@/lib/db/users";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await ensureCurrentDbUser();

  return <DashboardShell>{children}</DashboardShell>;
}
