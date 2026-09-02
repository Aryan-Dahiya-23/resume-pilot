"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Lightbulb,
  Loader2,
  Search,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";
import { useState, type DragEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UploadResumeResponse } from "@/lib/api/resumes";
import type { Resume } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type ResumeStatus =
  | "All"
  | "UPLOADED"
  | "PARSING"
  | "REVIEWING"
  | "READY"
  | "FAILED";
type ResumeDateFilter = "All" | "today" | "7d" | "30d";

function resumeStatusVariant(status?: string) {
  if (status === "READY") return "success" as const;
  if (status === "FAILED") return "danger" as const;
  if (status === "PARSING" || status === "REVIEWING") return "warning" as const;
  return "neutral" as const;
}

export function ResumesHeader() {
  return <ResumesHeaderWithAction />;
}

export function ResumesHeaderWithAction({
  onUploadClick,
}: {
  onUploadClick?: () => void;
}) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
          Resume library
        </div>
        <h1 className="font-heading text-4xl leading-[0.98] font-medium tracking-[-0.035em] text-foreground sm:text-5xl">
          Your working drafts.
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          Keep a clear record of every version, then use the feedback to make the
          next one stronger.
        </p>
      </div>
      <Button onClick={onUploadClick} className="sm:shrink-0">
        <Upload className="size-4" />
        Upload resume
      </Button>
    </header>
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
  statusFilter: ResumeStatus;
  onStatusFilterChange: (value: ResumeStatus) => void;
  dateFilter: ResumeDateFilter;
  onDateFilterChange: (value: ResumeDateFilter) => void;
  rows: Array<Resume & { status?: string }>;
  onDeleteResume?: (resumeId: string) => void;
  deletingResumeId?: string | null;
  onHoverResume?: (resumeId: string) => void;
}) {
  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by version, file, or target role"
            className="h-10 w-full rounded-lg border border-input bg-card py-2 pl-10 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value as ResumeStatus)}
            className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/15"
            aria-label="Filter by review status"
          >
            <option value="All">All statuses</option>
            <option value="UPLOADED">Uploaded</option>
            <option value="PARSING">Parsing</option>
            <option value="REVIEWING">Reviewing</option>
            <option value="READY">Ready</option>
            <option value="FAILED">Failed</option>
          </select>
          <select
            value={dateFilter}
            onChange={(event) =>
              onDateFilterChange(event.target.value as ResumeDateFilter)
            }
            className="h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/15"
            aria-label="Filter by upload date"
          >
            <option value="All">Any date</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      <div className="border-b border-border px-5 py-2 text-xs text-muted-foreground md:hidden">
        Swipe horizontally to view every column.
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[740px]">
          <div className="grid grid-cols-[112px_minmax(240px,1fr)_125px_100px_108px] border-b border-border bg-muted/45 px-5 py-3 text-[11px] font-semibold tracking-[0.09em] text-muted-foreground uppercase">
            <div>Version</div>
            <div>Resume</div>
            <div>Status</div>
            <div>Score</div>
            <div className="text-right">Open</div>
          </div>
          <div className="divide-y divide-border/70">
            {rows.map((resume) => (
              <div
                key={resume.id}
                className="grid grid-cols-[112px_minmax(240px,1fr)_125px_100px_108px] items-center px-5 py-4 transition-colors hover:bg-muted/35"
              >
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {resume.version}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {resume.uploadedAt}
                  </div>
                </div>
                <div className="min-w-0 pr-4">
                  <div className="truncate text-sm font-semibold text-foreground">
                    {resume.fileName}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    {resume.roleTarget ?? "No target role set"}
                  </div>
                </div>
                <div>
                  <Badge variant={resumeStatusVariant(resume.status)}>
                    {resume.status ?? "READY"}
                  </Badge>
                </div>
                <div>
                  <div className="text-lg font-bold tracking-[-0.03em] text-foreground">
                    {resume.score}
                  </div>
                  <div className="text-[10px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                    ATS
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon-sm" asChild>
                    <Link
                      href={`/dashboard/resumes/${resume.id}`}
                      onMouseEnter={() => onHoverResume?.(resume.id)}
                      aria-label={`Open feedback for ${resume.fileName}`}
                    >
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDeleteResume?.(resume.id)}
                    disabled={deletingResumeId === resume.id}
                    aria-label={`Delete ${resume.fileName}`}
                  >
                    {deletingResumeId === resume.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
            {rows.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <div className="text-sm font-semibold text-foreground">
                  No matching resumes
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Try changing the search or filters.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ResumeScoreGuideCard() {
  const checks = [
    {
      icon: CheckCircle2,
      title: "Structure",
      copy: "One-column layout, consistent headings, and ATS-friendly formatting.",
    },
    {
      icon: Lightbulb,
      title: "Impact",
      copy: "Metrics, outcomes, scale, and clear ownership of your work.",
    },
    {
      icon: Wand2,
      title: "Role match",
      copy: "Keywords and phrasing aligned with the role you are targeting.",
    },
  ];

  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="max-w-2xl">
        <div className="text-[11px] font-semibold tracking-[0.1em] text-brand uppercase">
          Reading the score
        </div>
        <h2 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
          What we look for.
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Your ATS score reflects structure, clarity, and relevance—not a generic
          checklist. Upload a revision to see whether the changes worked.
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {checks.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="border-l-2 border-border pl-4">
            <Icon className="size-4 text-brand" />
            <div className="mt-3 text-sm font-semibold text-foreground">{title}</div>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">{copy}</p>
          </div>
        ))}
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

  const selectedFileSize = selectedFile
    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
    : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="max-w-xl gap-0 p-0 sm:max-w-xl" showCloseButton={false}>
        <DialogHeader className="border-b border-border px-5 py-5 sm:px-6">
          <div className="text-[11px] font-semibold tracking-[0.1em] text-brand uppercase">
            New version
          </div>
          <DialogTitle className="font-heading text-2xl tracking-[-0.025em]">
            Add a resume to review.
          </DialogTitle>
          <DialogDescription>
            Upload a PDF or Word document. We will analyze it against the role you
            are targeting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          <div>
            <label className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              Resume file
              <span className="ml-1 text-brand">*</span>
            </label>
            <label
              htmlFor="resume-upload-input"
              onDragEnter={(event) => handleDragState(event, true)}
              onDragOver={(event) => handleDragState(event, true)}
              onDragLeave={(event) => handleDragState(event, false)}
              onDrop={handleDrop}
              className={cn(
                "mt-2 flex cursor-pointer items-center gap-4 border border-dashed p-4 transition-colors",
                isDragActive
                  ? "border-brand bg-brand/5"
                  : "border-border bg-muted/30 hover:border-foreground/35 hover:bg-muted/55",
              )}
            >
              <FileText className="size-5 shrink-0 text-brand" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {selectedFile ? selectedFile.name : "Drop a file here, or browse"}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  PDF or DOCX · maximum 5 MB
                </span>
              </span>
              {selectedFileSize ? (
                <span className="text-xs font-medium text-muted-foreground">
                  {selectedFileSize}
                </span>
              ) : null}
            </label>
            <input
              id="resume-upload-input"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) =>
                handlePickedFile(event.target.files?.[0] ?? null)
              }
              className="sr-only"
            />
            {localFileError ? (
              <p className="mt-2 text-xs text-destructive">{localFileError}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="target-role-input"
              className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase"
            >
              Target role
            </label>
            <div className="relative mt-2">
              <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="target-role-input"
                value={roleTarget}
                onChange={(event) => onRoleTargetChange(event.target.value)}
                placeholder="Frontend Engineer"
                className="h-11 w-full rounded-lg border border-input bg-card py-2 pl-10 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
              />
            </div>
          </div>

          {uploadError ? (
            <div className="border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {uploadError}
            </div>
          ) : null}

          {uploadResult ? (
            <div className="border-l-2 border-emerald-600 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-800">
              <div className="font-semibold">Upload complete</div>
              <div className="mt-1 text-emerald-700">
                {uploadResult.fileName} is ready for review.
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter className="mt-0">
          <DialogClose asChild>
            <Button variant="secondary" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onStartUpload}
            disabled={isUploading || !selectedFile || !roleTarget.trim()}
          >
            {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {isUploading ? "Uploading…" : "Start review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
