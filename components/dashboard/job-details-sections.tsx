import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Save,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { FormSelect } from "@/components/ui/form-select";
import { SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";
import { statusVariant, type Job, type JobDetail } from "@/lib/mock-data";

export function JobDetailsHeader({
  job,
  onEditJob,
}: {
  job: Job;
  onEditJob?: () => void;
}) {
  return (
    <>
      <Link href="/dashboard/jobs" className="text-link !text-xs">
        <ArrowLeft size={14} />
        Back to job tracker
      </Link>
      <PageHeader
        eyebrow={job.company}
        title={job.role}
        description={
          <span className="inline-flex flex-wrap items-center gap-3">
            <Badge variant={statusVariant(job.status)}>{job.status}</Badge>
            {job.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={13} />
                {job.location}
              </span>
            )}
            <span className="text-xs text-zinc-400">
              Added {job.when.toLowerCase()}
            </span>
          </span>
        }
        actions={
          <>
            {job.link && (
              <a
                href={job.link}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles("secondary")}
              >
                View listing
                <ExternalLink size={14} />
              </a>
            )}
            <Button onClick={onEditJob}>
              <Pencil size={14} />
              Edit opportunity
            </Button>
          </>
        }
      />
    </>
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
  const notes = notesValue ?? details.notes ?? "";
  return (
    <div className="min-w-0 space-y-6">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2 className="section-title">The conversations ahead</h2>
            <p className="panel-kicker">
              Your interview journey, one step at a time.
            </p>
          </div>
          <Button
            variant="secondary"
            className="!min-h-9 !px-3 !text-xs"
            onClick={onEditRounds}
          >
            <Pencil size={13} />
            Edit rounds
          </Button>
        </div>
        <div className="px-6 pb-6">
          {details.rounds?.length ? (
            <ol className="space-y-0">
              {details.rounds.map((round, index) => (
                <li
                  key={`${round.name}-${index}`}
                  className="relative flex items-start gap-4 pb-7 last:pb-0"
                >
                  {index !== details.rounds.length - 1 && (
                    <span
                      className="absolute bottom-0 left-[15px] top-8 w-px bg-zinc-200"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs ${round.status === "Done" ? "border-[#c9dab4] bg-[#eaf2df] text-[#668743]" : round.status === "Upcoming" ? "border-[#c1cdea] bg-[#edf2fb] text-[#6a82ac]" : "border-zinc-200 bg-zinc-50 text-zinc-400"}`}
                  >
                    {round.status === "Done" ? (
                      <Check size={14} />
                    ) : (
                      `${index + 1}`
                    )}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-2 pt-1">
                    <h3 className="text-sm font-medium">{round.name}</h3>
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
                </li>
              ))}
            </ol>
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-7 text-center">
              <MessageSquare
                size={24}
                className="mx-auto mb-3 text-[#9aaf81]"
              />
              <h3 className="text-sm font-medium">
                Make space for a good conversation.
              </h3>
              <p className="mt-2 text-xs leading-6 text-zinc-500">
                Add interview rounds as they’re scheduled to keep the process in
                view.
              </p>
            </div>
          )}
        </div>
      </section>
      <section className="panel p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Label htmlFor="job-notes" className="section-title">
              A place for the details
            </Label>
            <p className="panel-kicker">
              Research, questions, and things worth remembering.
            </p>
          </div>
          <button
            type="button"
            aria-label="Copy job notes"
            className="icon-button"
            onClick={() => onCopyNotes?.(notes)}
            disabled={!notes}
          >
            <Copy size={15} />
          </button>
        </div>
        <Textarea
          id="job-notes"
          className="field-input mt-5 min-h-[230px] !bg-[#fbfcf8] !p-4 !text-sm !leading-7"
          value={notes}
          onChange={(e) => onNotesChange?.(e.target.value)}
          placeholder={
            "What interests you about this role?\n\nPeople to speak with, questions to ask, details to revisit…"
          }
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-zinc-400">
            Your notes stay in your workspace.
          </p>
          <Button onClick={onSaveNotes} disabled={isSavingNotes}>
            <Save size={14} />
            {isSavingNotes ? "Saving…" : "Save notes"}
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
    <aside className="min-w-0 space-y-5">
      <section className="panel p-6">
        <h2 className="section-title">Where things stand</h2>
        <Label htmlFor="job-status" className="field-label mt-4">
          Application status
        </Label>
        <FormSelect
          id="job-status"
          className="field-input"
          value={status ?? "Saved"}
          onValueChange={(e) => onStatusChange?.(e as Job["status"])}
        >
          {["Saved", "Applied", "Interview", "Offer", "Rejected"].map(
            (value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ),
          )}
        </FormSelect>
        <Button
          className="mt-4 w-full"
          onClick={onSaveStatus}
          disabled={isSavingStatus}
        >
          <Save size={14} />
          {isSavingStatus ? "Updating…" : "Update status"}
        </Button>
      </section>
      <section className="panel !border-[#e0e8d5] !bg-[#f0f4e8] p-6">
        <h2 className="section-title flex items-center gap-2">
          <CalendarDays size={17} className="text-[#8ea773]" />
          Your next touchpoint
        </h2>
        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-zinc-600">
          {details.followUp ||
            "A quick follow-up can keep a good conversation going."}
        </p>
        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={onSetFollowUp}
          disabled={isSettingFollowUp}
        >
          <Pencil size={14} />
          {details.followUp ? "Edit follow-up note" : "Add follow-up note"}
        </Button>
        <p className="mt-3 text-[11px] leading-5 text-zinc-500">
          A note in your tracker; no notification is scheduled.
        </p>
      </section>
      <section className="panel p-6">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Your point of contact</h2>
          <button
            type="button"
            className="icon-button"
            aria-label="Edit contact"
            onClick={onEditContact}
          >
            <Pencil size={14} />
          </button>
        </div>
        {details.contact?.name || details.contact?.email ? (
          <>
            <div className="mt-4 text-sm font-medium">
              {details.contact.name || "Contact"}
            </div>
            {details.contact.email && (
              <a
                href={`mailto:${details.contact.email}`}
                className="mt-2 flex items-start gap-2 break-all text-xs leading-6 text-zinc-500"
              >
                <Mail size={13} className="mt-1 shrink-0" />
                {details.contact.email}
              </a>
            )}
          </>
        ) : (
          <p className="mt-3 text-xs leading-6 text-zinc-500">
            Add a recruiter or hiring manager so the right person is always easy
            to find.
          </p>
        )}
      </section>
      <Button
        variant="ghost"
        className="w-full !text-rose-700"
        onClick={onDelete}
        disabled={isDeleting}
      >
        <Trash2 size={14} />
        {isDeleting ? "Deleting…" : "Remove this opportunity"}
      </Button>
    </aside>
  );
}
