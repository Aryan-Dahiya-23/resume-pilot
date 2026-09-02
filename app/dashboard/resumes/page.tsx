"use client";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import {
  DashboardPageError,
  DashboardPageLoading,
} from "@/components/dashboard/page-state";
import {
  ResumeUploadModal,
  ResumeScoreGuideCard,
  ResumesHeaderWithAction,
  ResumesTableSection,
} from "@/components/dashboard/resumes-sections";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useResumes, useUploadResume } from "@/hooks/queries";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getResumeDetails } from "@/lib/api/resumes";
import type { Resume } from "@/lib/mock-data";
import { queryKeys } from "@/lib/react-query/query-keys";

type ResumeStatusFilter = "All" | "UPLOADED" | "PARSING" | "REVIEWING" | "READY" | "FAILED";
type ResumeDateFilter = "All" | "today" | "7d" | "30d";

export default function ResumesPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ResumeStatusFilter>("All");
  const [dateFilter, setDateFilter] = useState<ResumeDateFilter>("All");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [roleTarget, setRoleTarget] = useState("Software Engineer");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [isDeletingResume, setIsDeletingResume] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 400);

  const resumesQuery = useResumes({
    q: debouncedQuery.trim() || undefined,
    status: statusFilter === "All" ? undefined : statusFilter,
    dateRange: dateFilter === "All" ? undefined : dateFilter,
  });

  const uploadResume = useUploadResume();
  const isInitialLoading = resumesQuery.isLoading && !resumesQuery.data;
  const hasInitialError = resumesQuery.isError && !resumesQuery.data;
  const hasAnyResumes = (resumesQuery.data?.totalCount ?? 0) > 0;

  const rows = useMemo<Array<Resume & { status?: string; createdAtIso: string }>>(() => {
    const source = resumesQuery.data?.resumes ?? [];
    return source.map((resume, index) => ({
      id: resume.id,
      version: `v${source.length - index}`,
      uploadedAt: new Date(resume.createdAt).toLocaleDateString(),
      score: resume.score ?? 0,
      roleTarget: resume.roleTarget ?? undefined,
      fileName: resume.fileName,
      status: resume.status,
      createdAtIso: resume.createdAt,
    }));
  }, [resumesQuery.data]);

  function handleUploadClick() {
    setUploadError(null);
    setSelectedFile(null);
    uploadResume.reset();
    setUploadModalOpen(true);
  }

  function handlePrefetchResume(resumeId: string) {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.resumes.detail(resumeId),
      queryFn: () => getResumeDetails(resumeId),
      staleTime: 30 * 1000,
    });
  }

  async function handleStartUpload() {
    if (!selectedFile) return;
    setUploadError(null);

    try {
      await uploadResume.mutateAsync({
        file: selectedFile,
        roleTarget: roleTarget.trim(),
      });
      void queryClient.invalidateQueries({ queryKey: ["resumes"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard", "overview"] });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setUploadError(
          err.response?.data?.message || err.response?.data?.error || "Failed to upload resume.",
        );
        return;
      }
      setUploadError("An unexpected error occurred during upload.");
    }
  }

  async function handleDeleteResume() {
    if (!resumeToDelete) return;
    setIsDeletingResume(true);
    try {
      await axios.delete(`/api/resumes/${resumeToDelete}`);
      void queryClient.invalidateQueries({ queryKey: ["resumes"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard", "overview"] });
      setResumeToDelete(null);
    } catch {
      // Keep state for error or retry
    } finally {
      setIsDeletingResume(false);
    }
  }

  return (
    <>
      {isInitialLoading ? (
        <DashboardPageLoading label="Loading resume library..." />
      ) : hasInitialError ? (
        <DashboardPageError
          title="Could not load resumes"
          message="There was an issue fetching your resume collection. Please try again."
          onRetry={() => resumesQuery.refetch()}
        />
      ) : (
        <>
          <ResumesHeaderWithAction onUploadClick={handleUploadClick} />

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

          <div className="space-y-6">
            {hasAnyResumes ? (
              <ResumesTableSection
                query={query}
                onQueryChange={setQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
                rows={rows}
                onDeleteResume={setResumeToDelete}
                deletingResumeId={isDeletingResume ? resumeToDelete : null}
                onHoverResume={handlePrefetchResume}
              />
            ) : (
              <Card className="rounded-3xl border-slate-200/90 shadow-xs">
                <CardContent className="py-12 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <FileText className="size-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    No Resumes Uploaded Yet
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                    Upload your first resume in PDF or Word format to receive instant ATS readiness scores and AI feedback.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <Button onClick={handleUploadClick}>
                      <Upload className="size-4" />
                      Upload First Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <ResumeScoreGuideCard />
          </div>
        </>
      )}

      <ConfirmModal
        open={Boolean(resumeToDelete)}
        onOpenChange={(open) => {
          if (!open) setResumeToDelete(null);
        }}
        title="Delete Resume Version?"
        description="This will permanently remove this resume version, its parsed content, and all associated AI feedback."
        confirmText="Delete Document"
        isLoading={isDeletingResume}
        onConfirm={handleDeleteResume}
      />
    </>
  );
}
