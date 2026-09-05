"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  AddJobModal,
  RoundsEditor,
} from "@/components/dashboard/jobs-sections";
import {
  DashboardPageError,
  DashboardPageLoading,
} from "@/components/dashboard/page-state";
import { useToast } from "@/components/providers/toast-provider";
import {
  JobDetailsHeader,
  JobDetailsMain,
  JobDetailsSidebar,
} from "@/components/dashboard/job-details-sections";
import { useDeleteJob, useJob, useUpdateJob } from "@/hooks/queries";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import type { Job, JobDetail, JobStatus } from "@/lib/mock-data";
import { queryKeys } from "@/lib/react-query/query-keys";

function toRelativeDayLabel(dateInput: string) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfInputDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
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
      (
        item,
      ): item is { name: string; status: "Done" | "Upcoming" | "Pending" } =>
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

  async function refreshQueries() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.list() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(jobId) }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.overview(),
      }),
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
      await updateJob.mutateAsync({
        status: statusDraft ?? rawJob?.status ?? "Saved",
      });
      await refreshQueries();
      toast({ tone: "success", message: "Status updated." });
    } catch {
      toast({ tone: "error", message: "Could not update status." });
    }
  }

  async function handleSaveNotes() {
    try {
      await updateJob.mutateAsync({
        notes: (notesDraft ?? rawJob?.notes) || null,
      });
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
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.overview(),
        }),
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
    interviewRounds: Array<{
      name: string;
      status: "Done" | "Upcoming" | "Pending";
    }>;
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
      <JobDetailsHeader
        job={mappedJob}
        onEditJob={() => setIsEditModalOpen(true)}
      />
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

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <JobDetailsMain
          details={details}
          notesValue={notesDraft ?? rawJob?.notes ?? ""}
          onNotesChange={setNotesDraft}
          onSaveNotes={handleSaveNotes}
          isSavingNotes={updateJob.isPending}
          onCopyNotes={handleCopyNotes}
          onEditRounds={() => {
            setRoundsDraft(toInterviewRounds(rawJob?.interviewRounds));
            setIsRoundsModalOpen(true);
          }}
        />
        <JobDetailsSidebar
          details={details}
          status={statusDraft ?? rawJob?.status}
          onStatusChange={setStatusDraft}
          onSaveStatus={handleSaveStatus}
          isSavingStatus={updateJob.isPending}
          onSetFollowUp={handleSetFollowUp}
          isSettingFollowUp={updateJob.isPending}
          onEditContact={() => {
            setContactNameDraft(rawJob?.contactName ?? "");
            setContactEmailDraft(rawJob?.contactEmail ?? "");
            setIsContactModalOpen(true);
          }}
          onDelete={handleDeleteJob}
          isDeleting={deleteJob.isPending}
        />
      </div>

      <Modal
        open={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="The right person, close at hand."
        description="Keep your recruiter or hiring manager’s details with this opportunity."
        busy={updateJob.isPending}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSaveContact();
          }}
        >
          <fieldset disabled={updateJob.isPending} className="space-y-4">
            <div>
              <Label htmlFor="contact-name" className="field-label">
                Contact name
              </Label>
              <Input
                id="contact-name"
                className="field-input"
                value={contactNameDraft}
                onChange={(e) => setContactNameDraft(e.target.value)}
                placeholder="Recruiter or hiring manager"
              />
            </div>
            <div>
              <Label htmlFor="contact-email" className="field-label">
                Contact email
              </Label>
              <Input
                id="contact-email"
                type="email"
                className="field-input"
                value={contactEmailDraft}
                onChange={(e) => setContactEmailDraft(e.target.value)}
                placeholder="name@company.com"
              />
            </div>
          </fieldset>
          <div className="form-footer">
            <Button
              variant="secondary"
              onClick={() => setIsContactModalOpen(false)}
              disabled={updateJob.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateJob.isPending}>
              {updateJob.isPending ? "Saving…" : "Save contact"}
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        open={isRoundsModalOpen}
        onClose={() => setIsRoundsModalOpen(false)}
        title="Your interview journey."
        description="Add the conversations ahead and track each round as you go."
        busy={updateJob.isPending}
      >
        <fieldset disabled={updateJob.isPending}>
          <RoundsEditor rounds={roundsDraft} onChange={setRoundsDraft} />
        </fieldset>
        <div className="form-footer">
          <Button
            variant="secondary"
            onClick={() => setIsRoundsModalOpen(false)}
            disabled={updateJob.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveRounds} disabled={updateJob.isPending}>
            {updateJob.isPending ? "Saving…" : "Save rounds"}
          </Button>
        </div>
      </Modal>
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Remove this opportunity?"
        description="This permanently deletes this job, its notes, contacts, and interview details."
        busy={deleteJob.isPending}
      >
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={deleteJob.isPending}
          >
            Keep it
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDeleteJob}
            disabled={deleteJob.isPending}
          >
            {deleteJob.isPending ? "Deleting…" : "Delete job"}
          </Button>
        </div>
      </Modal>
      <Modal
        open={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        title="Keep the conversation going."
        description="Leave yourself a note about when and how to follow up. This doesn’t schedule a notification."
        busy={updateJob.isPending}
      >
        <Label htmlFor="follow-up-note" className="field-label">
          Your next step
        </Label>
        <Textarea
          id="follow-up-note"
          className="field-input min-h-[120px] !text-sm !leading-7"
          disabled={updateJob.isPending}
          value={followUpDraft}
          onChange={(e) => setFollowUpDraft(e.target.value)}
          placeholder="e.g. Check in with the recruiter on Tuesday about next steps."
        />
        <div className="form-footer">
          <Button
            variant="secondary"
            onClick={() => setIsFollowUpModalOpen(false)}
            disabled={updateJob.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSetFollowUp}
            disabled={updateJob.isPending}
          >
            {updateJob.isPending ? "Saving…" : "Save follow-up"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
