"use client";
import { FormSelect } from "@/components/ui/form-select";
import { SelectItem } from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import { statusVariant, type Job, type JobStatus } from "@/lib/mock-data";

export const jobStatuses: JobStatus[] = [
  "Saved",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];
type Round = { name: string; status: "Done" | "Upcoming" | "Pending" };
type JobInput = {
  company: string;
  role: string;
  status: JobStatus;
  contactName: string;
  contactEmail: string;
  interviewRounds: Round[];
  location: string;
  link: string;
};
type JobModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: JobInput) => Promise<void>;
  isSubmitting: boolean;
  mode?: "create" | "edit";
  initialValues?: Partial<JobInput>;
};

export function JobsHeader({ onAddJobClick }: { onAddJobClick?: () => void }) {
  return (
    <PageHeader
      eyebrow="GOOD THINGS IN MOTION"
      title="Job tracker"
      description="A home for every opportunity. A clear view of your next step."
      actions={
        <Button onClick={onAddJobClick}>
          <Plus size={16} />
          Add a job
        </Button>
      }
    />
  );
}

export function AddJobModal(props: JobModalProps) {
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      title={
        props.mode === "edit"
          ? "Keep the details up to date."
          : "Make room for a new possibility."
      }
      description={
        props.mode === "edit"
          ? "Update this opportunity in your job tracker."
          : "Start with a company and role. Fill in the rest as you go."
      }
      busy={props.isSubmitting}
    >
      <JobForm {...props} />
    </Modal>
  );
}

