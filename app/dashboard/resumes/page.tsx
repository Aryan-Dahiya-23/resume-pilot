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
import { getResumeDetails } from "@/lib/api/resumes";
import type { Resume } from "@/lib/mock-data";
import { queryKeys } from "@/lib/react-query/query-keys";

export default function ResumesPage() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [roleTarget, setRoleTarget] = useState("Software Engineer");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [isDeletingResume, setIsDeletingResume] = useState(false);
  const resumesQuery = useResumes();
  const uploadResume = useUploadResume();

  const rows = useMemo<Array<Resume & { status?: string }>>(() => {
    const source = resumesQuery.data ?? [];
    const mappedRows = source.map((resume, index) => ({
      id: resume.id,
      version: `v${source.length - index}`,
      uploadedAt: new Date(resume.createdAt).toLocaleDateString(),
      score: resume.score ?? 0,
      roleTarget: resume.roleTarget ?? undefined,
      fileName: resume.fileName,
      status: resume.status,
    }));

    const search = query.trim().toLowerCase();
    if (!search) return mappedRows;

    return mappedRows.filter((resume) =>
      [resume.version, resume.fileName, resume.roleTarget ?? "", resume.status ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [query, resumesQuery.data]);

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
      {resumesQuery.isLoading ? <DashboardPageLoading label="Loading resumes..." /> : null}
      {resumesQuery.isError ? (
        <DashboardPageError
          title="Could not load resumes"
          message="We could not fetch your resumes right now."
          onRetry={() => {
            void resumesQuery.refetch();
          }}
        />
      ) : null}

      {resumesQuery.isLoading || resumesQuery.isError ? null : (
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
            {rows.length > 0 ? (
              <ResumesTableSection
                query={query}
                onQueryChange={setQuery}
                rows={rows}
                onDeleteResume={setResumeToDelete}
                deletingResumeId={isDeletingResume ? resumeToDelete : null}
                onHoverResume={handlePrefetchResume}
              />
            ) : (
              <section className="rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-zinc-100 text-zinc-700">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="mt-4 text-base font-semibold text-zinc-900">
                  No resumes yet
                </div>
                <div className="mt-1 text-sm text-zinc-600">
                  Upload your first resume to start AI analysis and version tracking.
                </div>
                <div className="mt-5">
                  <button
                    className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
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

      {resumeToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl">
            <div className="text-base font-semibold text-zinc-900">
              Delete Resume?
            </div>
            <div className="mt-2 text-sm text-zinc-600">
              This will permanently remove the resume and its parsed/reviewed data.
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                onClick={() => setResumeToDelete(null)}
                disabled={isDeletingResume}
              >
                Cancel
              </button>
              <button
                className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-60"
                onClick={handleDeleteResume}
                disabled={isDeletingResume}
              >
                {isDeletingResume ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

    </>
  );
}
