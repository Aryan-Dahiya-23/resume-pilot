"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  Briefcase,
  Compass,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useCurrentDbUser, useDashboardOverview } from "@/hooks/queries";
import { getDashboardOverview } from "@/lib/api/dashboard";
import { listJobsQuery } from "@/lib/api/jobs";
import { listResumesQuery } from "@/lib/api/resumes";
import { getCurrentDbUserClient } from "@/lib/api/users";
import { queryKeys } from "@/lib/react-query/query-keys";
import { useEffect, useState } from "react";

interface NavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onHover?: () => void;
  onClick?: () => void;
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  onHover,
  onClick,
}: NavItemProps) {
  return (
    <Link
      href={href}
      onMouseEnter={onHover}
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 select-none",
        active
          ? "bg-indigo-50 text-indigo-700 shadow-2xs border border-indigo-100/80 font-semibold"
          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
      )}
    >
      <span className="flex items-center gap-3">
        <Icon
          className={cn(
            "size-4.5 transition-colors",
            active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600",
          )}
        />
        <span>{label}</span>
      </span>
      {active ? (
        <span className="size-1.5 rounded-full bg-indigo-600" />
      ) : null}
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const displayName = currentUser?.name?.trim() || currentUser?.email || "User";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const avatarImageUrl = clerkUser?.hasImage ? clerkUser.imageUrl : null;
  const weeklyGoal = 10;
  const weeklyDone = dashboardOverview?.weeklyApplications ?? 0;
  const weeklyProgress = Math.min(100, Math.max(0, Math.round((weeklyDone / weeklyGoal) * 100)));

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  function prefetchDashboard() {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.dashboard.overview(),
      queryFn: getDashboardOverview,
      staleTime: 30 * 1000,
    });
  }

  function prefetchResumes() {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.resumes.listWithFilters({}),
      queryFn: () => listResumesQuery({}),
      staleTime: 30 * 1000,
    });
  }

  function prefetchJobs() {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.jobs.listWithFilters({}),
      queryFn: () => listJobsQuery({}),
      staleTime: 30 * 1000,
    });
  }

  function prefetchSettings() {
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

  const sidebarNavContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pb-6 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs shadow-indigo-500/20">
              <Compass className="size-5" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                ResumePilot
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                AI Engine Active
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="mt-6 space-y-1">
          <NavItem
            href="/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            active={pathname === "/dashboard"}
            onHover={prefetchDashboard}
            onClick={() => setIsMobileOpen(false)}
          />
          <NavItem
            href="/dashboard/resumes"
            icon={FileText}
            label="Resumes & Audits"
            active={pathname.startsWith("/dashboard/resumes")}
            onHover={prefetchResumes}
            onClick={() => setIsMobileOpen(false)}
          />
          <NavItem
            href="/dashboard/jobs"
            icon={Briefcase}
            label="Job Pipeline"
            active={pathname.startsWith("/dashboard/jobs")}
            onHover={prefetchJobs}
            onClick={() => setIsMobileOpen(false)}
          />
          <NavItem
            href="/dashboard/settings"
            icon={Settings}
            label="Settings"
            active={pathname.startsWith("/dashboard/settings")}
            onHover={prefetchSettings}
            onClick={() => setIsMobileOpen(false)}
          />
        </div>

        {/* Weekly Velocity Widget */}
        <div className="mt-8 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
              <TrendingUp className="size-3.5 text-indigo-600" />
              Weekly Velocity
            </div>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              {weeklyProgress}%
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Target: Apply to <span className="font-medium text-slate-700">{weeklyGoal} jobs</span> this week.
          </div>
          <Progress value={weeklyProgress} className="mt-3 h-1.5" />
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>{weeklyDone} applications sent</span>
            <span>Goal: {weeklyGoal}</span>
          </div>
        </div>
      </div>

      {/* User Info & Sign out */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar size="sm">
              {avatarImageUrl ? (
                <AvatarImage src={avatarImageUrl} alt={displayName} />
              ) : null}
              <AvatarFallback>{avatarInitial}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-slate-900">
                {displayName}
              </div>
              <div className="truncate text-[11px] text-slate-400">
                {currentUser?.email}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setIsLogoutModalOpen(true)}
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            title="Log out"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/70 ambient-glow">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* Mobile Header */}
        <header className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white/90 p-3 shadow-xs backdrop-blur-md lg:hidden">
          <button
            type="button"
            className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-4.5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <Compass className="size-4" />
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">ResumePilot</span>
          </div>
          <Avatar size="sm">
            {avatarImageUrl ? (
              <AvatarImage src={avatarImageUrl} alt={displayName} />
            ) : null}
            <AvatarFallback>{avatarInitial}</AvatarFallback>
          </Avatar>
        </header>

        {/* Grid Layout: Desktop Sidebar + Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-3rem)]">
            {sidebarNavContent}
          </aside>

          <main className="min-w-0 space-y-6">{children}</main>
        </div>
      </div>

      {/* Mobile Backdrop & Drawer */}
      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[84%] max-w-[320px] bg-white p-6 shadow-2xl border-r border-slate-200">
            <button
              type="button"
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
            {sidebarNavContent}
          </aside>
        </div>
      ) : null}

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        title="Sign Out"
        description="Are you sure you want to sign out of your ResumePilot session?"
        confirmText="Sign Out"
        cancelText="Stay Signed In"
        isLoading={isLoggingOut}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
