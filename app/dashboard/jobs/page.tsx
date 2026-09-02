"use client";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Briefcase, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AddJobModal, JobsHeader, JobsTableSection } from "@/components/dashboard/jobs-sections";
import { DashboardPageError, DashboardPageLoading } from "@/components/dashboard/page-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useToast } from "@/components/providers/toast-provider";
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
  if (dayDiff < 7) return `${dayDiff}d ago`;

  const weekDiff = Math.floor(dayDiff / 7);
  if (weekDiff === 1) return "1w ago";
  return `${weekDiff}w ago`;
}

type JobDateFilter = "All" | "today" | "7d" | "30d";
const JOBS_PAGE_SIZE = 10;

export default function JobsPage() {
  const { toast } = useToast();
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
  const hasAnyJobs = (jobsQuery.data?.totalCount ?? 0) > 0;
  const totalPages = jobsQuery.data?.totalPages ?? 1;

  const [prevFilterKey, setPrevFilterKey] = useState(
    `${debouncedQuery}-${statusFilter}-${dateFilter}`,
  );
  const currentFilterKey = `${debouncedQuery}-${statusFilter}-${dateFilter}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setPage(1);
  }

  const rows = useMemo(() => {
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
  }, [jobsQuery.data]);

  const editingJob = useMemo(
    () => (jobsQuery.data?.jobs ?? []).find((job) => job.id === editingJobId) ?? null,
    [editingJobId, jobsQuery.data],
  );

  function handlePageChange(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
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
      await createJob.mutateAsync(input);
      setIsAddJobOpen(false);
      toast({ tone: "success", message: `Opportunity at ${input.company} tracked.` });
    } catch {
      toast({ tone: "error", message: "Failed to create job opportunity." });
    }
  }

  async function handleUpdateJob(input: {
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
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        interviewRounds: input.interviewRounds,
        location: input.location,
        link: input.link,
      });

      await queryClient.invalidateQueries({ queryKey: ["jobs"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "overview"] });
      setEditingJobId(null);
      toast({ tone: "success", message: "Opportunity updated." });
    } catch {
      toast({ tone: "error", message: "Failed to update opportunity." });
    } finally {
      setUpdatingJobId(null);
    }
  }

  async function handleDeleteJob(jobId: string) {
    setDeletingJobId(jobId);
    try {
      await deleteJob.mutateAsync(jobId);
      setJobToDeleteId(null);
      toast({ tone: "success", message: "Opportunity deleted." });
    } catch {
      toast({ tone: "error", message: "Failed to delete opportunity." });
    } finally {
      setDeletingJobId(null);
    }
  }

  return (
    <>
      {isInitialLoading ? (
        <DashboardPageLoading label="Loading application pipeline..." />
      ) : hasInitialError ? (
        <DashboardPageError
          title="Could not load job tracker"
          message="Failed to fetch your saved jobs and applications. Please try again."
          onRetry={() => jobsQuery.refetch()}
        />
      ) : (
        <>
          <JobsHeader onAddJobClick={() => setIsAddJobOpen(true)} />

          <AddJobModal
            open={isAddJobOpen || Boolean(editingJobId)}
            onClose={() => {
              setIsAddJobOpen(false);
              setEditingJobId(null);
            }}
            mode={editingJobId ? "edit" : "create"}
            onSubmit={editingJobId ? handleUpdateJob : handleCreateJob}
            isSubmitting={createJob.isPending || updatingJobId !== null}
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
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
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

          {!jobsQuery.isLoading && !hasAnyJobs ? (
            <Card className="rounded-3xl border-slate-200/90 shadow-xs">
              <CardContent className="py-12 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Briefcase className="size-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No Job Applications Yet
                </h3>
                <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                  Track your job search like a high-performance sales pipeline. Log applications and monitor interview invitations.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button onClick={() => setIsAddJobOpen(true)}>
                    <Plus className="size-4" />
                    Track First Opportunity
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </>
      )}

      <ConfirmModal
        open={Boolean(jobToDeleteId)}
        onOpenChange={(open) => {
          if (!open) setJobToDeleteId(null);
        }}
        title="Delete Job Opportunity?"
        description="This will remove this job and its interview stage history from your pipeline."
        confirmText="Delete Opportunity"
        isLoading={deletingJobId !== null}
        onConfirm={() => {
          if (jobToDeleteId) void handleDeleteJob(jobToDeleteId);
        }}
      />
    </>
  );
}
