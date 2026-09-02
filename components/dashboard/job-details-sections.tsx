"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  Pencil,
  Save,
  Trash2,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { statusVariant, type Job, type JobDetail } from "@/lib/mock-data";

export function JobDetailsHeader({
  job,
  onEditJob,
}: {
  job: Job;
  onEditJob?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
          <Building2 className="size-3.5" />
          <span>{job.company}</span>
        </div>
        <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {job.role}
        </h1>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Badge variant={statusVariant(job.status)} withDot>
            {job.status}
          </Badge>
          {job.location ? (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {job.location}
              </span>
            </>
          ) : null}
          <span>•</span>
          <span>Added {job.when}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Button variant="secondary" size="sm" asChild>
          <Link href="/dashboard/jobs">
            <ArrowLeft className="size-3.5" />
            Back to Pipeline
          </Link>
        </Button>

        {job.link ? (
          <Button variant="secondary" size="sm" asChild>
            <a href={job.link} target="_blank" rel="noreferrer">
              <ExternalLink className="size-3.5" />
              Listing
            </a>
          </Button>
        ) : null}

        <Button size="sm" onClick={onEditJob} className="shadow-xs shadow-indigo-500/20">
          <Pencil className="size-3.5" />
          Edit Details
        </Button>
      </div>
    </div>
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
  status = "Saved",
}: {
  details: JobDetail;
  notesValue?: string;
  onNotesChange?: (value: string) => void;
  onSaveNotes?: () => void;
  isSavingNotes?: boolean;
  onCopyNotes?: (value: string) => void;
  onEditRounds?: () => void;
  status?: Job["status"];
}) {
  const currentNotes = notesValue ?? details.notes ?? "";

  const stages: Array<Job["status"]> = ["Saved", "Applied", "Interview", "Offer"];
  const currentStageIndex = stages.indexOf(status);

  return (
    <div className="space-y-6">
      {/* Visual Pipeline Progression Stepper */}
      <Card className="rounded-3xl border-slate-200/90 shadow-xs">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Stage Progress</CardTitle>
          <CardDescription>
            Current lifecycle of this opportunity in your pipeline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {stages.map((st, idx) => {
              const isPast = currentStageIndex > idx;
              const isCurrent = currentStageIndex === idx;

              return (
                <div
                  key={st}
                  className={`rounded-2xl border p-3.5 text-center transition-all ${
                    isCurrent
                      ? "border-indigo-600 bg-indigo-50/70 shadow-2xs font-bold text-indigo-900"
                      : isPast
                        ? "border-emerald-200 bg-emerald-50/50 text-emerald-800"
                        : "border-slate-200 bg-slate-50/40 text-slate-400"
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider">
                    {isPast ? "Completed" : isCurrent ? "Active Stage" : "Upcoming"}
                  </div>
                  <div className="mt-1 text-sm font-semibold">{st}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Interview Rounds Timeline */}
      <Card className="rounded-3xl border-slate-200/90 shadow-xs">
        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Interview Rounds & Schedule
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Log every conversation, technical screen, and leadership interview.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={onEditRounds}>
              <Pencil className="size-3.5" />
              Configure Rounds
            </Button>
          </div>

          <div className="mt-5 space-y-2.5">
            {details.rounds?.length ? (
              details.rounds.map((round, index) => (
                <div
                  key={round.name}
                  className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-6 items-center justify-center rounded-lg bg-indigo-50 font-mono text-xs font-bold text-indigo-700">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {round.name}
                    </span>
                  </div>
                  <Badge
                    variant={
                      round.status === "Done"
                        ? "success"
                        : round.status === "Upcoming"
                          ? "info"
                          : "neutral"
                    }
                    withDot
                  >
                    {round.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
                No interview rounds scheduled yet. Click &quot;Configure Rounds&quot; to add them.
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Opportunity Research Notes */}
      <Card className="rounded-3xl border-slate-200/90 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">Research & Preparation Notes</CardTitle>
          <CardDescription>
            Company background, compensation details, tech stack specifics, and interviewer names.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={currentNotes}
            onChange={(e) => onNotesChange?.(e.target.value)}
            placeholder="Document compensation range, team mission, questions to ask interviewers..."
            className="min-h-[140px]"
          />

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={onSaveNotes} disabled={isSavingNotes}>
                <Save className="size-3.5" />
                {isSavingNotes ? "Saving..." : "Save Notes"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onCopyNotes?.(currentNotes)}
              >
                <Copy className="size-3.5" />
                Copy
              </Button>
            </div>
            <span className="text-[11px] text-slate-400">
              Notes are saved securely to your account.
            </span>
          </div>
        </CardContent>
      </Card>
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
    <aside className="space-y-5 xl:sticky xl:top-6">
      {/* Current Stage Switcher */}
      <Card className="rounded-3xl border-slate-200/90 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Opportunity Stage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <select
            value={status ?? "Saved"}
            onChange={(e) => onStatusChange?.(e.target.value as Job["status"])}
            className="h-10 w-full rounded-xl border border-slate-200/90 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option>Saved</option>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>

          <Button
            size="sm"
            className="w-full"
            onClick={onSaveStatus}
            disabled={isSavingStatus}
          >
            <Save className="size-3.5" />
            {isSavingStatus ? "Updating..." : "Update Stage"}
          </Button>
        </CardContent>
      </Card>

      {/* Follow-up Reminder Card */}
      <Card className="rounded-3xl border-slate-200/90 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-indigo-600" />
            <CardTitle className="text-base">Next Action Date</CardTitle>
          </div>
          <CardDescription>
            Set a reminder date so momentum isn&apos;t lost.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-3 text-xs font-medium text-slate-700">
            {details.followUp ? (
              <span className="flex items-center gap-1.5 text-indigo-700 font-semibold">
                <Clock className="size-3.5" />
                {details.followUp}
              </span>
            ) : (
              "No follow-up date configured."
            )}
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={onSetFollowUp}
            disabled={isSettingFollowUp}
          >
            <Calendar className="size-3.5" />
            {isSettingFollowUp ? "Saving..." : "Set Date Reminder"}
          </Button>
        </CardContent>
      </Card>

      {/* Recruiter / Contact Details */}
      <Card className="rounded-3xl border-slate-200/90 shadow-xs">
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="size-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">Key Contact</h4>
            </div>
            <Button variant="ghost" size="xs" onClick={onEditContact}>
              <Pencil className="size-3" />
              Edit
            </Button>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Name</span>
              <span className="font-semibold text-slate-800">
                {details.contact?.name || "—"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
              <span className="font-semibold text-slate-800 break-all">
                {details.contact?.email ? (
                  <a
                    href={`mailto:${details.contact.email}`}
                    className="text-indigo-600 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Mail className="size-3" />
                    {details.contact.email}
                  </a>
                ) : (
                  "—"
                )}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Destructive Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-center text-rose-600 hover:bg-rose-50 hover:text-rose-700"
        onClick={onDelete}
        disabled={isDeleting}
      >
        <Trash2 className="size-3.5" />
        {isDeleting ? "Deleting..." : "Delete Opportunity"}
      </Button>
    </aside>
  );
}
