"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { Input, Textarea } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/ui/confirm-modal";
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

  const [notesDraft, setNotesDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState<Job["status"]>("Saved");

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
  const mappedJob: Job | null = useMemo(() => {
    if (!rawJob) return null;
    return {
      id: rawJob.id,
      company: rawJob.company,
      role: rawJob.role,
      status: rawJob.status,
      when: toRelativeDayLabel(rawJob.createdAt),
      link: rawJob.link ?? undefined,
      location: rawJob.location ?? undefined,
    };
  }, [rawJob]);

  const details: JobDetail = useMemo(
    () => ({
      notes: rawJob?.notes ?? "",
      contact: {
        name: rawJob?.contactName ?? "",
        email: rawJob?.contactEmail ?? "",
      },
      rounds: toInterviewRounds(rawJob?.interviewRounds),
      followUp: rawJob?.followUp ?? "",
    }),
    [rawJob],
  );

  const [prevJobId, setPrevJobId] = useState<string | null>(null);
  if (rawJob && prevJobId !== rawJob.id) {
    setPrevJobId(rawJob.id);
    setNotesDraft(rawJob.notes ?? "");
    setStatusDraft(rawJob.status);
    setContactNameDraft(rawJob.contactName ?? "");
    setContactEmailDraft(rawJob.contactEmail ?? "");
    setRoundsDraft(toInterviewRounds(rawJob.interviewRounds));
  }

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
      await updateJob.mutateAsync({ status: statusDraft });
      await refreshQueries();
      toast({ tone: "success", message: "Status updated." });
    } catch {
      toast({ tone: "error", message: "Could not update status." });
    }
  }

  async function handleSaveNotes() {
    try {
      await updateJob.mutateAsync({ notes: notesDraft || null });
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
    <>
      <JobDetailsHeader job={mappedJob} onEditJob={() => setIsEditModalOpen(true)} />
      <AddJobModal
        open={isEditModalOpen}
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <JobDetailsMain
          details={details}
          notesValue={notesDraft}
          onNotesChange={setNotesDraft}
          onSaveNotes={handleSaveNotes}
          isSavingNotes={updateJob.isPending}
          onCopyNotes={handleCopyNotes}
          onEditRounds={() => setIsRoundsModalOpen(true)}
          status={statusDraft}
        />
        <JobDetailsSidebar
          details={details}
          status={statusDraft}
          onStatusChange={setStatusDraft}
          onSaveStatus={handleSaveStatus}
          isSavingStatus={updateJob.isPending}
          onSetFollowUp={handleSetFollowUp}
          isSettingFollowUp={updateJob.isPending}
          onEditContact={() => setIsContactModalOpen(true)}
          onDelete={handleDeleteJob}
          isDeleting={deleteJob.isPending}
        />
      </div>

      {/* Edit Contact Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Key Contact</DialogTitle>
            <DialogDescription>Update recruiter or hiring manager details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Contact Name</label>
              <Input
                value={contactNameDraft}
                onChange={(e) => setContactNameDraft(e.target.value)}
                placeholder="Recruiter or Referrer Name"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Contact Email</label>
              <Input
                type="email"
                value={contactEmailDraft}
                onChange={(e) => setContactEmailDraft(e.target.value)}
                placeholder="recruiter@company.com"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setIsContactModalOpen(false)} disabled={updateJob.isPending}>
              Cancel
            </Button>
            <Button onClick={handleSaveContact} disabled={updateJob.isPending}>
              {updateJob.isPending ? "Saving..." : "Save Contact"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Interview Rounds Modal */}
      <Dialog open={isRoundsModalOpen} onOpenChange={setIsRoundsModalOpen}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Interview Rounds</DialogTitle>
            <DialogDescription>Update the stages and statuses for this application pipeline.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            {roundsDraft.map((round, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={round.name}
                  onChange={(e) =>
                    setRoundsDraft((prev) =>
                      prev.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, name: e.target.value } : item,
                      ),
                    )
                  }
                  placeholder="Round Name (e.g. Technical Screen)"
                  className="flex-1"
                />
                <select
                  value={round.status}
                  onChange={(e) =>
                    setRoundsDraft((prev) =>
                      prev.map((item, itemIndex) =>
                        itemIndex === index
                          ? {
                              ...item,
                              status: e.target.value as "Done" | "Upcoming" | "Pending",
                            }
                          : item,
                      ),
                    )
                  }
                  className="h-10 rounded-xl border border-slate-200/90 bg-white px-3 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="Done">Done</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Pending">Pending</option>
                </select>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() =>
                    setRoundsDraft((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
                  }
                  className="text-slate-400 hover:text-rose-600"
                  title="Remove round"
                >
                  <Trash2 className="size-3.5" />
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
              <Plus className="size-3.5" />
              Add Round
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setIsRoundsModalOpen(false)} disabled={updateJob.isPending}>
              Cancel
            </Button>
            <Button onClick={handleSaveRounds} disabled={updateJob.isPending}>
              {updateJob.isPending ? "Saving..." : "Save Rounds"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Job Modal */}
      <ConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Job Opportunity?"
        description="This will permanently remove this job from your pipeline."
        confirmText="Delete Opportunity"
        isLoading={deleteJob.isPending}
        onConfirm={handleConfirmDeleteJob}
      />

      {/* Follow-up Date Modal */}
      <Dialog open={isFollowUpModalOpen} onOpenChange={setIsFollowUpModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Next Action Reminder</DialogTitle>
            <DialogDescription>Add a note or date to keep this opportunity active.</DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            <Textarea
              value={followUpDraft}
              onChange={(e) => setFollowUpDraft(e.target.value)}
              placeholder="e.g. Email recruiter for feedback next Monday"
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setIsFollowUpModalOpen(false)} disabled={updateJob.isPending}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSetFollowUp} disabled={updateJob.isPending}>
              {updateJob.isPending ? "Saving..." : "Save Reminder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
