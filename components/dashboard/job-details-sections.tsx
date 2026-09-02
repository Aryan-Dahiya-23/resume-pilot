import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Copy,
  ExternalLink,
  Pencil,
  Save,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusVariant, type Job, type JobDetail } from "@/lib/mock-data";

const fieldClassName =
  "h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/15";

export function JobDetailsHeader({
  job,
  onEditJob,
}: {
  job: Job;
  onEditJob?: () => void;
}) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <Button variant="link" size="sm" className="-ml-3 mb-4" asChild>
          <Link href="/dashboard/jobs">
            <ArrowLeft className="size-3.5" />
            Job pipeline
          </Link>
        </Button>
        <div className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
          Opportunity
        </div>
        <h1 className="mt-3 truncate text-4xl leading-[0.98] font-semibold tracking-[-0.045em] text-foreground sm:text-5xl">
          {job.company}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{job.role}</span>
          <span aria-hidden="true">·</span>
          <Badge variant={statusVariant(job.status)}>{job.status}</Badge>
          <span>{job.location ?? "No location"}</span>
          <span aria-hidden="true">·</span>
          <span>Added {job.when}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
        {job.link ? (
          <Button variant="secondary" asChild>
            <a href={job.link} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" />
              Listing
            </a>
          </Button>
        ) : null}
        <Button onClick={onEditJob}>
          <Pencil className="size-4" />
          Edit job
        </Button>
      </div>
    </header>
  );
}

export function JobDetailsMain({
  details,
  notesValue,
  onNotesChange,
  onSaveNotes,
  isSavingNotes,
  onCopyNotes,
  onEditRounds,
}: {
  details: JobDetail;
  notesValue?: string;
  onNotesChange?: (value: string) => void;
  onSaveNotes?: () => void;
  isSavingNotes?: boolean;
  onCopyNotes?: (value: string) => void;
  onEditRounds?: () => void;
}) {
  const currentNotes = notesValue ?? details.notes ?? "";

  return (
    <div className="space-y-4">
      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.1em] text-brand uppercase">
              Working notes
            </div>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground">
              Keep the context close.
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Capture talking points, research, and details to use in follow-ups.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => onCopyNotes?.(currentNotes)}>
            <Copy className="size-3.5" />
            Copy
          </Button>
        </div>
        <textarea
          value={currentNotes}
          onChange={(event) => onNotesChange?.(event.target.value)}
          placeholder="What stands out about this role? Who are you speaking with? What do you need to prepare?"
          className="mt-5 min-h-[190px] w-full resize-y rounded-lg border border-input bg-muted/25 p-4 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
        />
        <div className="mt-4 flex justify-end">
          <Button onClick={onSaveNotes} disabled={isSavingNotes}>
            <Save className="size-4" />
            {isSavingNotes ? "Saving…" : "Save notes"}
          </Button>
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Interview path
            </div>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground">
              Interview rounds.
            </h2>
          </div>
          <Button variant="secondary" size="sm" onClick={onEditRounds}>
            <Pencil className="size-3.5" />
            Edit rounds
          </Button>
        </div>
        <div className="divide-y divide-border/70">
          {details.rounds?.length ? (
            details.rounds.map((round, index) => (
              <div key={round.name} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="text-xs font-semibold text-brand">0{index + 1}</span>
                  <span className="truncate text-sm font-medium text-foreground">{round.name}</span>
                </div>
                <Badge
                  variant={
                    round.status === "Done"
                      ? "success"
                      : round.status === "Upcoming"
                        ? "info"
                        : "neutral"
                  }
                >
                  {round.status}
                </Badge>
              </div>
            ))
          ) : (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground sm:px-6">
              No interview rounds have been added yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function JobDetailsSidebar({
  details,
  status,
  onStatusChange,
  onSaveStatus,
  isSavingStatus,
  onSetFollowUp,
  isSettingFollowUp,
  onEditContact,
  onDelete,
  isDeleting,
}: {
  details: JobDetail;
  status?: Job["status"];
  onStatusChange?: (value: Job["status"]) => void;
  onSaveStatus?: () => void;
  isSavingStatus?: boolean;
  onSetFollowUp?: () => void;
  isSettingFollowUp?: boolean;
  onEditContact?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-8 xl:self-start">
      <section className="surface-card p-5">
        <div className="text-[11px] font-semibold tracking-[0.1em] text-brand uppercase">
          Current stage
        </div>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground">
          Keep it current.
        </h2>
        <select
          value={status ?? "Saved"}
          onChange={(event) => onStatusChange?.(event.target.value as Job["status"])}
          className={`mt-5 ${fieldClassName}`}
          aria-label="Job status"
        >
          <option>Saved</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <Button className="mt-3 w-full" onClick={onSaveStatus} disabled={isSavingStatus}>
          <Save className="size-4" />
          {isSavingStatus ? "Updating…" : "Update status"}
        </Button>
      </section>

      <section className="surface-card p-5">
        <div className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          Follow-up
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {details.followUp || "No follow-up has been set yet."}
        </p>
        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={onSetFollowUp}
          disabled={isSettingFollowUp}
        >
          <Calendar className="size-4" />
          {isSettingFollowUp ? "Saving…" : "Set follow-up"}
        </Button>
      </section>

      <section className="surface-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
            Contact
          </div>
          <Button variant="ghost" size="sm" onClick={onEditContact}>
            <Pencil className="size-3.5" />
            Edit
          </Button>
        </div>
        <div className="mt-4 space-y-4 text-sm">
          <div>
            <div className="text-xs text-muted-foreground">Name</div>
            <div className="mt-1 font-semibold text-foreground">
              {details.contact?.name || "Not added"}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Email</div>
            <div className="mt-1 break-all font-semibold text-foreground">
              {details.contact?.email || "Not added"}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <Trash2 className="size-3.5" />
          {isDeleting ? "Deleting…" : "Delete job"}
        </Button>
      </section>
    </aside>
  );
}
