"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { Briefcase, FileText, LayoutDashboard, LogOut, Settings, TrendingUp } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/button";
import { useCurrentDbUser } from "@/hooks/queries";

function SidebarItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
        active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100",
      )}
    >
      <span className="grid place-items-center">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: currentUser } = useCurrentDbUser();
  const displayName = currentUser?.name?.trim() || currentUser?.email || "User";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-500">Welcome back</div>
                <div className="text-lg font-semibold text-zinc-900">{displayName}</div>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white">
                <span className="text-sm font-semibold">{avatarInitial}</span>
              </div>
            </div>

            <div className="mt-6 space-y-1">
              <SidebarItem
                href="/dashboard"
                icon={<LayoutDashboard className="h-4 w-4" />}
                label="Dashboard"
                active={pathname === "/dashboard"}
              />
              <SidebarItem
                href="/dashboard/resumes"
                icon={<FileText className="h-4 w-4" />}
                label="Resumes"
                active={pathname.startsWith("/dashboard/resumes")}
              />
              <SidebarItem
                href="/dashboard/jobs"
                icon={<Briefcase className="h-4 w-4" />}
                label="Jobs"
                active={pathname.startsWith("/dashboard/jobs")}
              />
              <SidebarItem
                href="/dashboard/settings"
                icon={<Settings className="h-4 w-4" />}
                label="Settings"
                active={pathname.startsWith("/dashboard/settings")}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                <TrendingUp className="h-4 w-4" />
                Weekly goal
              </div>
              <div className="mt-2 text-sm text-zinc-600">
                Apply to <span className="font-medium">10 jobs</span> this week.
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-zinc-200">
                <div className="h-2 w-2/3 rounded-full bg-zinc-900" />
              </div>
              <div className="mt-2 text-xs text-zinc-500">6 / 10 done</div>
            </div>

            <div className="mt-4">
              <SignOutButton redirectUrl="/">
                <Button variant="secondary" className="w-full">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </SignOutButton>
            </div>
          </aside>

          <main className="space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
