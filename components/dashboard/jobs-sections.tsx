import Link from "next/link";
import {
  ArrowUpRight,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusVariant, type Job, type JobStatus } from "@/lib/mock-data";

export function JobsHeader({ onAddJobClick }: { onAddJobClick?: () => void }) {
  return (
    <PageHeader
      kicker="Jobs"
      title="Application tracker"
      description="Move roles from saved to offer without a spreadsheet."
      actions={
        <Button onClick={onAddJobClick}>
          <Plus className="h-4 w-4" />
          Add job
        </Button>
      }
    />
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

  useEffect(() => {
    if (!open) return;
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
  }, [open, initialValues]);

  if (!open) return null;

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
      setCompany("");
      setRole("");
      setStatus("Saved");
      setContactName("");
      setContactEmail("");
      setRoundsText("");
      setLocation("");
      setLink("");
    } catch (submitError) {
      if (submitError instanceof Error) {
        setError(submitError.message);
      } else {
        setError("Could not create job.");
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
      <div className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-xl sm:max-h-[90dvh] sm:max-w-xl sm:rounded-xl">
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-4 sm:px-5 sm:py-5">
          <div>
            <div className="text-base font-semibold text-foreground">
              {mode === "edit" ? "Edit job" : "Add job"}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {mode === "edit"
                ? "Update this job in your pipeline."
                : "Track a new application in your pipeline."}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-border bg-card p-2 text-muted-foreground hover:bg-muted"
            aria-label="Close"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Company</label>
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring"
                placeholder="Stripe"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Role</label>
              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring"
                placeholder="Frontend Engineer"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as JobStatus)}
                className="mt-1 w-full rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring"
              >
                <option>Saved</option>
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Location</label>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring"
                placeholder="Remote"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Contact name</label>
              <input
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring"
                placeholder="Recruiter name"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Contact email</label>
              <input
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring"
                placeholder="recruiter@company.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Job link</label>
            <input
              value={link}
              onChange={(event) => setLink(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Interview rounds (one per line: `Name | Status`)
            </label>
            <textarea
              value={roundsText}
              onChange={(event) => setRoundsText(event.target.value)}
              className="mt-1 min-h-[90px] w-full rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring"
              placeholder={"Recruiter Screen | Done\nTechnical Round | Upcoming"}
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Saving..." : "Creating..."}
                </>
              ) : (
                mode === "edit" ? "Save changes" : "Create job"
              )}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
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
    <section className="rounded-xl border border-border bg-card p-5 shadow-none">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-[360px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search company, role, location..."
            className="w-full rounded-2xl border border-border bg-card py-2 pl-10 pr-3 text-sm outline-none focus:border-ring"
          />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as JobStatus | "All")
            }
            className="rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring"
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
              onDateFilterChange(
                event.target.value as "All" | "today" | "7d" | "30d",
              )
            }
            className="rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring"
          >
            <option value="All">Any date</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
        <div className="min-w-[780px]">
          <div className="grid grid-cols-[1.2fr_1.4fr_160px_140px_80px] bg-muted/60 px-4 py-3 text-xs font-medium text-muted-foreground">
            <div>Company</div>
            <div>Role</div>
            <div>Status</div>
            <div>Date</div>
            <div className="text-right">...</div>
          </div>
          <div className="divide-y divide-border">
            {isLoadingRows ? (
              <div className="px-4 py-8 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading jobs...
                </div>
              </div>
            ) : null}
            {rows.map((job) => (
              <div
                key={job.id}
                className="grid grid-cols-[1.2fr_1.4fr_160px_140px_80px] items-center px-4 py-3"
              >
              <div className="truncate text-left text-sm font-medium text-foreground">
                {job.company}
              </div>
              <div className="truncate text-sm text-foreground/80">{job.role}</div>
              <div>
                <Badge variant={statusVariant(job.status)}>{job.status}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">{job.when}</div>
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/dashboard/jobs/${job.id}`}
                  onMouseEnter={() => onHoverJob?.(job.id)}
                  className="rounded-xl border border-border bg-card p-2 hover:bg-muted"
                  title="View details"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <button
                  className="rounded-xl border border-border bg-card p-2 hover:bg-muted"
                  title="Edit"
                  onClick={() => onEditJob?.(job.id)}
                  disabled={updatingJobId === job.id || deletingJobId === job.id}
                >
                  {updatingJobId === job.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Pencil className="h-4 w-4" />
                  )}
                </button>
                <button
                  className="rounded-xl border border-border bg-card p-2 hover:bg-muted"
                  title="Delete"
                  onClick={() => onRequestDeleteJob?.(job.id)}
                  disabled={deletingJobId === job.id || updatingJobId === job.id}
                >
                  {deletingJobId === job.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
              </div>
            ))}
            {rows.length === 0 && !isLoadingRows ? (
              <div className="px-4 py-8 text-center">
                <div className="text-sm font-medium text-foreground">No matching jobs</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Try changing search text or filters to see results.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {Math.min(currentPage, totalPages)} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="px-3"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoadingRows}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            className="px-3"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoadingRows}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">Pro tip: treat your job hunt like a pipeline. Track status changes.</div>
    </section>
  );
}
