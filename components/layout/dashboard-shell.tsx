"use client";

import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Target,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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

const navigation: Array<{
  href: string;
  label: string;
  icon: LucideIcon;
}> = [
  {
    href: "/dashboard",
    label: "Today",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/resumes",
    label: "Resumes",
    icon: FileText,
  },
  {
    href: "/dashboard/jobs",
    label: "Job pipeline",
    icon: BriefcaseBusiness,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
];

function isRouteActive(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === href
    : pathname.startsWith(href);
}

function SidebarContent({
  pathname,
  displayName,
  avatarImageUrl,
  avatarInitial,
  weeklyDone,
  weeklyGoal,
  weeklyProgress,
  onNavigate,
  onPrefetch,
  onLogout,
}: {
  pathname: string;
  displayName: string;
  avatarImageUrl: string | null;
  avatarInitial: string;
  weeklyDone: number;
  weeklyGoal: number;
  weeklyProgress: number;
  onNavigate?: () => void;
  onPrefetch: (href: string) => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Link
        href="/dashboard"
        className="block px-2"
        onClick={onNavigate}
      >
        <span className="flex items-end gap-1">
          <span className="font-heading text-[27px] leading-none font-semibold tracking-[-0.035em] text-sidebar-foreground">
            ResumePilot
          </span>
          <span className="mb-0.5 size-1.5 rounded-full bg-brand" />
        </span>
        <span className="mt-1.5 block text-[10px] font-semibold tracking-[0.12em] text-sidebar-foreground/45 uppercase">
          Career workspace
        </span>
      </Link>

      <div className="mt-8 px-2 text-[11px] font-semibold tracking-[0.12em] text-sidebar-foreground/40 uppercase">
        Workspace
      </div>
      <nav className="mt-2 space-y-1" aria-label="Dashboard navigation">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isRouteActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onMouseEnter={() => onPrefetch(item.href)}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 border-l-2 px-3 py-2.5 transition-colors",
                active
                  ? "border-brand bg-sidebar-accent/55 text-sidebar-accent-foreground"
                  : "border-transparent text-sidebar-foreground/58 hover:bg-sidebar-accent/45 hover:text-sidebar-foreground",
              )}
            >
              <span
                className={cn(
                  "grid size-7 place-items-center transition-colors",
                  active
                    ? "text-sidebar-foreground"
                    : "text-sidebar-foreground/44 group-hover:text-sidebar-foreground",
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 text-sm font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-8">
        <div className="border-t border-sidebar-border pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-sidebar-foreground">
              <Target className="size-4 text-brand" />
              Weekly goal
            </div>
            <span className="text-xs font-semibold text-sidebar-foreground">
              {weeklyDone}/{weeklyGoal}
            </span>
          </div>
          <Progress
            value={weeklyProgress}
            className="mt-3 h-1 bg-sidebar-border [&_[data-slot=progress-indicator]]:bg-brand"
          />
          <p className="mt-2 text-[11px] leading-4 text-sidebar-foreground/48">
            {weeklyDone >= weeklyGoal
              ? "Goal complete. Keep the momentum."
              : `${weeklyGoal - weeklyDone} applications to hit your target.`}
          </p>
        </div>

        <Separator className="bg-sidebar-border" />

        <div className="flex items-center gap-3 px-1">
          <Avatar size="lg" className="ring-1 ring-sidebar-border">
            {avatarImageUrl ? (
              <AvatarImage src={avatarImageUrl} alt={displayName} />
            ) : null}
            <AvatarFallback className="bg-sidebar-accent text-sm font-bold text-sidebar-accent-foreground">
              {avatarInitial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-sidebar-foreground">
              {displayName}
            </div>
            <div className="text-xs text-sidebar-foreground/45">
              Focused job search
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-sidebar-foreground/45 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={onLogout}
            aria-label="Log out"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </div>
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

  const displayName = currentUser?.name?.trim() || currentUser?.email || "User";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const avatarImageUrl = clerkUser?.hasImage ? clerkUser.imageUrl : null;
  const weeklyGoal = 10;
  const weeklyDone = dashboardOverview?.weeklyApplications ?? 0;
  const weeklyProgress = Math.min(
    100,
    Math.max(0, Math.round((weeklyDone / weeklyGoal) * 100)),
  );

  function prefetchRoute(href: string) {
    if (href === "/dashboard") {
      void queryClient.prefetchQuery({
        queryKey: queryKeys.dashboard.overview(),
        queryFn: getDashboardOverview,
        staleTime: 30 * 1000,
      });
      return;
    }

    if (href === "/dashboard/resumes") {
      void queryClient.prefetchQuery({
        queryKey: queryKeys.resumes.listWithFilters({}),
        queryFn: () => listResumesQuery({}),
        staleTime: 30 * 1000,
      });
      return;
    }

    if (href === "/dashboard/jobs") {
      void queryClient.prefetchQuery({
        queryKey: queryKeys.jobs.listWithFilters({}),
        queryFn: () => listJobsQuery({}),
        staleTime: 30 * 1000,
      });
      return;
    }

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

  const sidebarProps = {
    pathname,
    displayName,
    avatarImageUrl,
    avatarInitial,
    weeklyDone,
    weeklyGoal,
    weeklyProgress,
    onPrefetch: prefetchRoute,
    onLogout: () => setIsLogoutModalOpen(true),
  };

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[236px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen border-r border-sidebar-border bg-sidebar px-4 py-7 lg:block">
        <SidebarContent {...sidebarProps} />
      </aside>

      <div className="dashboard-grid min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/70 bg-background/88 px-4 backdrop-blur-xl lg:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </Button>
          <Link href="/dashboard" className="flex items-end gap-1">
            <span className="font-heading text-xl leading-none font-semibold tracking-[-0.03em]">
              ResumePilot
            </span>
            <span className="mb-0.5 size-1 rounded-full bg-brand" />
          </Link>
          <Avatar>
            {avatarImageUrl ? (
              <AvatarImage src={avatarImageUrl} alt={displayName} />
            ) : null}
            <AvatarFallback className="bg-accent font-bold text-accent-foreground">
              {avatarInitial}
            </AvatarFallback>
          </Avatar>
        </header>

        <main className="mx-auto w-full max-w-[1480px] p-4 sm:p-6 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>

      <Sheet
        open={isMobileSidebarOpen}
        onOpenChange={setIsMobileSidebarOpen}
      >
        <SheetContent
          side="left"
          className="w-[88%] max-w-[320px] border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>ResumePilot navigation</SheetTitle>
            <SheetDescription>
              Navigate your resume and job search workspace.
            </SheetDescription>
          </SheetHeader>
          <div className="h-full px-4 py-6">
            <SidebarContent
              {...sidebarProps}
              onNavigate={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Dialog
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log out of ResumePilot?</DialogTitle>
            <DialogDescription>
              You can sign back in at any time. Your resumes and job pipeline
              will remain saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" disabled={isLoggingOut}>
                Stay signed in
              </Button>
            </DialogClose>
            <Button
              variant="danger"
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