function JobForm({
  onClose,
  onSubmit,
  isSubmitting,
  mode = "create",
  initialValues,
}: JobModalProps) {
  const id = useId();
  const [values, setValues] = useState<JobInput>({
    company: "",
    role: "",
    status: "Saved",
    contactName: "",
    contactEmail: "",
    interviewRounds: [],
    location: "",
    link: "",
    ...initialValues,
  });
  const [error, setError] = useState<string | null>(null);
  function set<K extends keyof JobInput>(key: K, value: JobInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!values.company.trim() || !values.role.trim()) {
      setError("Add a company and role to continue.");
      return;
    }
    setError(null);
    try {
      await onSubmit({
        ...values,
        company: values.company.trim(),
        role: values.role.trim(),
        contactName: values.contactName.trim(),
        contactEmail: values.contactEmail.trim(),
        location: values.location.trim(),
        link: values.link.trim(),
        interviewRounds: values.interviewRounds
          .filter((round) => round.name.trim())
          .map((round) => ({ ...round, name: round.name.trim() })),
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not save this opportunity. Please try again.",
      );
    }
  }
  return (
    <form onSubmit={submit}>
      <fieldset disabled={isSubmitting} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label className="field-label" htmlFor={`${id}-company`}>
              Company <span className="text-[#8aa76a]">*</span>
            </Label>
            <Input
              id={`${id}-company`}
              className="field-input"
              placeholder="e.g. Linear"
              autoFocus
              required
              value={values.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </div>
          <div>
            <Label className="field-label" htmlFor={`${id}-role`}>
              Role <span className="text-[#8aa76a]">*</span>
            </Label>
            <Input
              id={`${id}-role`}
              className="field-input"
              placeholder="e.g. Product Designer"
              required
              value={values.role}
              onChange={(e) => set("role", e.target.value)}
            />
          </div>
          <div>
            <Label className="field-label" htmlFor={`${id}-status`}>
              Where are you in the process?
            </Label>
            <FormSelect
              id={`${id}-status`}
              disabled={isSubmitting}
              className="field-input"
              value={values.status}
              onValueChange={(e) => set("status", e as JobStatus)}
            >
              {jobStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </FormSelect>
          </div>
          <div>
            <Label className="field-label" htmlFor={`${id}-location`}>
              Location{" "}
              <span className="font-normal text-zinc-400">(optional)</span>
            </Label>
            <Input
              id={`${id}-location`}
              className="field-input"
              placeholder="Remote, hybrid, or a city"
              value={values.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label className="field-label" htmlFor={`${id}-link`}>
            Job listing{" "}
            <span className="font-normal text-zinc-400">(optional)</span>
          </Label>
          <Input
            id={`${id}-link`}
            type="url"
            className="field-input"
            placeholder="https://company.com/careers/…"
            value={values.link}
            onChange={(e) => set("link", e.target.value)}
          />
        </div>
        <details
          className="rounded-lg border border-zinc-200"
          open={mode === "edit" ? true : undefined}
        >
          <summary className="flex list-none items-center justify-between p-4 text-sm font-medium">
            Contact & interview details
            <ChevronDown size={15} />
          </summary>
          <div className="space-y-5 border-t border-zinc-100 p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor={`${id}-name`} className="field-label">
                  Contact name
                </Label>
                <Input
                  id={`${id}-name`}
                  className="field-input"
                  placeholder="Recruiter or hiring manager"
                  value={values.contactName}
                  onChange={(e) => set("contactName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`${id}-email`} className="field-label">
                  Contact email
                </Label>
                <Input
                  id={`${id}-email`}
                  type="email"
                  className="field-input"
                  placeholder="name@company.com"
                  value={values.contactEmail}
                  onChange={(e) => set("contactEmail", e.target.value)}
                />
              </div>
            </div>
            <div>
              <p className="field-label">Interview rounds</p>
              <RoundsEditor
                rounds={values.interviewRounds}
                onChange={(rounds) => set("interviewRounds", rounds)}
              />
            </div>
          </div>
        </details>
      </fieldset>
      {error && (
        <p role="alert" className="form-error mt-4">
          {error}
        </p>
      )}
      <div className="form-footer">
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Plus size={16} />
          )}
          {isSubmitting
            ? "Saving…"
            : mode === "edit"
              ? "Save changes"
              : "Add to my tracker"}
        </Button>
      </div>
    </form>
  );
}

export function RoundsEditor({
  rounds,
  onChange,
}: {
  rounds: Round[];
  onChange: (rounds: Round[]) => void;
}) {
  return (
    <div className="space-y-3">
      {rounds.map((round, index) => (
        <div key={index} className="flex flex-wrap gap-2">
          <Input
            className="field-input !w-auto min-w-0 flex-[1_1_150px]"
            aria-label={`Round ${index + 1} name`}
            value={round.name}
            onChange={(e) =>
              onChange(
                rounds.map((r, i) =>
                  i === index ? { ...r, name: e.target.value } : r,
                ),
              )
            }
            placeholder="e.g. Portfolio review"
          />
          <FormSelect
            className="field-input !w-auto flex-[0_1_115px]"
            aria-label={`Round ${index + 1} status`}
            value={round.status}
            onValueChange={(e) =>
              onChange(
                rounds.map((r, i) =>
                  i === index ? { ...r, status: e as Round["status"] } : r,
                ),
              )
            }
          >
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Upcoming">Upcoming</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </FormSelect>
          <button
            type="button"
            className="icon-button icon-button-danger !h-11"
            aria-label={`Remove round ${index + 1}`}
            onClick={() => onChange(rounds.filter((_, i) => i !== index))}
          >
            <X size={16} />
          </button>
        </div>
      ))}
      <Button
        variant="secondary"
        onClick={() => onChange([...rounds, { name: "", status: "Pending" }])}
      >
        <Plus size={15} />
        Add round
      </Button>
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
  onEditJob?: (id: string) => void;
  onRequestDeleteJob?: (id: string) => void;
  updatingJobId?: string | null;
  deletingJobId?: string | null;
  onHoverJob?: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoadingRows?: boolean;
}) {
  const actions = (job: Job) => (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/dashboard/jobs/${job.id}`}
        onMouseEnter={() => onHoverJob?.(job.id)}
        className="icon-button"
        aria-label={`View ${job.role} at ${job.company}`}
      >
        <ArrowUpRight size={16} />
      </Link>
      <button
        type="button"
        className="icon-button"
        aria-label={`Edit ${job.role} at ${job.company}`}
        onClick={() => onEditJob?.(job.id)}
        disabled={updatingJobId === job.id || deletingJobId === job.id}
      >
        <Pencil size={14} />
      </button>
      <button
        type="button"
        className="icon-button icon-button-danger"
        aria-label={`Delete ${job.role} at ${job.company}`}
        onClick={() => onRequestDeleteJob?.(job.id)}
        disabled={deletingJobId === job.id || updatingJobId === job.id}
      >
        {deletingJobId === job.id ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Trash2 size={14} />
        )}
      </button>
    </div>
  );
  return (
    <section className="space-y-5" aria-label="Application tracker">
      <div className="collection-toolbar">
        <div className="search-field">
          <Search size={16} />
          <Input
            aria-label="Search jobs"
            type="search"
            className="field-input"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search a company, role, or city…"
          />
        </div>
        <div className="filter-group">
          {isLoadingRows && (
            <span
              role="status"
              className="flex items-center gap-2 text-xs text-zinc-500"
            >
              <Loader2 size={13} className="animate-spin" />
              Updating
            </span>
          )}
          <FormSelect
            aria-label="Filter jobs by date added"
            value={dateFilter}
            onValueChange={(e) => onDateFilterChange(e as typeof dateFilter)}
          >
            <SelectItem value="All">Added any time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </FormSelect>
        </div>
      </div>
      <div className="panel overflow-hidden">
        <div
          className="status-tabs"
          role="group"
          aria-label="Filter by application status"
        >
          {(["All", ...jobStatuses] as const).map((status) => (
            <button
              type="button"
              className="status-tab"
              aria-pressed={statusFilter === status}
              key={status}
              onClick={() => onStatusFilterChange(status)}
            >
              {status === "All" ? "All opportunities" : status}
            </button>
          ))}
        </div>
        {rows.length > 0 ? (
          <>
            <div className="table-wrap hidden md:block">
              <table className="data-table" aria-busy={isLoadingRows}>
                <thead>
                  <tr>
                    <th scope="col">OPPORTUNITY</th>
                    <th scope="col">STATUS</th>
                    <th scope="col">ADDED</th>
                    <th scope="col" className="text-right">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <Link
                          href={`/dashboard/jobs/${job.id}`}
                          onMouseEnter={() => onHoverJob?.(job.id)}
                          className="flex items-center gap-3"
                        >
                          <span className="company-avatar">
                            {job.company[0]}
                          </span>
                          <div className="min-w-0">
                            <div className="font-medium">{job.role}</div>
                            <div className="mt-1 text-xs text-zinc-500">
                              {job.company}
                              {job.location && (
                                <span className="text-zinc-400">
                                  {" "}
                                  · {job.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td>
                        <Badge variant={statusVariant(job.status)}>
                          {job.status}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap text-xs text-zinc-500">
                        {job.when}
                      </td>
                      <td>{actions(job)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="divide-y divide-zinc-100 md:hidden">
              {rows.map((job) => (
                <article className="p-5" key={job.id}>
                  <div className="flex gap-3">
                    <span className="company-avatar">{job.company[0]}</span>
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="min-w-0 flex-1"
                    >
                      <h3 className="text-sm font-medium">{job.role}</h3>
                      <p className="mt-1 text-xs text-zinc-500">
                        {job.company} · {job.when}
                      </p>
                    </Link>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant={statusVariant(job.status)}>
                      {job.status}
                    </Badge>
                    {actions(job)}
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="icon-tile">
              {query || statusFilter !== "All" || dateFilter !== "All" ? (
                <Search size={25} />
              ) : (
                <BriefcaseBusiness size={25} />
              )}
            </div>
            <h3>
              {query || statusFilter !== "All" || dateFilter !== "All"
                ? "No matching opportunities."
                : "Big possibilities start here."}
            </h3>
            <p>
              {query || statusFilter !== "All" || dateFilter !== "All"
                ? "Try another search or clear your filters to find what you’re looking for."
                : "Add your first opportunity with the “Add a job” button above. Keep its details, conversations, and next steps together."}
            </p>
            {(query || statusFilter !== "All" || dateFilter !== "All") && (
              <Button
                variant="secondary"
                onClick={() => {
                  onQueryChange("");
                  onStatusFilterChange("All");
                  onDateFilterChange("All");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
        <div className="pagination">
          <span>
            Page {Math.min(currentPage, Math.max(totalPages, 1))} of{" "}
            {Math.max(totalPages, 1)}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="!min-h-9 !px-3 !py-1.5 !text-xs"
              disabled={currentPage <= 1 || isLoadingRows}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ArrowLeft size={13} />
              Previous
            </Button>
            <Button
              variant="secondary"
              className="!min-h-9 !px-3 !py-1.5 !text-xs"
              disabled={currentPage >= totalPages || isLoadingRows}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
              <ArrowRight size={13} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
