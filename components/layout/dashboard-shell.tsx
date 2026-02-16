"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useClerk } from "@clerk/nextjs";
import { Briefcase, FileText, LayoutDashboard, LogOut, Settings, TrendingUp } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/button";
import { useCurrentDbUser, useDashboardOverview } from "@/hooks/queries";
import { getDashboardOverview } from "@/lib/api/dashboard";
import { listJobsQuery } from "@/lib/api/jobs";
import { listResumesQuery } from "@/lib/api/resumes";
import { getCurrentDbUserClient } from "@/lib/api/users";
import { queryKeys } from "@/lib/react-query/query-keys";
import { useState } from "react";

function SidebarItem({
  href,
  icon,
  label,
  active,
  onHover,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onHover?: () => void;
}) {
  return (
    <Link
      href={href}
      onMouseEnter={onHover}
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
  const queryClient = useQueryClient();
  const { signOut } = useClerk();
  const { data: currentUser } = useCurrentDbUser();
  const { data: dashboardOverview } = useDashboardOverview();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const displayName = currentUser?.name?.trim() || currentUser?.email || "User";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const weeklyGoal = 10;
  const weeklyDone = dashboardOverview?.weeklyApplications ?? 0;
  const weeklyProgress = Math.min(100, Math.max(0, Math.round((weeklyDone / weeklyGoal) * 100)));

  function prefetchDashboardOverview() {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.dashboard.overview(),
      queryFn: getDashboardOverview,
      staleTime: 30 * 1000,
    });
  }

  function prefetchResumesList() {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.resumes.listWithFilters({}),
      queryFn: () => listResumesQuery({}),
      staleTime: 30 * 1000,
    });
  }

  function prefetchJobsList() {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.jobs.listWithFilters({}),
      queryFn: () => listJobsQuery({}),
      staleTime: 30 * 1000,
    });
  }

  function prefetchSettingsData() {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.user.current(),
      queryFn: getCurrentDbUserClient,
      staleTime: 30 * 1000,
    });
  }

  async function handleConfirmLogout() {
    setIsLoggingOut(true);
    try {
      await signOut({ redirectUrl: "/" });
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  }

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
                onHover={prefetchDashboardOverview}
              />
              <SidebarItem
                href="/dashboard/resumes"
                icon={<FileText className="h-4 w-4" />}
                label="Resumes"
                active={pathname.startsWith("/dashboard/resumes")}
                onHover={prefetchResumesList}
              />
              <SidebarItem
                href="/dashboard/jobs"
                icon={<Briefcase className="h-4 w-4" />}
                label="Jobs"
                active={pathname.startsWith("/dashboard/jobs")}
                onHover={prefetchJobsList}
              />
              <SidebarItem
                href="/dashboard/settings"
                icon={<Settings className="h-4 w-4" />}
                label="Settings"
                active={pathname.startsWith("/dashboard/settings")}
                onHover={prefetchSettingsData}
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
                <div
                  className="h-2 rounded-full bg-zinc-900 transition-[width] duration-300"
                  style={{ width: `${weeklyProgress}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                {weeklyDone} / {weeklyGoal} done
              </div>
            </div>

            <div className="mt-4">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setIsLogoutModalOpen(true)}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </aside>

          <main className="space-y-6">{children}</main>
        </div>
      </div>

      {isLogoutModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl">
            <div className="text-base font-semibold text-zinc-900">
              Logout now?
            </div>
            <div className="mt-2 text-sm text-zinc-600">
              You will be signed out from your account.
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                onClick={() => setIsLogoutModalOpen(false)}
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
