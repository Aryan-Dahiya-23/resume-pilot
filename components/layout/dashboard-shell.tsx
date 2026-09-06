"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronRight,
  FileText,
  LayoutGrid,
  LogOut,
  Menu,
  Settings2,
  Sprout,
  Target,
} from "lucide-react";
import { useState } from "react";
import { Brand } from "@/components/ui/brand";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useCurrentDbUser, useDashboardOverview } from "@/hooks/queries";
import { getDashboardOverview } from "@/lib/api/dashboard";
import { listJobsQuery } from "@/lib/api/jobs";
import { listResumesQuery } from "@/lib/api/resumes";
import { getCurrentDbUserClient } from "@/lib/api/users";
import { queryKeys } from "@/lib/react-query/query-keys";
import { useToast } from "@/components/providers/toast-provider";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/resumes", label: "My resumes", icon: FileText },
  { href: "/dashboard/jobs", label: "Job tracker", icon: BriefcaseBusiness },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const { toast } = useToast();
  const { data: currentUser } = useCurrentDbUser();
  const { data: overview } = useDashboardOverview();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const displayName =
    currentUser?.name?.trim() || clerkUser?.firstName || "Your workspace";
  const weeklyDone = overview?.weeklyApplications ?? 0;
  const currentPage = pathname.startsWith("/dashboard/settings")
    ? "Settings"
    : (navigation.find(
        (item) => item.href !== "/dashboard" && pathname.startsWith(item.href),
      )?.label ?? "Overview");
  const isDetails = pathname.split("/").length > 3;
  function prefetch(href: string) {
    const options = { staleTime: 30_000 };
    if (href === "/dashboard")
      void queryClient.prefetchQuery({
        ...options,
        queryKey: queryKeys.dashboard.overview(),
        queryFn: getDashboardOverview,
      });
    if (href === "/dashboard/resumes")
      void queryClient.prefetchQuery({
        ...options,
        queryKey: queryKeys.resumes.listWithFilters({}),
        queryFn: () => listResumesQuery({}),
      });
    if (href === "/dashboard/jobs")
      void queryClient.prefetchQuery({
        ...options,
        queryKey: queryKeys.jobs.listWithFilters({}),
        queryFn: () => listJobsQuery({}),
      });
    if (href === "/dashboard/settings")
      void queryClient.prefetchQuery({
        ...options,
        queryKey: queryKeys.user.current(),
        queryFn: getCurrentDbUserClient,
      });
  }
  async function handleLogout() {
    setLoggingOut(true);
    try {
      await signOut({ redirectUrl: "/" });
    } catch {
      toast({
        tone: "error",
        message: "Could not sign out. Please try again.",
      });
    } finally {
      setLoggingOut(false);
      setLogoutOpen(false);
    }
  }
  const avatar = (
    <span className="avatar">
      {clerkUser?.hasImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={clerkUser.imageUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        displayName.slice(0, 1).toUpperCase()
      )}
    </span>
  );
  const sidebar = (
    <>
      <div onClick={() => setMobileOpen(false)}>
        <Brand
          light
          href="/dashboard"
          ariaLabel="Go to dashboard overview"
        />
      </div>
      <p className="sidebar-subtitle">A workspace for your next move.</p>
      <p className="sidebar-label">YOUR WORKSPACE</p>
      <nav aria-label="Workspace navigation">
        {navigation.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="sidebar-link"
              data-active={active}
              aria-current={active ? "page" : undefined}
              onMouseEnter={() => prefetch(item.href)}
              onFocus={() => prefetch(item.href)}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={17} strokeWidth={1.6} />
              {item.label}
              {active && <span className="nav-dot" />}
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-goal">
        <h2>
          <Target size={15} className="text-[#d5ed9a]" /> A little progress,
          every week.
        </h2>
        <p>
          {weeklyDone >= 10
            ? "You reached your weekly goal. Keep it going!"
            : "Every application is a step forward."}
        </p>
        <progress
          value={Math.min(weeklyDone, 10)}
          max={10}
          aria-label="Weekly application goal"
        />
        <div className="flex justify-between text-[10px] text-[#aabd99]">
          <span>{weeklyDone} of 10 applications</span>
          <span>{Math.min(Math.round((weeklyDone / 10) * 100), 100)}%</span>
        </div>
      </div>
      <Link
        href="/dashboard/settings"
        className="sidebar-link"
        data-active={pathname.startsWith("/dashboard/settings")}
        aria-current={
          pathname.startsWith("/dashboard/settings") ? "page" : undefined
        }
        onMouseEnter={() => prefetch("/dashboard/settings")}
        onFocus={() => prefetch("/dashboard/settings")}
        onClick={() => setMobileOpen(false)}
      >
        <Settings2 size={17} strokeWidth={1.6} />
        Settings
      </Link>
      <div className="sidebar-profile">
        {avatar}
        <Link
          href="/dashboard/settings"
          onClick={() => setMobileOpen(false)}
          className="min-w-0 flex-1"
        >
          <div className="truncate text-xs font-medium text-[#ebf1e4]">
            {displayName}
          </div>
          <div className="mt-1 text-[10px] text-[#8fa180]">
            Your personal workspace
          </div>
        </Link>
        <button
          type="button"
          aria-label="Sign out"
          title="Sign out"
          className="icon-button !text-[#a9bc9b]"
          onClick={() => {
            setMobileOpen(false);
            setLogoutOpen(true);
          }}
        >
          <LogOut size={15} />
        </button>
      </div>
    </>
  );
  return (
    <div className="workspace">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <aside className="workspace-sidebar">{sidebar}</aside>
      <div className="workspace-body">
        <header className="workspace-topbar">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="icon-button mobile-menu-button"
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="breadcrumb">
              <span className="hidden sm:inline">Workspace</span>
              <ChevronRight size={12} className="hidden sm:inline" />
              <strong>{currentPage}</strong>
              {isDetails && (
                <>
                  <ChevronRight size={12} />
                  <strong>Details</strong>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 text-[11px] text-zinc-500 sm:flex">
              <Sprout size={14} className="text-[#8ba66b]" /> One step closer.
            </span>
            <Link href="/dashboard/settings" aria-label="Open profile settings">
              {avatar}
            </Link>
          </div>
        </header>
        <main id="main-content" className="workspace-content">
          {children}
          <footer className="workspace-footer">
            <span>Small steps. A stronger story.</span>
            <span>
              Made for your next move{" "}
              <ArrowUpRight size={12} className="ml-1 inline" />
            </span>
          </footer>
        </main>
      </div>
      <Modal
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title="Workspace navigation"
        className="mobile-drawer"
      >
        {sidebar}
      </Modal>
      <Modal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        title="Ready to sign out?"
        description="Your resumes and applications will be here when you return."
        busy={loggingOut}
      >
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setLogoutOpen(false)}
            disabled={loggingOut}
          >
            Stay here
          </Button>
          <Button onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
