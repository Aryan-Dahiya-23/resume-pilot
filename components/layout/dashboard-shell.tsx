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
import { useState } from "react";

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
          ? "bg-emerald-50 text-emerald-800 shadow-2xs border border-emerald-100/90 font-semibold"
          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
      )}
    >
      <span className="flex items-center gap-3">
        <Icon
          className={cn(
            "size-4.5 transition-colors",
            active ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600",
          )}
        />
        <span>{label}</span>
      </span>
      {active ? (
        <span className="size-1.5 rounded-full bg-emerald-600" />
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

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileOpen(false);
  }

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

  const navLinks = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
      onHover: prefetchDashboard,
    },
    {
      href: "/dashboard/resumes",
      label: "Resume Audits",
      icon: FileText,
      active: pathname.startsWith("/dashboard/resumes"),
      onHover: prefetchResumes,
    },
    {
      href: "/dashboard/jobs",
      label: "Job Pipeline",
      icon: Briefcase,
      active: pathname.startsWith("/dashboard/jobs"),
      onHover: prefetchJobs,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/dashboard/settings",
      onHover: prefetchSettings,
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 sm:p-5">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs shadow-emerald-600/20">
              <Compass className="size-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900">
                ResumePilot
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                Intelligence v2.0
              </span>
            </div>
          </Link>
        </div>

        {/* Status Chip */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-900">
              AI Engine Active
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-white/80 rounded px-1.5 py-0.5 border border-emerald-200/50">
            v2.0
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navLinks.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              onClick={() => setIsMobileOpen(false)}
            />
          ))}
        </nav>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        {/* Weekly Velocity Metric */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-emerald-600" />
              Weekly Velocity
            </span>
            <span className="font-bold text-emerald-700">
              {weeklyDone}/{weeklyGoal}
            </span>
          </div>
          <div className="mt-2">
            <Progress value={weeklyProgress} className="h-1.5" />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            {weeklyGoal - weeklyDone > 0
              ? `${weeklyGoal - weeklyDone} more to target`
              : "Goal reached! Excellent momentum"}
          </p>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-2.5">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <Avatar className="size-8 rounded-xl border border-emerald-200">
              {avatarImageUrl ? (
                <AvatarImage src={avatarImageUrl} alt={displayName} />
              ) : null}
              <AvatarFallback className="bg-emerald-100 text-emerald-800 text-xs font-bold">
                {avatarInitial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-xs font-bold text-slate-900">
                {displayName}
              </div>
              <div className="truncate text-[10px] text-slate-400">
                Pro Candidate
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setIsLogoutModalOpen(true)}
            title="Sign out"
            className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/70 ambient-glow flex flex-col">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-2xs">
            <Compass className="size-4" />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">
            ResumePilot
          </span>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label="Toggle mobile navigation menu"
          className="h-9 w-9 p-0"
        >
          {isMobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </header>

      {/* Mobile Drawer Backdrop & Menu */}
      {isMobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-[280px] bg-white shadow-2xl transition-transform duration-200 ease-out">
            {sidebarContent}
          </div>
        </div>
      ) : null}

      {/* Desktop Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200/80 bg-white/90 backdrop-blur-md lg:flex lg:flex-col xl:w-72">
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 xl:pl-72 transition-all duration-200">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 space-y-6">
          {children}
        </div>
      </main>

      {/* Sign Out Confirmation Modal */}
      <ConfirmModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        title="Sign Out of ResumePilot?"
        description="You will need to sign in again to access your resumes and pipeline."
        confirmText="Sign Out"
        isLoading={isLoggingOut}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
