"use client";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Briefcase, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { AddJobModal, JobsHeader, JobsTableSection } from "@/components/dashboard/jobs-sections";
import { DashboardPageError, DashboardPageLoading } from "@/components/dashboard/page-state";
import { useCreateJob, useDeleteJob, useJobs } from "@/hooks/queries";
import { getJob, updateJob } from "@/lib/api/jobs";
import type { JobStatus } from "@/lib/mock-data";
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

export default function JobsPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<JobStatus | "All">("All");
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobToDeleteId, setJobToDeleteId] = useState<string | null>(null);
  const [updatingJobId, setUpdatingJobId] = useState<string | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const jobsQuery = useJobs();
  const createJob = useCreateJob();
  const deleteJob = useDeleteJob();

  const rows = useMemo(() => {
    const search = query.trim().toLowerCase();
    const jobs = jobsQuery.data ?? [];

    return jobs
      .map((job) => ({
        id: job.id,
        company: job.company,
        role: job.role,
        status: job.status,
        when: toRelativeDayLabel(job.createdAt),
        link: job.link ?? undefined,
        location: job.location ?? undefined,
      }))
      .filter((job) => {
      const matchesStatus = status === "All" ? true : job.status === status;
      const matchesQuery = search
        ? [job.company, job.role, job.location ?? ""].join(" ").toLowerCase().includes(search)
        : true;

      return matchesStatus && matchesQuery;
    });
  }, [jobsQuery.data, query, status]);

  const editingJob = useMemo(
    () => (jobsQuery.data ?? []).find((job) => job.id === editingJobId) ?? null,
    [editingJobId, jobsQuery.data],
  );

  function handlePrefetchJob(jobId: string) {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.jobs.detail(jobId),
      queryFn: () => getJob(jobId),
      staleTime: 30 * 1000,
    });
  }

  async function handleCreateJob(input: {
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
      await createJob.mutateAsync({
        company: input.company,
        role: input.role,
        status: input.status,
        contactName: input.contactName || undefined,
        contactEmail: input.contactEmail || undefined,
        interviewRounds: input.interviewRounds,
        location: input.location || undefined,
        link: input.link || undefined,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.list(),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.overview(),
      });
      setIsAddJobOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          (error.response?.data as { error?: string } | undefined)?.error ??
            "Could not create job.",
        );
      }
      throw error;
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
    if (!editingJobId) return;
    setUpdatingJobId(editingJobId);
    try {
      await updateJob(editingJobId, {
        company: input.company,
        role: input.role,
        status: input.status,
        contactName: input.contactName || null,
        contactEmail: input.contactEmail || null,
        interviewRounds: input.interviewRounds,
        location: input.location || null,
        link: input.link || null,
      });
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.jobs.list(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.jobs.detail(editingJobId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.overview(),
        }),
      ]);
      setEditingJobId(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          (error.response?.data as { error?: string } | undefined)?.error ??
            "Could not update job.",
        );
      }
      throw error;
    } finally {
      setUpdatingJobId(null);
    }
  }

  async function handleDeleteJob(jobId: string) {
    setDeletingJobId(jobId);
    try {
      await deleteJob.mutateAsync(jobId);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.list(),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.overview(),
      });
      setJobToDeleteId(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(
          (error.response?.data as { error?: string } | undefined)?.error ??
            "Could not delete job.",
        );
      } else {
        alert("Could not delete job.");
      }
    } finally {
      setDeletingJobId(null);
    }
  }

  return (
    <>
      {jobsQuery.isLoading ? <DashboardPageLoading label="Loading jobs..." /> : null}
      {jobsQuery.isError ? (
        <DashboardPageError
          title="Could not load jobs"
          message="We could not fetch your jobs right now."
          onRetry={() => {
            void jobsQuery.refetch();
          }}
        />
      ) : null}

      {jobsQuery.isLoading || jobsQuery.isError ? null : (
        <>
          <JobsHeader onAddJobClick={() => setIsAddJobOpen(true)} />
          <AddJobModal
            open={isAddJobOpen}
            onClose={() => setIsAddJobOpen(false)}
            onSubmit={handleCreateJob}
            isSubmitting={createJob.isPending}
          />
          <AddJobModal
            open={Boolean(editingJob)}
            onClose={() => setEditingJobId(null)}
            onSubmit={handleEditJob}
            isSubmitting={updatingJobId === editingJobId && Boolean(editingJobId)}
            mode="edit"
            initialValues={
              editingJob
                ? {
                    company: editingJob.company,
                    role: editingJob.role,
                    status: editingJob.status,
                    contactName: editingJob.contactName ?? "",
                    contactEmail: editingJob.contactEmail ?? "",
                    interviewRounds: editingJob.interviewRounds ?? [],
                    location: editingJob.location ?? "",
                    link: editingJob.link ?? "",
                  }
                : undefined
            }
          />
          <JobsTableSection
            query={query}
            onQueryChange={setQuery}
            status={status}
            onStatusChange={setStatus}
            rows={rows}
            onEditJob={setEditingJobId}
            onRequestDeleteJob={setJobToDeleteId}
            updatingJobId={updatingJobId}
            deletingJobId={deletingJobId}
            onHoverJob={handlePrefetchJob}
          />
          {!jobsQuery.isLoading && rows.length === 0 ? (
            <section className="rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-zinc-100 text-zinc-700">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="mt-4 text-base font-semibold text-zinc-900">
                No jobs found
              </div>
              <div className="mt-1 text-sm text-zinc-600">
                Start tracking applications to build your pipeline and analytics.
              </div>
              <div className="mt-5">
                <button
                  className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                  onClick={() => setIsAddJobOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add job
                </button>
              </div>
            </section>
          ) : null}
        </>
      )}
      {jobToDeleteId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl">
            <div className="text-base font-semibold text-zinc-900">
              Delete Job?
            </div>
            <div className="mt-2 text-sm text-zinc-600">
              This will permanently remove this job from your tracker.
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                onClick={() => setJobToDeleteId(null)}
                disabled={deletingJobId === jobToDeleteId}
              >
                Cancel
              </button>
              <button
                className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-60"
                onClick={() => handleDeleteJob(jobToDeleteId)}
                disabled={deletingJobId === jobToDeleteId}
              >
                {deletingJobId === jobToDeleteId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
