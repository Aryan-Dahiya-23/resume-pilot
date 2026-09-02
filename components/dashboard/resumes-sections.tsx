"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Download,
  FileText,
  Loader2,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import { useState, type DragEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Resume } from "@/lib/mock-data";

export function ResumesHeaderWithAction({
  onUploadClick,
}: {
  onUploadClick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Document Intelligence
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Resume Version History
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Upload new revisions to measure ATS score progression and unlock high-impact rewrite diffs.
        </p>
      </div>

      <Button onClick={onUploadClick} className="shadow-xs shadow-emerald-600/20 w-full sm:w-auto">
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
  isLoading,
  onHoverResume,
  onRequestDeleteResume,
  onDeleteResume,
  deletingResumeId,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  dateFilter: "All" | "today" | "7d" | "30d";
  onDateFilterChange: (value: "All" | "today" | "7d" | "30d") => void;
  rows: Array<Resume & { status?: string }>;
  isLoading?: boolean;
  onHoverResume?: (resumeId: string) => void;
  onRequestDeleteResume?: (resumeId: string) => void;
  onDeleteResume?: (resumeId: string) => void;
  deletingResumeId?: string | null;
}) {
  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by version, filename, or role..."
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateFilter}
            onChange={(e) =>
              onDateFilterChange(e.target.value as "All" | "today" | "7d" | "30d")
            }
            className="h-10 w-full sm:w-auto rounded-xl border border-slate-200/90 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="All">All Time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Resumes List */}
      <div className="mt-5 space-y-3">
        {rows.map((resume) => {
          const score = resume.score ?? 0;
          const scoreVariant =
            score >= 80 ? "success" : score >= 60 ? "brand" : score >= 40 ? "warning" : "danger";

          return (
            <div
              key={resume.id}
              className="group flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-xs sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <FileText className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
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
                    <span className="truncate max-w-[180px] sm:max-w-xs font-medium text-slate-600">
                      {resume.fileName}
                    </span>
                    {resume.roleTarget ? (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-[160px] text-slate-500">
                          {resume.roleTarget}
                        </span>
                      </>
                    ) : null}
                    <span>•</span>
                    <span>{resume.uploadedAt}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <Button variant="secondary" size="xs" asChild>
                  <a
                    href={`/api/resumes/${resume.id}/download?redirect=true`}
                    target="_blank"
                    rel="noreferrer"
                    title="Download original file"
                  >
                    <Download className="size-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                </Button>

                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => (onRequestDeleteResume ?? onDeleteResume)?.(resume.id)}
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

                <Button size="xs" asChild className="shadow-xs shadow-emerald-600/20">
                  <Link
                    href={`/dashboard/resumes/${resume.id}`}
                    onMouseEnter={() => onHoverResume?.(resume.id)}
                  >
                    Audit Report
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}

        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin text-emerald-600" />
            <span>Fetching resumes...</span>
          </div>
        ) : null}

        {!isLoading && rows.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No matching resume versions found.
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function ResumeScoreGuideCard() {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
        <ShieldCheck className="size-3.5" />
        <span>Scoring Benchmark Standard</span>
      </div>
      <h3 className="mt-1 text-base font-bold text-slate-900">
        How DeepSeek ATS Scoring Works
      </h3>
      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
        Our evaluation models emulate modern enterprise ATS algorithms (Workday, Greenhouse, Lever, Taleo) combined with human recruiter scanning behavior.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3 text-center">
          <div className="text-xs font-bold text-emerald-800">80 – 100</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Ready to Apply</div>
        </div>
        <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-3 text-center">
          <div className="text-xs font-bold text-teal-800">60 – 79</div>
          <div className="text-[11px] text-teal-700 mt-0.5">Competitive</div>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3 text-center">
          <div className="text-xs font-bold text-amber-800">40 – 59</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Needs Work</div>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-3 text-center">
          <div className="text-xs font-bold text-rose-800">&lt; 40</div>
          <div className="text-[11px] text-rose-700 mt-0.5">Critical Fixes</div>
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
    const file = event.dataTransfer.files?.[0] ?? null;
    handlePickedFile(file);
  }

  const selectedFileSize = selectedFile
    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
    : null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-white shadow-2xs text-emerald-600">
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              variant={uploadResult ? "default" : "secondary"}
              onClick={onClose}
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              {uploadResult ? "Done" : "Cancel"}
            </Button>
            {!uploadResult ? (
              <Button
                onClick={onStartUpload}
                disabled={isUploading || !selectedFile || !roleTarget.trim()}
                className="w-full sm:w-auto shadow-xs shadow-emerald-600/20"
              >
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                {isUploading ? "Processing..." : "Begin AI Audit"}
              </Button>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
