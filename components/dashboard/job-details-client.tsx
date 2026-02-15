"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    if (!rawJob) return;
    setNotesDraft(rawJob.notes ?? "");
    setStatusDraft(rawJob.status);
    setContactNameDraft(rawJob.contactName ?? "");
    setContactEmailDraft(rawJob.contactEmail ?? "");
    setRoundsDraft(toInterviewRounds(rawJob.interviewRounds));
  }, [rawJob?.id, rawJob?.notes, rawJob?.status]);

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

      {isContactModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl">
            <div className="text-base font-semibold text-zinc-900">Edit contact</div>
            <div className="mt-1 text-sm text-zinc-600">Update recruiter details.</div>
            <div className="mt-4 grid grid-cols-1 gap-3">
              <div>
                <label className="text-xs font-medium text-zinc-600">Contact name</label>
                <input
                  value={contactNameDraft}
                  onChange={(event) => setContactNameDraft(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  placeholder="Recruiter name"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-600">Contact email</label>
                <input
                  value={contactEmailDraft}
                  onChange={(event) => setContactEmailDraft(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  placeholder="recruiter@company.com"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                onClick={() => setIsContactModalOpen(false)}
                disabled={updateJob.isPending}
              >
                Cancel
              </button>
              <button
                className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                onClick={handleSaveContact}
                disabled={updateJob.isPending}
              >
                {updateJob.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isRoundsModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
          <div className="w-full max-w-xl rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl">
            <div className="text-base font-semibold text-zinc-900">Edit interview rounds</div>
            <div className="mt-1 text-sm text-zinc-600">Update your current interview pipeline.</div>
            <div className="mt-4 space-y-2">
              {roundsDraft.map((round, index) => (
                <div key={index} className="grid grid-cols-[1fr_140px_40px] gap-2">
                  <input
                    value={round.name}
                    onChange={(event) =>
                      setRoundsDraft((prev) =>
                        prev.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, name: event.target.value } : item,
                        ),
                      )
                    }
                    className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
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
                    className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  >
                    <option>Done</option>
                    <option>Upcoming</option>
                    <option>Pending</option>
                  </select>
                  <button
                    className="rounded-2xl border border-zinc-200 bg-white px-2 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
                    onClick={() =>
                      setRoundsDraft((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
              <Button
                variant="secondary"
                className="px-3"
                onClick={() =>
                  setRoundsDraft((prev) => [...prev, { name: "", status: "Pending" }])
                }
              >
                Add round
              </Button>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                onClick={() => setIsRoundsModalOpen(false)}
                disabled={updateJob.isPending}
              >
                Cancel
              </button>
              <button
                className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                onClick={handleSaveRounds}
                disabled={updateJob.isPending}
              >
                {updateJob.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isDeleteModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl">
            <div className="text-base font-semibold text-zinc-900">Delete Job?</div>
            <div className="mt-2 text-sm text-zinc-600">
              This will permanently remove this job from your tracker.
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleteJob.isPending}
              >
                Cancel
              </button>
              <button
                className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-60"
                onClick={handleConfirmDeleteJob}
                disabled={deleteJob.isPending}
              >
                {deleteJob.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isFollowUpModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl">
            <div className="text-base font-semibold text-zinc-900">Set Follow-up</div>
            <div className="mt-2 text-sm text-zinc-600">
              Add a reminder note for your next action.
            </div>
            <textarea
              value={followUpDraft}
              onChange={(event) => setFollowUpDraft(event.target.value)}
              placeholder="e.g., Follow up next Tuesday"
              className="mt-4 min-h-[100px] w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 outline-none focus:border-zinc-400"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                onClick={() => setIsFollowUpModalOpen(false)}
                disabled={updateJob.isPending}
              >
                Cancel
              </button>
              <button
                className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                onClick={handleConfirmSetFollowUp}
                disabled={updateJob.isPending}
              >
                {updateJob.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
