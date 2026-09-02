"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Globe,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { statusVariant, type Job, type JobStatus } from "@/lib/mock-data";

export function JobsHeader({ onAddJobClick }: { onAddJobClick?: () => void }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Opportunity Tracking
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Job Application Pipeline
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Track stage transitions, schedule follow-ups, and calculate your interview conversion rate.
        </p>
      </div>

      <Button onClick={onAddJobClick} className="shadow-xs shadow-emerald-600/20 w-full sm:w-auto">
        <Plus className="size-4" />
        Track New Opportunity
      </Button>
    </div>
  );
}

export function AddJobModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  mode = "create",
  initialValues,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: {
    company: string;
    role: string;
    status: JobStatus;
    contactName: string;
    contactEmail: string;
    interviewRounds: Array<{ name: string; status: "Done" | "Upcoming" | "Pending" }>;
    location: string;
    link: string;
  }) => Promise<void>;
  isSubmitting: boolean;
  mode?: "create" | "edit";
  initialValues?: {
    company?: string;
    role?: string;
    status?: JobStatus;
    contactName?: string;
    contactEmail?: string;
    interviewRounds?: Array<{ name: string; status: "Done" | "Upcoming" | "Pending" }>;
    location?: string;
    link?: string;
  };
}) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<JobStatus>("Saved");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [roundsText, setRoundsText] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setCompany(initialValues?.company ?? "");
      setRole(initialValues?.role ?? "");
      setStatus(initialValues?.status ?? "Saved");
      setContactName(initialValues?.contactName ?? "");
      setContactEmail(initialValues?.contactEmail ?? "");
      setRoundsText(
        (initialValues?.interviewRounds ?? [])
          .map((round) => `${round.name} | ${round.status}`)
          .join("\n"),
      );
      setLocation(initialValues?.location ?? "");
      setLink(initialValues?.link ?? "");
      setError(null);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!company.trim() || !role.trim()) {
      setError("Company name and target role are required.");
      return;
    }

    const interviewRounds = roundsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [nameRaw, statusRaw] = line.split("|").map((part) => part.trim());
        const statusValue: "Done" | "Upcoming" | "Pending" =
          statusRaw === "Done" || statusRaw === "Upcoming" || statusRaw === "Pending"
            ? statusRaw
            : "Pending";
        return {
          name: nameRaw,
          status: statusValue,
        };
      })
      .filter((round) => round.name);

    setError(null);
    await onSubmit({
      company: company.trim(),
      role: role.trim(),
      status,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      interviewRounds,
      location: location.trim(),
      link: link.trim(),
    });
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Job Opportunity" : "Edit Job Details"}
          </DialogTitle>
          <DialogDescription>
            Keep your recruitment pipeline organized with real-time status updates.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Company Name *
              </label>
              <div className="relative mt-1">
                <Building2 className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Job Title *
              </label>
              <div className="relative mt-1">
                <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Current Pipeline Stage
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="mt-1 h-10 w-full rounded-xl border border-slate-200/90 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="Saved">Saved (Considering)</option>
                <option value="Applied">Applied (Pending)</option>
                <option value="Interview">Interview (Active)</option>
                <option value="Offer">Offer (Received)</option>
                <option value="Rejected">Rejected (Archived)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Location / Remote
              </label>
              <div className="relative mt-1">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Remote / San Francisco, CA"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Job Post / Application URL
            </label>
            <div className="relative mt-1">
              <Globe className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://jobs.lever.co/..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Recruiter / Contact Name
              </label>
              <div className="relative mt-1">
                <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Jane Smith"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Recruiter Contact Email
              </label>
              <Input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="recruiter@company.com"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Interview Rounds (Optional • One per line: Name | Status)
            </label>
            <Textarea
              value={roundsText}
              onChange={(e) => setRoundsText(e.target.value)}
              placeholder={"Recruiter Screen | Done\nTechnical Round | Upcoming\nFinal Leadership | Pending"}
              className="mt-1 font-mono text-xs"
              rows={3}
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto shadow-xs shadow-emerald-600/20">
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Track Opportunity"
                  : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function JobsTableSection({
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  rows,
  currentPage,
  totalPages,
  onPageChange,
  isLoadingRows,
  onHoverJob,
  onEditJob,
  onRequestDeleteJob,
  deletingJobId,
  updatingJobId,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: "All" | JobStatus;
  onStatusFilterChange: (value: "All" | JobStatus) => void;
  dateFilter: "All" | "today" | "7d" | "30d";
  onDateFilterChange: (value: "All" | "today" | "7d" | "30d") => void;
  rows: Array<Job & { location?: string | null }>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoadingRows?: boolean;
  onHoverJob?: (jobId: string) => void;
  onEditJob?: (jobId: string) => void;
  onRequestDeleteJob?: (jobId: string) => void;
  deletingJobId?: string | null;
  updatingJobId?: string | null;
}) {
  const statusOptions: Array<"All" | JobStatus> = [
    "All",
    "Saved",
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
  ];

  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search company, title, or location..."
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-50/60 p-1 overflow-x-auto max-w-full no-scrollbar">
            {statusOptions.map((st) => (
              <button
                key={st}
                onClick={() => onStatusFilterChange(st)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-white text-emerald-950 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <select
            value={dateFilter}
            onChange={(e) =>
              onDateFilterChange(e.target.value as "All" | "today" | "7d" | "30d")
            }
            className="h-9 rounded-xl border border-slate-200/90 bg-white px-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="All">All Time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Table Content with Horizontal Scroll Support */}
      <div className="mt-6 overflow-x-auto no-scrollbar">
        <div className="min-w-[650px]">
          {/* Table Header */}
          <div className="grid grid-cols-[1.5fr_1.5fr_130px_120px_100px] border-b border-slate-100 bg-slate-50/60 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 rounded-xl">
            <div>Company</div>
            <div>Position</div>
            <div>Stage</div>
            <div>Tracked</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100 mt-1">
            {isLoadingRows ? (
              <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin text-emerald-600" />
                <span>Refreshing jobs...</span>
              </div>
            ) : null}

            {rows.map((job) => {
              const companyInitial = job.company.charAt(0).toUpperCase();

              return (
                <div
                  key={job.id}
                  className="grid grid-cols-[1.5fr_1.5fr_130px_120px_100px] items-center px-4 py-3.5 transition-colors hover:bg-slate-50/70 rounded-xl"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 font-bold text-xs text-emerald-800">
                      {companyInitial}
                    </div>
                    <span className="truncate text-sm font-semibold text-slate-900">
                      {job.company}
                    </span>
                  </div>

                  <div className="min-w-0 pr-3">
                    <div className="truncate text-xs font-medium text-slate-800">
                      {job.role}
                    </div>
                    {job.location ? (
                      <div className="truncate text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="size-3 text-slate-300" />
                        {job.location}
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <Badge variant={statusVariant(job.status)} withDot>
                      {job.status}
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-400">
                    {job.when}
                  </div>

                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon-xs" asChild>
                      <Link
                        href={`/dashboard/jobs/${job.id}`}
                        onMouseEnter={() => onHoverJob?.(job.id)}
                        title="View details"
                      >
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onEditJob?.(job.id)}
                      disabled={updatingJobId === job.id || deletingJobId === job.id}
                      title="Edit job"
                    >
                      {updatingJobId === job.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Pencil className="size-3.5" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onRequestDeleteJob?.(job.id)}
                      disabled={deletingJobId === job.id || updatingJobId === job.id}
                      className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete job"
                    >
                      {deletingJobId === job.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}

            {rows.length === 0 && !isLoadingRows ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No matching opportunities found.
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-400">
          Page {Math.min(currentPage, totalPages)} of {Math.max(1, totalPages)}
        </span>

        <div className="flex items-center gap-1.5">
          <Button
            variant="secondary"
            size="xs"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoadingRows}
          >
            <ChevronLeft className="size-3.5" />
            Prev
          </Button>
          <Button
            variant="secondary"
            size="xs"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoadingRows}
          >
            Next
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
