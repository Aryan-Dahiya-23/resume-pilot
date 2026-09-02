"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddJobModal } from "@/components/dashboard/jobs-sections";
import { DashboardPageError, DashboardPageLoading } from "@/components/dashboard/page-state";
import { useToast } from "@/components/providers/toast-provider";
import {
  JobDetailsHeader,
  JobDetailsMain,
  JobDetailsSidebar,
} from "@/components/dashboard/job-details-sections";
import { useDeleteJob, useJob, useUpdateJob } from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Job, JobDetail, JobStatus } from "@/lib/mock-data";
import { queryKeys } from "@/lib/react-query/query-keys";

function toRelativeDayLabel(dateInput: string) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfInputDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffMs = startOfToday.getTime() - startOfInputDay.getTime();
  const dayDiff = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (dayDiff <= 0) return "Today";
  if (dayDiff === 1) return "Yesterday";
  if (dayDiff < 7) return `${dayDiff} days ago`;

  const weekDiff = Math.floor(dayDiff / 7);
  if (weekDiff === 1) return "1 week ago";
  return `${weekDiff} weeks ago`;
}

function toInterviewRounds(value: unknown): JobDetail["rounds"] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const name = (item as { name?: unknown }).name;
      const status = (item as { status?: unknown }).status;
      if (typeof name !== "string") return null;
      if (status !== "Done" && status !== "Upcoming" && status !== "Pending") {
        return null;
      }
      return { name, status };
    })
    .filter(
      (item): item is { name: string; status: "Done" | "Upcoming" | "Pending" } =>
        Boolean(item),
    );
}

