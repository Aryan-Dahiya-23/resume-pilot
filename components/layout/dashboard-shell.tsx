"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useClerk, useUser } from "@clerk/nextjs";
import { Briefcase, ChevronRight, FileText, LayoutDashboard, LogOut, Menu, Settings, TrendingUp } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { Button } from "@/components/ui/button";
import { useCurrentDbUser, useDashboardOverview } from "@/hooks/queries";
import { getDashboardOverview } from "@/lib/api/dashboard";
import { listJobsQuery } from "@/lib/api/jobs";
import { listResumesQuery } from "@/lib/api/resumes";
import { getCurrentDbUserClient } from "@/lib/api/users";
import { queryKeys } from "@/lib/react-query/query-keys";
import { useEffect, useRef, useState } from "react";

function SidebarItem({
  href,
  icon,
  label,
  active,
  pending,
  onHover,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  pending?: boolean;
  onHover?: () => void;
  onClick?: () => void;
}) {
  const isHighlighted = active || pending;

  return (
    <Link
      href={href}
      onMouseEnter={onHover}
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-all duration-200",
        isHighlighted ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100",
      )}
    >
      <span className="flex items-center gap-2">
        <span className="grid place-items-center">{icon}</span>
        <span className="font-medium">{label}</span>
      </span>
      <ChevronRight
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          isHighlighted ? "text-white/80" : "text-zinc-400",
        )}
      />
    </Link>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const { data: currentUser } = useCurrentDbUser();
  const { data: dashboardOverview } = useDashboardOverview();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const drawerTouchStartX = useRef<number | null>(null);
  const drawerTouchCurrentX = useRef<number | null>(null);
  const displayName = currentUser?.name?.trim() || currentUser?.email || "User";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const avatarImageUrl = clerkUser?.hasImage ? clerkUser.imageUrl : null;
  const weeklyGoal = 10;
  const weeklyDone = dashboardOverview?.weeklyApplications ?? 0;
  const weeklyProgress = Math.min(100, Math.max(0, Math.round((weeklyDone / weeklyGoal) * 100)));

  useEffect(() => {
    setIsMobileSidebarOpen(false);
    setPendingPath(null);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileSidebarOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isMobileSidebarOpen]);

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

  function handleNavigate(href: string) {
    setPendingPath(href);
    setIsMobileSidebarOpen(false);
  }

  function handleDrawerTouchStart(event: React.TouchEvent<HTMLElement>) {
    drawerTouchStartX.current = event.touches[0]?.clientX ?? null;
    drawerTouchCurrentX.current = drawerTouchStartX.current;
  }

  function handleDrawerTouchMove(event: React.TouchEvent<HTMLElement>) {
    drawerTouchCurrentX.current = event.touches[0]?.clientX ?? null;
  }

  function handleDrawerTouchEnd() {
    const startX = drawerTouchStartX.current;
    const endX = drawerTouchCurrentX.current;

    drawerTouchStartX.current = null;
    drawerTouchCurrentX.current = null;

    if (startX === null || endX === null) return;

    const deltaX = endX - startX;
    if (deltaX < -40) {
      setIsMobileSidebarOpen(false);
    }
  }

  function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <>
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div>
            <div className="text-sm text-zinc-500">Welcome back</div>
            <div className="text-lg font-semibold text-zinc-900">{displayName}</div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white">
            {avatarImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarImageUrl}
                alt={displayName}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <span className="text-sm font-semibold">{avatarInitial}</span>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <SidebarItem
            href="/dashboard"
            icon={<LayoutDashboard className="h-4 w-4" />}
            label="Dashboard"
            active={pathname === "/dashboard"}
            pending={pendingPath === "/dashboard"}
            onHover={prefetchDashboardOverview}
            onClick={() => {
              handleNavigate("/dashboard");
              onNavigate?.();
            }}
          />
          <SidebarItem
            href="/dashboard/resumes"
            icon={<FileText className="h-4 w-4" />}
            label="Resumes"
            active={pathname.startsWith("/dashboard/resumes")}
            pending={pendingPath === "/dashboard/resumes"}
            onHover={prefetchResumesList}
            onClick={() => {
              handleNavigate("/dashboard/resumes");
              onNavigate?.();
            }}
          />
          <SidebarItem
            href="/dashboard/jobs"
            icon={<Briefcase className="h-4 w-4" />}
            label="Jobs"
            active={pathname.startsWith("/dashboard/jobs")}
            pending={pendingPath === "/dashboard/jobs"}
            onHover={prefetchJobsList}
            onClick={() => {
              handleNavigate("/dashboard/jobs");
              onNavigate?.();
            }}
          />
          <SidebarItem
            href="/dashboard/settings"
            icon={<Settings className="h-4 w-4" />}
            label="Settings"
            active={pathname.startsWith("/dashboard/settings")}
            pending={pendingPath === "/dashboard/settings"}
            onHover={prefetchSettingsData}
            onClick={() => {
              handleNavigate("/dashboard/settings");
              onNavigate?.();
            }}
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
            onClick={() => {
              setIsLogoutModalOpen(true);
              onNavigate?.();
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm lg:hidden">
          <button
            type="button"
            className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-700 hover:bg-zinc-50"
            onClick={() => setIsMobileSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="text-sm font-semibold text-zinc-900">Resume Pilot</div>
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-900 text-white">
            <span className="text-xs font-semibold">{avatarInitial}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-3rem)] lg:overflow-y-auto">
            <SidebarContent />
          </aside>

          <main className="space-y-6">{children}</main>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-zinc-900/40 transition-opacity duration-200 lg:hidden",
          isMobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setIsMobileSidebarOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[86%] max-w-[320px] border-r border-zinc-200 bg-white p-4 shadow-xl transition-transform duration-200 lg:hidden",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
        onTouchStart={handleDrawerTouchStart}
        onTouchMove={handleDrawerTouchMove}
        onTouchEnd={handleDrawerTouchEnd}
      >
        <SidebarContent onNavigate={() => setIsMobileSidebarOpen(false)} />
      </aside>

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
