"use client";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AddJobModal, JobsHeader, JobsTableSection } from "@/components/dashboard/jobs-sections";
import { DashboardPageError, DashboardPageLoading } from "@/components/dashboard/page-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateJob, useDeleteJob, useJobs } from "@/hooks/queries";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
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

type JobDateFilter = "All" | "today" | "7d" | "30d";
const JOBS_PAGE_SIZE = 10;

export default function JobsPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "All">("All");
  const [dateFilter, setDateFilter] = useState<JobDateFilter>("All");
  const [page, setPage] = useState(1);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobToDeleteId, setJobToDeleteId] = useState<string | null>(null);
  const [updatingJobId, setUpdatingJobId] = useState<string | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query, 400);
  const jobsQuery = useJobs({
    q: debouncedQuery.trim() || undefined,
    status: statusFilter === "All" ? undefined : statusFilter,
    dateRange: dateFilter === "All" ? undefined : dateFilter,
    page,
    limit: JOBS_PAGE_SIZE,
  });
  const createJob = useCreateJob();
  const deleteJob = useDeleteJob();
  const isInitialLoading = jobsQuery.isLoading && !jobsQuery.data;
  const hasInitialError = jobsQuery.isError && !jobsQuery.data;
  const totalPages = jobsQuery.data?.totalPages ?? 1;

  const rows = useMemo(() => {
    if (jobsQuery.isFetching) return [];
    const jobs = jobsQuery.data?.jobs ?? [];
    return jobs.map((job) => ({
        id: job.id,
        company: job.company,
        role: job.role,
        status: job.status,
        when: toRelativeDayLabel(job.createdAt),
        link: job.link ?? undefined,
        location: job.location ?? undefined,
      }));
  }, [jobsQuery.data, jobsQuery.isFetching]);

  const editingJob = useMemo(
    () => (jobsQuery.data?.jobs ?? []).find((job) => job.id === editingJobId) ?? null,
    [editingJobId, jobsQuery.data],
  );

  function handlePageChange(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setPage(1);
  }

  function handleStatusFilterChange(value: JobStatus | "All") {
    setStatusFilter(value);
    setPage(1);
  }

  function handleDateFilterChange(value: JobDateFilter) {
    setDateFilter(value);
    setPage(1);
  }

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
      {isInitialLoading ? <DashboardPageLoading label="Loading jobs..." /> : null}
      {hasInitialError ? (
        <DashboardPageError
          title="Could not load jobs"
          message="We could not fetch your jobs right now."
          onRetry={() => {
            void jobsQuery.refetch();
          }}
        />
      ) : null}

      {isInitialLoading || hasInitialError ? null : (
        <div className="space-y-6 sm:space-y-8">
          <JobsHeader onAddJobClick={() => setIsAddJobOpen(true)} />
          <JobsTableSection
            query={query}
            onQueryChange={handleQueryChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            dateFilter={dateFilter}
            onDateFilterChange={handleDateFilterChange}
            rows={rows}
            onEditJob={setEditingJobId}
            onRequestDeleteJob={setJobToDeleteId}
            updatingJobId={updatingJobId}
            deletingJobId={deletingJobId}
            onHoverJob={handlePrefetchJob}
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoadingRows={jobsQuery.isFetching}
          />
        </div>
      )}
      {isAddJobOpen ? (
        <AddJobModal
          open
          onClose={() => setIsAddJobOpen(false)}
          onSubmit={handleCreateJob}
          isSubmitting={createJob.isPending}
        />
      ) : null}
      {editingJob ? (
        <AddJobModal
          open
          onClose={() => setEditingJobId(null)}
          onSubmit={handleEditJob}
          isSubmitting={updatingJobId === editingJobId && Boolean(editingJobId)}
          mode="edit"
          initialValues={{
            company: editingJob.company,
            role: editingJob.role,
            status: editingJob.status,
            contactName: editingJob.contactName ?? "",
            contactEmail: editingJob.contactEmail ?? "",
            interviewRounds: editingJob.interviewRounds ?? [],
            location: editingJob.location ?? "",
            link: editingJob.link ?? "",
          }}
        />
      ) : null}
      <Dialog
        open={Boolean(jobToDeleteId)}
        onOpenChange={(isOpen) => {
          if (!isOpen && deletingJobId !== jobToDeleteId) setJobToDeleteId(null);
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={deletingJobId !== jobToDeleteId}>
          <DialogHeader>
            <DialogTitle>Delete this job?</DialogTitle>
            <DialogDescription>
              This permanently removes the opportunity from your pipeline.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setJobToDeleteId(null)}
              disabled={deletingJobId === jobToDeleteId}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => jobToDeleteId && handleDeleteJob(jobToDeleteId)}
              disabled={deletingJobId === jobToDeleteId}
            >
              {deletingJobId === jobToDeleteId ? "Deleting…" : "Delete job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
