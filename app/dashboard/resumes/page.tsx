"use client";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Upload } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      await queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.list(),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.overview(),
      });
      setUploadModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as { error?: string } | undefined)?.error ??
          "Upload failed. Please try again.";
        setUploadError(message);
        return;
      }
      setUploadError("Upload failed. Please try again.");
    }
  }

  async function handleDeleteResume() {
    if (!resumeToDelete) return;
    setIsDeletingResume(true);
    try {
      await axios.delete(`/api/resumes/${resumeToDelete}`, {
        withCredentials: true,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.resumes.list(),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.overview(),
      });
      setResumeToDelete(null);
    } finally {
      setIsDeletingResume(false);
    }
  }

  return (
    <>
      {isInitialLoading ? <DashboardPageLoading label="Loading resumes..." /> : null}
      {hasInitialError ? (
        <DashboardPageError
          title="Could not load resumes"
          message="We could not fetch your resumes right now."
          onRetry={() => {
            void resumesQuery.refetch();
          }}
        />
      ) : null}

      {isInitialLoading || hasInitialError ? null : (
        <>
          <div className="space-y-6 sm:space-y-8">
            <ResumesHeaderWithAction onUploadClick={handleUploadClick} />
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
              <section className="surface-card border-t-2 border-t-brand px-6 py-12 text-center sm:px-10">
                <FileText className="mx-auto size-5 text-brand" />
                <h2 className="mt-5 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
                  No resumes yet
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Upload your first resume to get an analysis, useful feedback,
                  and a clear version history.
                </p>
                <div className="mt-5">
                  <Button onClick={handleUploadClick}>
                    <Upload className="size-4" />
                    Upload resume
                  </Button>
                </div>
              </section>
            )}
            <ResumeScoreGuideCard />
          </div>
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
        </>
      )}

      <Dialog
        open={Boolean(resumeToDelete)}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isDeletingResume) setResumeToDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={!isDeletingResume}>
          <DialogHeader>
            <DialogTitle>Delete this resume?</DialogTitle>
            <DialogDescription>
              This permanently removes the resume, its parsed information, and
              review history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setResumeToDelete(null)}
              disabled={isDeletingResume}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteResume}
              disabled={isDeletingResume}
            >
              {isDeletingResume ? "Deleting…" : "Delete resume"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}
