"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Download,
  FileText,
  Filter,
  Loader2,
  Lightbulb,
  Search,
  Trash2,
  X,
  Upload,
  Wand2,
} from "lucide-react";
import { useState, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import type { UploadResumeResponse } from "@/lib/api/resumes";
import type { Resume } from "@/lib/mock-data";

export function ResumesHeader() {
  return <ResumesHeaderWithAction />;
}

export function ResumesHeaderWithAction({
  onUploadClick,
}: {
  onUploadClick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm text-zinc-500">Resumes</div>
        <h1 className="text-xl font-semibold text-zinc-900">
          All resume versions
        </h1>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={onUploadClick}>
          <Upload className="h-4 w-4" />
          Upload new
        </Button>
      </div>
    </div>
  );
}

export function ResumesTableSection({
  query,
  onQueryChange,
  rows,
  onDeleteResume,
  deletingResumeId,
  onHoverResume,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  rows: Array<Resume & { status?: string }>;
  onDeleteResume?: (resumeId: string) => void;
  deletingResumeId?: string | null;
  onHoverResume?: (resumeId: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search versions, file name, target role..."
            className="w-full rounded-2xl border border-zinc-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-zinc-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" className="px-3">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="secondary" className="px-3">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200">
        <div className="grid grid-cols-[110px_1fr_120px_120px_140px] gap-0 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-600">
          <div>Version</div>
          <div>File</div>
          <div>Status</div>
          <div>Score</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-zinc-200">
          {rows.map((resume) => (
            <div
              key={resume.id}
              className="grid grid-cols-[110px_1fr_120px_120px_140px] items-center gap-0 px-4 py-3"
            >
              <div className="text-sm font-medium text-zinc-900">
                {resume.version}
                <div className="mt-0.5 text-xs text-zinc-500">
                  {resume.uploadedAt}
                </div>
              </div>

              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-zinc-900">
                  {resume.fileName}
                </div>
                <div className="truncate text-sm text-zinc-500">
                  Target: {resume.roleTarget ?? "Not set"}
                </div>
              </div>

              <div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    resume.status === "READY"
                      ? "bg-emerald-50 text-emerald-700"
                      : resume.status === "FAILED"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {resume.status ?? "READY"}
                </span>
              </div>

              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  {resume.score}
                </div>
                <div className="text-xs text-zinc-500">ATS</div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/dashboard/resumes/${resume.id}`}
                  onMouseEnter={() => onHoverResume?.(resume.id)}
                  className="rounded-xl border border-zinc-200 bg-white p-2 hover:bg-zinc-50"
                  title="View feedback"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => onDeleteResume?.(resume.id)}
                  disabled={deletingResumeId === resume.id}
                  className="rounded-xl border border-zinc-200 bg-white p-2 hover:bg-zinc-50"
                  title="Delete"
                >
                  {deletingResumeId === resume.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ResumeScoreGuideCard() {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-zinc-900">
        How the score works
      </div>
      <div className="mt-2 text-sm text-zinc-600">
        Your ATS score is computed from structure + clarity + role match. Upload
        a new version after edits to track improvement.
      </div>

      <div className="mt-4 space-y-3">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
            <CheckCircle2 className="h-4 w-4" />
            Structure
          </div>
          <div className="mt-1 text-sm text-zinc-600">
            One-column layout, consistent headings, ATS-friendly formatting.
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
            <Lightbulb className="h-4 w-4" />
            Impact
          </div>
          <div className="mt-1 text-sm text-zinc-600">
            Metrics, outcomes, scale, ownership.
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
            <Wand2 className="h-4 w-4" />
            Role match
          </div>
          <div className="mt-1 text-sm text-zinc-600">
            Keywords + phrasing aligned with the role you target.
          </div>
        </div>
      </div>
    </section>
  );
}

export function ResumeUploadModal({
  open,
  onClose,
  selectedFile,
  roleTarget,
  isUploading,
  uploadError,
  uploadResult,
  onFileSelect,
  onRoleTargetChange,
  onStartUpload,
}: {
  open: boolean;
  onClose: () => void;
  selectedFile: File | null;
  roleTarget: string;
  isUploading: boolean;
  uploadError: string | null;
  uploadResult: UploadResumeResponse["resume"] | null;
  onFileSelect: (file: File | null) => void;
  onRoleTargetChange: (value: string) => void;
  onStartUpload: () => void;
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [localFileError, setLocalFileError] = useState<string | null>(null);
  const allowedMimeTypes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);

  function handlePickedFile(file: File | null) {
    if (!file) {
      setLocalFileError(null);
      onFileSelect(null);
      return;
    }

    if (!allowedMimeTypes.has(file.type)) {
      setLocalFileError("Please upload a PDF or Word document.");
      return;
    }

    setLocalFileError(null);
    onFileSelect(file);
  }

  function handleDragState(event: DragEvent<HTMLLabelElement>, active: boolean) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(active);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    handlePickedFile(event.dataTransfer.files?.[0] ?? null);
  }

  if (!open) return null;
  const selectedFileSize = selectedFile
    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/55 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl">
        <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-base font-semibold text-zinc-900">
                Upload Resume
              </div>
              <button
                onClick={onClose}
                className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-600 hover:bg-zinc-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                  Resume File
                </label>
                <label
                  htmlFor="resume-upload-input"
                  onDragEnter={(event) => handleDragState(event, true)}
                  onDragOver={(event) => handleDragState(event, true)}
                  onDragLeave={(event) => handleDragState(event, false)}
                  onDrop={handleDrop}
                  className={`mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed px-4 py-4 transition-colors ${
                    isDragActive
                      ? "border-zinc-500 bg-zinc-100"
                      : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100/70"
                  }`}
                >
                  <span className="rounded-xl border border-zinc-200 bg-white p-2">
                    <FileText className="h-4 w-4 text-zinc-600" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-zinc-800">
                      {selectedFile
                        ? selectedFile.name
                        : "Drop file here or click to browse"}
                    </span>
                    <span className="block text-xs text-zinc-500">
                      PDF/DOCX only • Max 5MB
                    </span>
                  </span>
                </label>
                <input
                  id="resume-upload-input"
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => handlePickedFile(event.target.files?.[0] ?? null)}
                  className="sr-only"
                />
                {localFileError ? (
                  <div className="mt-2 text-xs text-rose-600">{localFileError}</div>
                ) : null}
                {selectedFile ? (
                  <div className="mt-2 text-xs text-zinc-600">
                    Size: {selectedFileSize}
                  </div>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="target-role-input"
                  className="text-xs font-semibold uppercase tracking-wide text-zinc-600"
                >
                  Target Role
                </label>
                <div className="relative mt-2">
                  <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="target-role-input"
                    value={roleTarget}
                    onChange={(event) => onRoleTargetChange(event.target.value)}
                    placeholder="Frontend Engineer"
                    className="w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-zinc-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Button
                onClick={onStartUpload}
                disabled={isUploading || !selectedFile || !roleTarget.trim()}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isUploading ? "Uploading..." : "Start Upload"}
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>

            {uploadError ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                {uploadError}
              </div>
            ) : null}

            {uploadResult ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                <div className="text-sm font-medium text-emerald-800">
                  Upload completed
                </div>
                <div className="mt-1 text-sm text-emerald-700">
                  {uploadResult.fileName} stored successfully.
                </div>
                <div className="mt-1 text-xs text-emerald-700">
                  Status: {uploadResult.status} • Role target:{" "}
                  {uploadResult.roleTarget ?? "Not set"}
                </div>
              </div>
            ) : null}
        </div>
      </div>
    </div>
  );
}
