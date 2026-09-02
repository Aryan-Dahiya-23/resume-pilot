"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BrandLockup } from "@/components/brand/logo";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCurrentDbUser, useDashboardOverview } from "@/hooks/queries";
import { getDashboardOverview } from "@/lib/api/dashboard";
import { listJobsQuery } from "@/lib/api/jobs";
import { listResumesQuery } from "@/lib/api/resumes";
import { getCurrentDbUserClient } from "@/lib/api/users";
import { queryKeys } from "@/lib/react-query/query-keys";

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
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isHighlighted
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-muted",
      )}
    >
      <span className="grid place-items-center">{icon}</span>
      <span>{label}</span>
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

  const sidebar = (onNavigate?: () => void) => (
      <>
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="min-w-0">
            <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Welcome back
            </div>
            <div className="truncate font-heading text-xl text-foreground">{displayName}</div>
          </div>
          <Avatar size="lg">
            {avatarImageUrl ? <AvatarImage src={avatarImageUrl} alt={displayName} /> : null}
            <AvatarFallback className="bg-primary text-primary-foreground">
              {avatarInitial}
            </AvatarFallback>
          </Avatar>
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

        <div className="mt-6 rounded-lg bg-muted/70 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            Weekly goal
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Apply to <span className="font-medium text-foreground">10 jobs</span> this week.
          </div>
          <Progress value={weeklyProgress} className="mt-3 h-1.5" />
          <div className="mt-2 text-xs text-muted-foreground">
            {weeklyDone} / {weeklyGoal} done
          </div>
        </div>

        <div className="mt-4">
          <Button
            variant="outline"
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

  return (
    <div className="paper-canvas min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <BrandLockup href="/dashboard" subtitle={null} />
          <Avatar>
            {avatarImageUrl ? <AvatarImage src={avatarImageUrl} alt={displayName} /> : null}
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
              {avatarInitial}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="hidden rounded-xl bg-card p-4 ring-1 ring-foreground/10 lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-3rem)] lg:overflow-y-auto">
            <div className="mb-4 hidden lg:block">
              <BrandLockup href="/dashboard" subtitle={null} />
            </div>
            {sidebar()}
          </aside>

          <main className="space-y-6">{children}</main>
        </div>
      </div>

      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="w-[86%] max-w-[320px] p-4">
          <SheetHeader className="p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Dashboard sections and account actions
            </SheetDescription>
            <BrandLockup href="/dashboard" subtitle={null} />
          </SheetHeader>
          {sidebar(() => setIsMobileSidebarOpen(false))}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        title="Logout now?"
        description="You will be signed out from your account."
        confirmLabel={isLoggingOut ? "Logging out..." : "Confirm"}
        onConfirm={handleConfirmLogout}
        isConfirming={isLoggingOut}
      />
    </div>
  );
}
