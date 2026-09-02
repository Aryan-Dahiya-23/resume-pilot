"use client";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  DashboardOverviewHeader,
  DashboardMetrics,
  JobPipelineCard,
  NextActionsCard,
  ResumeOverviewCard,
  WeeklySnapshotCard,
} from "@/components/dashboard/dashboard-sections";
import { AddJobModal } from "@/components/dashboard/jobs-sections";
import {
  DashboardPageError,
  DashboardPageLoading,
} from "@/components/dashboard/page-state";
import { ResumeUploadModal } from "@/components/dashboard/resumes-sections";
import {
  useCreateJob,
  useDashboardOverview,
  useUploadResume,
} from "@/hooks/queries";
import type { Job, JobStatus, Resume } from "@/lib/mock-data";
import { queryKeys } from "@/lib/react-query/query-keys";

export function DashboardPageClient({}: Record<string, never>) {
  const queryClient = useQueryClient();
  const overviewQuery = useDashboardOverview();
  const uploadResume = useUploadResume();
  const createJob = useCreateJob();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [addJobModalOpen, setAddJobModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [roleTarget, setRoleTarget] = useState("Software Engineer");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const data = overviewQuery.data;
  const latestResume: Resume = data?.latestResume ?? {
    id: "",
    version: "v0",
    uploadedAt: "No uploads yet",
    score: 0,
    roleTarget: undefined,
    fileName: "No resume uploaded",
  };
  const delta = data?.delta ?? 0;
  const nextActions = data?.nextActions ?? [];
  const jobs = (data?.jobs ?? []) as Job[];
  const jobsByStatus = (data?.jobsByStatus ?? {
    Saved: 0,
    Applied: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  }) as Record<JobStatus, number>;
  const interviewRate = data?.interviewRate ?? 0;
  const weeklyJobsAdded = data?.weeklyJobsAdded ?? 0;
  const weeklyApplications = data?.weeklyApplications ?? 0;
  const weeklyInterviews = data?.weeklyInterviews ?? 0;
  const weeklySummary =
    data?.weeklySummary ??
    "Keep momentum this week with targeted applications and one resume refinement pass.";

  function openUploadModal() {
    setUploadError(null);
    setSelectedFile(null);
    uploadResume.reset();
    setUploadModalOpen(true);
  }

  async function handleStartUpload() {
    if (!selectedFile) {
      setUploadError("Please select a PDF or DOCX file.");
      return;
    }

    setUploadError(null);
    try {
      await uploadResume.mutateAsync({
        file: selectedFile,
        roleTarget,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.resumes.list() }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.overview(),
        }),
      ]);
      setUploadModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as { error?: string } | undefined)?.error ??
          "Upload failed. Please try again.";
        setUploadError(message);
      } else {
        setUploadError("Upload failed. Please try again.");
      }
    }
  }

  async function handleCreateJob(input: {
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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.list() }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.overview(),
        }),
      ]);
      setAddJobModalOpen(false);
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

  return (
    <>
      {overviewQuery.isLoading ? (
        <DashboardPageLoading label="Loading dashboard..." />
      ) : null}
      {overviewQuery.isError ? (
        <DashboardPageError
          title="Could not load dashboard"
          message="We could not fetch your dashboard data right now."
          onRetry={() => {
            void overviewQuery.refetch();
          }}
        />
      ) : null}

      {overviewQuery.isLoading || overviewQuery.isError ? null : (
        <div className="space-y-6 sm:space-y-8">
          <DashboardOverviewHeader
            onUploadClick={openUploadModal}
            onAddJobClick={() => setAddJobModalOpen(true)}
          />

          <DashboardMetrics
            score={latestResume.score}
            delta={delta}
            weeklyApplications={weeklyApplications}
            interviewRate={interviewRate}
            hasResume={Boolean(latestResume.id)}
          />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
            <ResumeOverviewCard
              latestResume={latestResume}
              delta={delta}
              nextActions={nextActions}
              onUploadResume={openUploadModal}
            />
            <NextActionsCard items={nextActions} />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
            <JobPipelineCard
              jobs={jobs}
              jobsByStatus={jobsByStatus}
              interviewRate={interviewRate}
            />
            <WeeklySnapshotCard
              jobsAdded={weeklyJobsAdded}
              applications={weeklyApplications}
              interviews={weeklyInterviews}
              summary={weeklySummary}
            />
          </div>
        </div>
      )}

      <ResumeUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        selectedFile={selectedFile}
        roleTarget={roleTarget}
        isUploading={uploadResume.isPending}
        uploadError={uploadError}
        uploadResult={uploadResume.data?.resume ?? null}
        onFileSelect={setSelectedFile}
        onRoleTargetChange={setRoleTarget}
        onStartUpload={handleStartUpload}
      />

      <AddJobModal
        open={addJobModalOpen}
        onClose={() => setAddJobModalOpen(false)}
        onSubmit={handleCreateJob}
        isSubmitting={createJob.isPending}
      />
    </>
  );
}
