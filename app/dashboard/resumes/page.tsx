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
import { useResumes, useUploadResume } from "@/hooks/queries";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getResumeDetails } from "@/lib/api/resumes";
import type { Resume } from "@/lib/mock-data";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { queryKeys } from "@/lib/react-query/query-keys";

type ResumeStatusFilter =
  | "All"
  | "UPLOADED"
  | "PARSING"
  | "REVIEWING"
  | "READY"
  | "FAILED";
type ResumeDateFilter = "All" | "today" | "7d" | "30d";

export default function ResumesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
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

  const rows = useMemo<
    Array<Resume & { status?: string; createdAtIso: string }>
  >(() => {
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
      toast({ tone: "success", message: "Resume deleted." });
    } catch {
      toast({
        tone: "error",
        message: "Could not delete this resume. Please try again.",
      });
    } finally {
      setIsDeletingResume(false);
    }
  }

  return (
    <>
      {isInitialLoading ? (
        <DashboardPageLoading label="Loading resumes..." />
      ) : null}
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
              <section className="panel empty-state">
                <div className="icon-tile">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="mt-4 text-base font-semibold text-zinc-900">
                  A stronger story starts here.
                </div>
                <div className="mt-1 text-sm text-zinc-600">
                  Upload your resume for specific feedback, clearer language,
                  and a practical next step.
                </div>
                <div className="mt-5">
                  <button
                    className="button button-primary"
                    onClick={handleUploadClick}
                  >
                    <Upload className="h-4 w-4" />
                    Upload resume
                  </button>
                </div>
              </section>
            )}
            <ResumeScoreGuideCard />
          </div>
        </>
      )}

      <Modal
        open={Boolean(resumeToDelete)}
        onClose={() => setResumeToDelete(null)}
        title="Delete this resume?"
        description="This permanently removes the file and its review history. Other versions will stay in your library."
        busy={isDeletingResume}
      >
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setResumeToDelete(null)}
            disabled={isDeletingResume}
          >
            Keep resume
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteResume}
            disabled={isDeletingResume}
          >
            {isDeletingResume ? "Deleting…" : "Delete resume"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
