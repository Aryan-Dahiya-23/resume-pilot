"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import { statusVariant, type Job, type JobStatus } from "@/lib/mock-data";

const fieldClassName =
  "mt-2 h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15";
const labelClassName =
  "text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase";

export function JobsHeader({ onAddJobClick }: { onAddJobClick?: () => void }) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
          Job pipeline
        </div>
        <h1 className="text-4xl leading-[0.98] font-semibold tracking-[-0.045em] text-foreground sm:text-5xl">
          Keep the search moving.
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          Track every opportunity, keep the next step visible, and follow through
          with more intent.
        </p>
      </div>
      <Button onClick={onAddJobClick} className="sm:shrink-0">
        <Plus className="size-4" />
        Add job
      </Button>
    </header>
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
  const [company, setCompany] = useState(initialValues?.company ?? "");
  const [role, setRole] = useState(initialValues?.role ?? "");
  const [status, setStatus] = useState<JobStatus>(initialValues?.status ?? "Saved");
  const [contactName, setContactName] = useState(initialValues?.contactName ?? "");
  const [contactEmail, setContactEmail] = useState(initialValues?.contactEmail ?? "");
  const [roundsText, setRoundsText] = useState(
    (initialValues?.interviewRounds ?? [])
      .map((round) => `${round.name} | ${round.status}`)
      .join("\n"),
  );
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [link, setLink] = useState(initialValues?.link ?? "");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!company.trim() || !role.trim()) {
      setError("Company and role are required.");
      return;
    }

    const interviewRounds = roundsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [nameRaw, statusRaw] = line.split("|").map((part) => part.trim());
        const roundStatus: "Done" | "Upcoming" | "Pending" =
          statusRaw === "Done" || statusRaw === "Upcoming" || statusRaw === "Pending"
            ? statusRaw
            : "Pending";
        return { name: nameRaw, status: roundStatus };
      })
      .filter((round) => round.name);

    setError(null);
    try {
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
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Could not save this job.",
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isSubmitting) onClose();
      }}
    >
      <DialogContent className="max-h-[90dvh] max-w-xl gap-0 overflow-y-auto p-0 sm:max-w-xl" showCloseButton={false}>
        <DialogHeader className="border-b border-border px-5 py-5 sm:px-6">
          <div className="text-[11px] font-semibold tracking-[0.1em] text-brand uppercase">
            {mode === "edit" ? "Opportunity details" : "New opportunity"}
          </div>
          <DialogTitle className="text-xl font-semibold tracking-[-0.03em]">
            {mode === "edit" ? "Update this job." : "Add a job to the pipeline."}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Keep the details current so the next action stays obvious."
              : "Capture the essential details now; you can add more context later."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-5 py-5 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClassName}>
                Company <span className="text-brand">*</span>
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  className={fieldClassName}
                  placeholder="Stripe"
                />
              </label>
              <label className={labelClassName}>
                Role <span className="text-brand">*</span>
                <input
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className={fieldClassName}
                  placeholder="Frontend Engineer"
                />
              </label>
              <label className={labelClassName}>
                Status
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as JobStatus)}
                  className={fieldClassName}
                >
                  <option>Saved</option>
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </label>
              <label className={labelClassName}>
                Location
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className={fieldClassName}
                  placeholder="Remote"
                />
              </label>
              <label className={labelClassName}>
                Contact name
                <input
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  className={fieldClassName}
                  placeholder="Recruiter name"
                />
              </label>
              <label className={labelClassName}>
                Contact email
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(event) => setContactEmail(event.target.value)}
                  className={fieldClassName}
                  placeholder="recruiter@company.com"
                />
              </label>
            </div>

            <label className={labelClassName}>
              Job listing
              <input
                type="url"
                value={link}
                onChange={(event) => setLink(event.target.value)}
                className={fieldClassName}
                placeholder="https://…"
              />
            </label>

            <label className={labelClassName}>
              Interview rounds
              <span className="ml-2 normal-case tracking-normal text-muted-foreground">
                One per line: Name | Status
              </span>
              <textarea
                value={roundsText}
                onChange={(event) => setRoundsText(event.target.value)}
                className="mt-2 min-h-[96px] w-full rounded-lg border border-input bg-card p-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
                placeholder={"Recruiter screen | Done\nTechnical round | Upcoming"}
              />
            </label>

            {error ? (
              <div className="border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}
          </div>

          <DialogFooter className="mt-0">
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitting
                ? mode === "edit"
                  ? "Saving…"
                  : "Adding…"
                : mode === "edit"
                  ? "Save changes"
                  : "Add job"}
            </Button>
          </DialogFooter>
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
  onEditJob,
  onRequestDeleteJob,
  updatingJobId,
  deletingJobId,
  onHoverJob,
  currentPage,
  totalPages,
  onPageChange,
  isLoadingRows,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: JobStatus | "All";
  onStatusFilterChange: (value: JobStatus | "All") => void;
  dateFilter: "All" | "today" | "7d" | "30d";
  onDateFilterChange: (value: "All" | "today" | "7d" | "30d") => void;
  rows: Job[];
  onEditJob?: (jobId: string) => void;
  onRequestDeleteJob?: (jobId: string) => void;
  updatingJobId?: string | null;
  deletingJobId?: string | null;
  onHoverJob?: (jobId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoadingRows?: boolean;
}) {
  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search company, role, or location"
            className="h-10 w-full rounded-lg border border-input bg-card py-2 pl-10 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value as JobStatus | "All")}
            className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/15"
            aria-label="Filter jobs by status"
          >
            <option value="All">All statuses</option>
            <option value="Saved">Saved</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            value={dateFilter}
            onChange={(event) =>
              onDateFilterChange(event.target.value as "All" | "today" | "7d" | "30d")
            }
            className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/15"
            aria-label="Filter jobs by date"
          >
            <option value="All">Any date</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      <div className="border-b border-border px-5 py-2 text-xs text-muted-foreground md:hidden">
        Swipe horizontally to view every column.
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[780px]">
          <div className="grid grid-cols-[1.1fr_1.45fr_145px_120px_110px] border-b border-border bg-muted/45 px-5 py-3 text-[11px] font-semibold tracking-[0.09em] text-muted-foreground uppercase">
            <div>Company</div>
            <div>Role</div>
            <div>Status</div>
            <div>Added</div>
            <div className="text-right">Actions</div>
          </div>
          <div className="divide-y divide-border/70">
            {isLoadingRows ? (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 inline size-4 animate-spin text-brand" />
                Loading jobs…
              </div>
            ) : null}
            {rows.map((job) => (
              <div
                key={job.id}
                className="grid grid-cols-[1.1fr_1.45fr_145px_120px_110px] items-center px-5 py-4 transition-colors hover:bg-muted/35"
              >
                <div className="truncate pr-4 text-sm font-semibold text-foreground">
                  {job.company}
                </div>
                <div className="min-w-0 pr-4">
                  <div className="truncate text-sm font-medium text-foreground">{job.role}</div>
                  {job.location ? (
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      {job.location}
                    </div>
                  ) : null}
                </div>
                <div>
                  <Badge variant={statusVariant(job.status)}>{job.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{job.when}</div>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon-sm" asChild>
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      onMouseEnter={() => onHoverJob?.(job.id)}
                      aria-label={`Open ${job.company}`}
                    >
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEditJob?.(job.id)}
                    disabled={updatingJobId === job.id || deletingJobId === job.id}
                    aria-label={`Edit ${job.company}`}
                  >
                    {updatingJobId === job.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Pencil className="size-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onRequestDeleteJob?.(job.id)}
                    disabled={deletingJobId === job.id || updatingJobId === job.id}
                    aria-label={`Delete ${job.company}`}
                  >
                    {deletingJobId === job.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
            {rows.length === 0 && !isLoadingRows ? (
              <div className="px-5 py-12 text-center">
                <div className="text-sm font-semibold text-foreground">No matching jobs</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Try changing the search or filters.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Page {Math.min(currentPage, totalPages)} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoadingRows}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoadingRows}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