export function JobDetailsClient({ jobId }: { jobId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const jobQuery = useJob(jobId);
  const updateJob = useUpdateJob(jobId);
  const deleteJob = useDeleteJob();

  const [notesDraft, setNotesDraft] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<Job["status"] | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isRoundsModalOpen, setIsRoundsModalOpen] = useState(false);

  const [followUpDraft, setFollowUpDraft] = useState("");
  const [contactNameDraft, setContactNameDraft] = useState("");
  const [contactEmailDraft, setContactEmailDraft] = useState("");
  const [roundsDraft, setRoundsDraft] = useState<
    Array<{ name: string; status: "Done" | "Upcoming" | "Pending" }>
  >([]);
  const { toast } = useToast();

  const rawJob = jobQuery.data;
  const mappedJob: Job | null = rawJob
    ? {
        id: rawJob.id,
        company: rawJob.company,
        role: rawJob.role,
        status: rawJob.status,
        when: toRelativeDayLabel(rawJob.createdAt),
        link: rawJob.link ?? undefined,
        location: rawJob.location ?? undefined,
      }
    : null;

  const details: JobDetail = {
    notes: rawJob?.notes ?? "",
    contact: {
      name: rawJob?.contactName ?? "",
      email: rawJob?.contactEmail ?? "",
    },
    rounds: toInterviewRounds(rawJob?.interviewRounds),
    followUp: rawJob?.followUp ?? "",
  };
  const currentNotes = notesDraft ?? details.notes;
  const currentStatus = statusDraft ?? rawJob?.status ?? "Saved";

  async function refreshQueries() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.list() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(jobId) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview() }),
    ]);
  }

  async function handleCopyNotes(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast({ tone: "success", message: "Copied notes to clipboard." });
    } catch {
      toast({ tone: "error", message: "Could not copy notes." });
    }
  }

  async function handleSaveStatus() {
    try {
      await updateJob.mutateAsync({ status: currentStatus });
      await refreshQueries();
      toast({ tone: "success", message: "Status updated." });
    } catch {
      toast({ tone: "error", message: "Could not update status." });
    }
  }

  async function handleSaveNotes() {
    try {
      await updateJob.mutateAsync({ notes: currentNotes || null });
      await refreshQueries();
      toast({ tone: "success", message: "Notes saved." });
    } catch {
      toast({ tone: "error", message: "Could not save notes." });
    }
  }

  function handleDeleteJob() {
    setIsDeleteModalOpen(true);
  }

  async function handleConfirmDeleteJob() {
    try {
      await deleteJob.mutateAsync(jobId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.list() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview() }),
      ]);
      toast({ tone: "success", message: "Job deleted." });
      setIsDeleteModalOpen(false);
      router.push("/dashboard/jobs");
    } catch {
      toast({ tone: "error", message: "Could not delete job." });
    }
  }

  function handleSetFollowUp() {
    setFollowUpDraft(rawJob?.followUp ?? "");
    setIsFollowUpModalOpen(true);
  }

  function handleEditContact() {
    setContactNameDraft(rawJob?.contactName ?? "");
    setContactEmailDraft(rawJob?.contactEmail ?? "");
    setIsContactModalOpen(true);
  }

  function handleEditRounds() {
    setRoundsDraft(toInterviewRounds(rawJob?.interviewRounds));
    setIsRoundsModalOpen(true);
  }

  async function handleConfirmSetFollowUp() {
    try {
      await updateJob.mutateAsync({ followUp: followUpDraft.trim() || null });
      await refreshQueries();
      setIsFollowUpModalOpen(false);
      toast({ tone: "success", message: "Follow-up updated." });
    } catch {
      toast({ tone: "error", message: "Could not update follow-up." });
    }
  }

  async function handleEditJob(input: {
    company: string;
    role: string;
    status: JobStatus;
    contactName: string;
    contactEmail: string;
    interviewRounds: Array<{ name: string; status: "Done" | "Upcoming" | "Pending" }>;
    location: string;
    link: string;
  }) {
    try {
      await updateJob.mutateAsync({
        company: input.company,
        role: input.role,
        status: input.status,
        contactName: input.contactName || null,
        contactEmail: input.contactEmail || null,
        interviewRounds: input.interviewRounds,
        location: input.location || null,
        link: input.link || null,
      });
      await refreshQueries();
      setIsEditModalOpen(false);
      toast({ tone: "success", message: "Job updated." });
    } catch {
      throw new Error("Could not update job.");
    }
  }

  async function handleSaveContact() {
    try {
      await updateJob.mutateAsync({
        contactName: contactNameDraft.trim() || null,
        contactEmail: contactEmailDraft.trim() || null,
      });
      await refreshQueries();
      setIsContactModalOpen(false);
      toast({ tone: "success", message: "Contact updated." });
    } catch {
      toast({ tone: "error", message: "Could not update contact." });
    }
  }

  async function handleSaveRounds() {
    try {
      await updateJob.mutateAsync({
        interviewRounds: roundsDraft.filter((round) => round.name.trim()),
      });
      await refreshQueries();
      setIsRoundsModalOpen(false);
      toast({ tone: "success", message: "Interview rounds updated." });
    } catch {
      toast({ tone: "error", message: "Could not update interview rounds." });
    }
  }

  if (jobQuery.isLoading) {
    return <DashboardPageLoading label="Loading job details..." />;
  }

  if (jobQuery.isError || !mappedJob) {
    return (
      <DashboardPageError
        title="Could not load this job"
        message="We could not fetch job details right now."
        onRetry={() => {
          void jobQuery.refetch();
        }}
      />
    );
  }

  const currentJob = rawJob!;

  return (
    <div className="space-y-6 sm:space-y-8">
      <JobDetailsHeader job={mappedJob} onEditJob={() => setIsEditModalOpen(true)} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <JobDetailsMain
          details={details}
          notesValue={currentNotes}
          onNotesChange={setNotesDraft}
          onSaveNotes={handleSaveNotes}
          isSavingNotes={updateJob.isPending}
          onCopyNotes={handleCopyNotes}
          onEditRounds={handleEditRounds}
        />
        <JobDetailsSidebar
          details={details}
          status={currentStatus}
          onStatusChange={setStatusDraft}
          onSaveStatus={handleSaveStatus}
          isSavingStatus={updateJob.isPending}
          onSetFollowUp={handleSetFollowUp}
          isSettingFollowUp={updateJob.isPending}
          onEditContact={handleEditContact}
          onDelete={handleDeleteJob}
          isDeleting={deleteJob.isPending}
        />
      </div>

      {isEditModalOpen ? (
        <AddJobModal
          open
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditJob}
          isSubmitting={updateJob.isPending}
          mode="edit"
          initialValues={{
            company: currentJob.company,
            role: currentJob.role,
            status: currentJob.status,
            contactName: currentJob.contactName ?? "",
            contactEmail: currentJob.contactEmail ?? "",
            interviewRounds: currentJob.interviewRounds ?? [],
            location: currentJob.location ?? "",
            link: currentJob.link ?? "",
          }}
        />
      ) : null}

      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit contact</DialogTitle>
            <DialogDescription>Update the recruiter or hiring contact details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <label className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              Contact name
              <input
                value={contactNameDraft}
                onChange={(event) => setContactNameDraft(event.target.value)}
                className="mt-2 h-10 w-full rounded-lg border border-input bg-card px-3 text-sm font-normal text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/15"
                placeholder="Recruiter name"
              />
            </label>
            <label className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              Contact email
              <input
                type="email"
                value={contactEmailDraft}
                onChange={(event) => setContactEmailDraft(event.target.value)}
                className="mt-2 h-10 w-full rounded-lg border border-input bg-card px-3 text-sm font-normal text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/15"
                placeholder="recruiter@company.com"
              />
            </label>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsContactModalOpen(false)} disabled={updateJob.isPending}>
              Cancel
            </Button>
            <Button onClick={handleSaveContact} disabled={updateJob.isPending}>
              {updateJob.isPending ? "Saving…" : "Save contact"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRoundsModalOpen} onOpenChange={setIsRoundsModalOpen}>
        <DialogContent className="max-h-[90dvh] max-w-xl overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit interview rounds</DialogTitle>
            <DialogDescription>Update the current interview path for this role.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
              {roundsDraft.map((round, index) => (
                <div key={index} className="grid grid-cols-[minmax(0,1fr)_120px_36px] gap-2">
                  <input
                    value={round.name}
                    onChange={(event) =>
                      setRoundsDraft((prev) =>
                        prev.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, name: event.target.value } : item,
                        ),
                      )
                    }
                    className="h-10 min-w-0 rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/15"
                    placeholder="Technical round"
                  />
                  <select
                    value={round.status}
                    onChange={(event) =>
                      setRoundsDraft((prev) =>
                        prev.map((item, itemIndex) =>
                          itemIndex === index
                            ? {
                                ...item,
                                status: event.target.value as "Done" | "Upcoming" | "Pending",
                              }
                            : item,
                        ),
                      )
                    }
                    className="h-10 rounded-lg border border-input bg-card px-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/15"
                  >
                    <option>Done</option>
                    <option>Upcoming</option>
                    <option>Pending</option>
                  </select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() =>
                      setRoundsDraft((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
                    }
                    aria-label={`Remove round ${index + 1}`}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setRoundsDraft((prev) => [...prev, { name: "", status: "Pending" }])
                }
              >
                Add round
              </Button>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsRoundsModalOpen(false)} disabled={updateJob.isPending}>
              Cancel
            </Button>
            <Button onClick={handleSaveRounds} disabled={updateJob.isPending}>
              {updateJob.isPending ? "Saving…" : "Save rounds"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen && !deleteJob.isPending) setIsDeleteModalOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={!deleteJob.isPending}>
          <DialogHeader>
            <DialogTitle>Delete this job?</DialogTitle>
            <DialogDescription>
              This permanently removes the opportunity from your tracker.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={deleteJob.isPending}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDeleteJob} disabled={deleteJob.isPending}>
              {deleteJob.isPending ? "Deleting…" : "Delete job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isFollowUpModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen && !updateJob.isPending) setIsFollowUpModalOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={!updateJob.isPending}>
          <DialogHeader>
            <DialogTitle>Set a follow-up</DialogTitle>
            <DialogDescription>
              Write a simple reminder for the next action on this opportunity.
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={followUpDraft}
            onChange={(event) => setFollowUpDraft(event.target.value)}
            placeholder="For example: follow up next Tuesday"
            className="min-h-[110px] w-full resize-y rounded-lg border border-input bg-muted/25 p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsFollowUpModalOpen(false)} disabled={updateJob.isPending}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSetFollowUp} disabled={updateJob.isPending}>
              {updateJob.isPending ? "Saving…" : "Save follow-up"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
