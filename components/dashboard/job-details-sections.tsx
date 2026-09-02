import Link from "next/link";
import { Calendar, Copy, ExternalLink, Pencil, Save, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusVariant, type Job, type JobDetail } from "@/lib/mock-data";

export function JobDetailsHeader({
  job,
  onEditJob,
}: {
  job: Job;
  onEditJob?: () => void;
}) {
  return (
    <PageHeader
      kicker="Job details"
      title={`${job.company} — ${job.role}`}
      description={`${job.location ?? "—"} • ${job.when}`}
      actions={
        <>
          <Badge variant={statusVariant(job.status)}>{job.status}</Badge>
          <Button asChild variant="secondary">
            <Link href="/dashboard/jobs">Back to jobs</Link>
          </Button>
          {job.link ? (
            <Button asChild variant="secondary">
              <a href={job.link} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Open listing
              </a>
            </Button>
          ) : (
            <Button variant="secondary" disabled>
              <ExternalLink className="h-4 w-4" />
              Open listing
            </Button>
          )}
          <Button onClick={onEditJob}>
            <Pencil className="h-4 w-4" />
            Edit job
          </Button>
        </>
      }
    />
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
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-5 shadow-none">
        <div className="text-sm font-medium text-foreground">Notes</div>
        <textarea
          value={currentNotes}
          onChange={(event) => onNotesChange?.(event.target.value)}
          placeholder="Add notes for this job..."
          className="mt-3 min-h-[130px] w-full rounded-2xl border border-border bg-muted/60 p-4 text-sm text-foreground/80 outline-none focus:border-ring"
        />

        <div className="mt-4 flex gap-2">
          <Button
            variant="secondary"
            className="px-3"
            onClick={onSaveNotes}
            disabled={isSavingNotes}
          >
            <Save className="h-4 w-4" />
            {isSavingNotes ? "Saving..." : "Save notes"}
          </Button>
          <Button
            variant="secondary"
            className="px-3"
            onClick={() => onCopyNotes?.(currentNotes)}
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-none">
        <div className="text-sm font-medium text-foreground">Interview rounds</div>
        <div className="mt-3 space-y-2">
          {details.rounds?.length ? (
            details.rounds.map((round) => (
              <div
                key={round.name}
                className="flex items-center justify-between rounded-2xl border border-border bg-muted/60 p-3"
              >
                <div className="text-sm font-medium text-foreground">{round.name}</div>
                <Badge variant={round.status === "Done" ? "success" : round.status === "Upcoming" ? "info" : "neutral"}>
                  {round.status}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No rounds added.</div>
          )}
        </div>
        <div className="mt-3">
          <Button variant="secondary" className="px-3" onClick={onEditRounds}>
            <Pencil className="h-4 w-4" />
            Edit rounds
          </Button>
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
    <aside className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-5 shadow-none">
        <div className="text-sm font-medium text-foreground">Status</div>
        <div className="mt-3">
          <select
            value={status ?? "Saved"}
            onChange={(event) => onStatusChange?.(event.target.value as Job["status"])}
            className="w-full rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring"
          >
            <option>Saved</option>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>
        <div className="mt-3">
          <Button className="w-full" onClick={onSaveStatus} disabled={isSavingStatus}>
            <Save className="h-4 w-4" />
            {isSavingStatus ? "Updating..." : "Update status"}
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-none">
        <div className="text-sm font-medium text-foreground">Follow-up</div>
        <div className="mt-2 text-sm text-muted-foreground">Set a reminder so you don’t lose momentum.</div>
        <div className="mt-4 rounded-2xl border border-border bg-muted/60 p-3 text-sm text-foreground/80">
          {details.followUp || "Not set"}
        </div>
        <div className="mt-3">
          <Button
            variant="secondary"
            className="w-full"
            onClick={onSetFollowUp}
            disabled={isSettingFollowUp}
          >
            <Calendar className="h-4 w-4" />
            {isSettingFollowUp ? "Saving..." : "Set follow-up"}
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-none">
        <div className="text-sm font-medium text-foreground">Contact</div>
        <div className="mt-3 space-y-2 text-sm text-foreground/80">
          <div>
            <div className="text-xs text-muted-foreground">Name</div>
            <div className="font-medium text-foreground">{details.contact?.name || "—"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Email</div>
            <div className="font-medium text-foreground">{details.contact?.email || "—"}</div>
          </div>
        </div>
        <div className="mt-3">
          <Button variant="secondary" className="w-full" onClick={onEditContact}>
            <Pencil className="h-4 w-4" />
            Edit contact
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-none">
        <div className="text-sm font-medium text-foreground">Danger zone</div>
        <div className="mt-3">
          <Button
            variant="danger"
            className="w-full"
            onClick={onDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete job"}
          </Button>
        </div>
      </section>
    </aside>
  );
}
