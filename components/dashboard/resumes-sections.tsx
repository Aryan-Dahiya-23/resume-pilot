"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  FileText,
  Loader2,
  Lightbulb,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useState, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Document Intelligence
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Resume Versions & AI Audits
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your uploaded resumes, track ATS performance trajectories, and review DeepSeek suggestions.
        </p>
      </div>

      <Button onClick={onUploadClick} className="shadow-xs shadow-indigo-500/20">
        <Upload className="size-4" />
        Upload New Resume
      </Button>
    </div>
  );
}

export function ResumesTableSection({
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  rows,
  onDeleteResume,
  deletingResumeId,
  onHoverResume,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: "All" | "UPLOADED" | "PARSING" | "REVIEWING" | "READY" | "FAILED";
  onStatusFilterChange: (value: "All" | "UPLOADED" | "PARSING" | "REVIEWING" | "READY" | "FAILED") => void;
  dateFilter: "All" | "today" | "7d" | "30d";
  onDateFilterChange: (value: "All" | "today" | "7d" | "30d") => void;
  rows: Array<Resume & { status?: string }>;
  onDeleteResume?: (resumeId: string) => void;
  deletingResumeId?: string | null;
  onHoverResume?: (resumeId: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
      {/* Controls Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by role, version, or filename..."
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(
                event.target.value as "All" | "UPLOADED" | "PARSING" | "REVIEWING" | "READY" | "FAILED",
              )
            }
            className="h-10 rounded-xl border border-slate-200/90 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Statuses</option>
            <option value="UPLOADED">Uploaded</option>
            <option value="PARSING">Parsing</option>
            <option value="REVIEWING">Reviewing</option>
            <option value="READY">Ready</option>
            <option value="FAILED">Failed</option>
          </select>

          <select
            value={dateFilter}
            onChange={(event) =>
              onDateFilterChange(event.target.value as "All" | "today" | "7d" | "30d")
            }
            className="h-10 rounded-xl border border-slate-200/90 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Resumes Grid/Table */}
      <div className="mt-6 space-y-3">
        {rows.map((resume) => {
          const score = resume.score ?? 0;
          const scoreVariant =
            score >= 80 ? "success" : score >= 60 ? "brand" : score >= 40 ? "warning" : "danger";

          return (
            <div
              key={resume.id}
              className="group flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <FileText className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">
                      {resume.version}
                    </span>
                    <Badge variant={scoreVariant} withDot>
                      ATS: {score}
                    </Badge>
                    {resume.status && resume.status !== "READY" ? (
                      <Badge variant="warning" withDot>
                        {resume.status}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>Target: {resume.roleTarget ?? "General"}</span>
                    <span>•</span>
                    <span>{resume.uploadedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 shrink-0 border-t border-slate-100 sm:border-t-0 pt-3 sm:pt-0">
                <Button variant="secondary" size="sm" asChild>
                  <Link
                    href={`/dashboard/resumes/${resume.id}`}
                    onMouseEnter={() => onHoverResume?.(resume.id)}
                  >
                    View Audit
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDeleteResume?.(resume.id)}
                  disabled={deletingResumeId === resume.id}
                  className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Delete resume"
                >
                  {deletingResumeId === resume.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </Button>
              </div>
            </div>
          );
        })}

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-sm text-slate-500">
            No matching resumes found. Try adjusting your search query or filters.
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function ResumeScoreGuideCard() {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Lightbulb className="size-4 text-amber-500" />
        <span>Scoring Methodology</span>
      </div>
      <h3 className="mt-2 text-base font-bold text-slate-900">
        How ATS Scoring Works
      </h3>
      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
        Our DeepSeek evaluation analyzes bullet point impact, quantifiable achievements, keyword coverage for your target role, and layout parsing compatibility.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3 text-xs">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
          <div className="font-bold text-emerald-800">80 - 100 • Ready</div>
          <div className="mt-0.5 text-emerald-600">Top-tier candidate profile with strong metrics.</div>
        </div>
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
          <div className="font-bold text-indigo-800">60 - 79 • Good</div>
          <div className="mt-0.5 text-indigo-600">Solid baseline; needs punchier action verbs.</div>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
          <div className="font-bold text-amber-800">Below 60 • Action Needed</div>
          <div className="mt-0.5 text-amber-600">Missing key competencies and quantifiable outcomes.</div>
        </div>
      </div>
    </div>
  );
}

export function ResumeUploadModal({
  open,
  onClose,
  selectedFile,
  roleTarget,
  onFileSelect,
  onRoleTargetChange,
  onStartUpload,
  isUploading,
  uploadError,
  uploadResult,
}: {
  open: boolean;
  onClose: () => void;
  selectedFile: File | null;
  roleTarget: string;
  onFileSelect: (file: File | null) => void;
  onRoleTargetChange: (value: string) => void;
  onStartUpload: () => void;
  isUploading: boolean;
  uploadError: string | null;
  uploadResult: { fileName: string; status: string } | null;
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

  const selectedFileSize = selectedFile
    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
    : null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Resume for AI Audit</DialogTitle>
          <DialogDescription>
            DeepSeek analyzes your document against modern ATS screening filters.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Resume Document
            </label>
            <label
              htmlFor="resume-upload-input"
              onDragEnter={(e) => handleDragState(e, true)}
              onDragOver={(e) => handleDragState(e, true)}
              onDragLeave={(e) => handleDragState(e, false)}
              onDrop={handleDrop}
              className={`mt-1.5 flex cursor-pointer items-center gap-3.5 rounded-2xl border-2 border-dashed p-4 transition-all ${
                isDragActive
                  ? "border-indigo-500 bg-indigo-50/50"
                  : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-white shadow-2xs text-indigo-600">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-800">
                  {selectedFile ? selectedFile.name : "Choose a file or drag & drop"}
                </span>
                <span className="block text-xs text-slate-400">
                  PDF or DOCX • Max 5MB
                </span>
              </div>
            </label>
            <input
              id="resume-upload-input"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => handlePickedFile(e.target.files?.[0] ?? null)}
              className="sr-only"
            />
            {localFileError ? (
              <p className="mt-1.5 text-xs text-rose-600">{localFileError}</p>
            ) : null}
            {selectedFile ? (
              <p className="mt-1.5 text-xs text-slate-500">
                File size: {selectedFileSize}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="target-role-input"
              className="text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Target Role Lens
            </label>
            <div className="relative mt-1.5">
              <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="target-role-input"
                value={roleTarget}
                onChange={(e) => onRoleTargetChange(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="pl-10"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Keywords and competencies are scored specifically against this title.
            </p>
          </div>

          {uploadError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {uploadError}
            </div>
          ) : null}

          {uploadResult ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              <div className="font-semibold">{uploadResult.fileName} uploaded!</div>
              <div className="mt-0.5 text-emerald-700">
                Status: {uploadResult.status} • Background AI audit triggered.
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              onClick={onStartUpload}
              disabled={isUploading || !selectedFile || !roleTarget.trim()}
            >
              {isUploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              {isUploading ? "Processing..." : "Begin AI Audit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
