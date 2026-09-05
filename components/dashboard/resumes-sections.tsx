"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Lightbulb,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useId, useState, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { PageHeader } from "@/components/ui/page-header";
import type { UploadResumeResponse } from "@/lib/api/resumes";
import type { Resume } from "@/lib/mock-data";

type ResumeStatusFilter =
  | "All"
  | "UPLOADED"
  | "PARSING"
  | "REVIEWING"
  | "READY"
  | "FAILED";
type DateFilter = "All" | "today" | "7d" | "30d";
const statusLabels: Record<string, string> = {
  UPLOADED: "Queued",
  PARSING: "Reading file",
  REVIEWING: "Reviewing",
  READY: "Reviewed",
  FAILED: "Needs attention",
};

export function ResumesHeader() {
  return <ResumesHeaderWithAction />;
}
export function ResumesHeaderWithAction({
  onUploadClick,
}: {
  onUploadClick?: () => void;
}) {
  return (
    <PageHeader
      eyebrow="YOUR STORY, REFINED"
      title="My resumes"
      description="Every version is a step toward a stronger first impression."
      actions={
        <Button onClick={onUploadClick}>
          <Upload size={16} />
          Upload resume
        </Button>
      }
    />
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
  statusFilter: ResumeStatusFilter;
  onStatusFilterChange: (value: ResumeStatusFilter) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (value: DateFilter) => void;
  rows: Array<Resume & { status?: string }>;
  onDeleteResume?: (id: string) => void;
  deletingResumeId?: string | null;
  onHoverResume?: (id: string) => void;
}) {
  return (
    <section aria-label="Resume library" className="space-y-6">
      <div className="collection-toolbar">
        <div className="search-field">
          <Search size={16} />
          <input
            type="search"
            aria-label="Search resumes"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search resumes or target roles…"
            className="field-input"
          />
        </div>
        <div className="filter-group">
          <select
            aria-label="Filter by review status"
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(e.target.value as ResumeStatusFilter)
            }
          >
            <option value="All">All statuses</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by upload date"
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value as DateFilter)}
          >
            <option value="All">Any time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">
          Your resume library{" "}
          <span className="ml-2 rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
            {rows.length}
          </span>
        </h2>
        <span className="text-xs text-zinc-400">Newest first</span>
      </div>
      {rows.length ? (
        <div className="resume-grid">
          {rows.map((resume) => {
            const ready = !resume.status || resume.status === "READY";
            const failed = resume.status === "FAILED";
            return (
              <article key={resume.id} className="panel resume-card">
                <div className="resume-card-preview" aria-hidden="true">
                  <div className="resume-paper">
                    <div className="paper-line !mb-2 !h-[7px] !w-2/5 !bg-[#668b4d]" />
                    <div className="paper-line !mb-4 !w-3/5" />
                    {[100, 87, 94, 64, 100, 83, 93].map((n, i) => (
                      <div
                        key={i}
                        className="paper-line"
                        style={{ width: `${n}%` }}
                      />
                    ))}
                  </div>
                  <span className="absolute right-3 top-3 rounded-md border border-[#e1e7d6] bg-white px-2 py-1 font-mono text-[10px] text-zinc-500">
                    {resume.fileName.split(".").pop()?.toUpperCase()}
                  </span>
                </div>
                <div className="resume-card-body">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2>
                        <Link
                          href={`/dashboard/resumes/${resume.id}`}
                          onMouseEnter={() => onHoverResume?.(resume.id)}
                          onFocus={() => onHoverResume?.(resume.id)}
                        >
                          {resume.fileName}
                        </Link>
                      </h2>
                      <p className="resume-card-meta">
                        {resume.uploadedAt} · {resume.version}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="icon-button icon-button-danger !h-7 !w-7"
                      aria-label={`Delete ${resume.fileName}`}
                      onClick={() => onDeleteResume?.(resume.id)}
                      disabled={deletingResumeId === resume.id}
                    >
                      {deletingResumeId === resume.id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                  <p className="mt-4 truncate text-xs text-zinc-500">
                    {resume.roleTarget || "No target role set"}
                  </p>
                  <div className="resume-card-score">
                    <span className="text-xs text-zinc-500">Resume score</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-lg font-medium">
                        {ready ? resume.score : "—"}
                      </strong>
                      {ready && (
                        <span className="score-track">
                          <i
                            style={{
                              width: `${Math.max(0, Math.min(resume.score, 100))}%`,
                            }}
                          />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant={
                        ready ? "success" : failed ? "danger" : "warning"
                      }
                    >
                      {statusLabels[resume.status || "READY"] || "Processing"}
                    </Badge>
                    <Link
                      href={`/dashboard/resumes/${resume.id}`}
                      className="text-link"
                      onMouseEnter={() => onHoverResume?.(resume.id)}
                    >
                      {ready ? "View feedback" : "View details"}
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="panel empty-state">
          <div className="icon-tile">
            <Search size={24} />
          </div>
          <h3>No resumes match just yet.</h3>
          <p>
            Try a different search or clear your filters to see your library.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              onQueryChange("");
              onStatusFilterChange("All");
              onDateFilterChange("All");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </section>
  );
}

export function ResumeScoreGuideCard() {
  return (
    <section className="score-guide">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-[#7b9956]" />
        <h2 className="text-sm font-medium">
          What goes into a stronger resume?
        </h2>
      </div>
      <div className="score-guide-grid">
        {[
          {
            icon: CheckCircle2,
            title: "Easy to read",
            text: "Clear sections and consistent formatting help your experience stand out.",
          },
          {
            icon: Lightbulb,
            title: "Real impact",
            text: "Specific outcomes and honest metrics make your contribution concrete.",
          },
          {
            icon: Sparkles,
            title: "The right story",
            text: "Relevant skills and language connect your experience to the role.",
          },
        ].map((item) => (
          <div key={item.title} className="flex gap-3">
            <item.icon size={17} className="mt-0.5 shrink-0 text-[#809865]" />
            <div>
              <h3 className="text-xs font-medium">{item.title}</h3>
              <p className="mt-1 text-xs leading-6 text-zinc-500">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-zinc-500">
        Scores are AI estimates to guide improvement. They do not predict a
        hiring decision.
      </p>
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
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputId = useId();
  const roleId = useId();
  function chooseFile(file: File | null) {
    if (isUploading) return;
    setFileError(null);
    if (!file) {
      onFileSelect(null);
      return;
    }
    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      onFileSelect(null);
      setFileError(
        "Choose a PDF or DOCX file. Other file types aren’t supported.",
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onFileSelect(null);
      setFileError("This file is too large. Choose a file smaller than 5 MB.");
      return;
    }
    if (file.size === 0) {
      onFileSelect(null);
      setFileError("This file is empty. Please choose another resume.");
      return;
    }
    onFileSelect(file);
  }
  function drag(event: DragEvent<HTMLLabelElement>, active: boolean) {
    event.preventDefault();
    setDragActive(active);
  }
  return (
    <Modal
      open={open}
      onClose={() => {
        setFileError(null);
        setDragActive(false);
        onClose();
      }}
      title="Let’s give your resume a fresh look."
      description="Upload your resume and tell us where you want to go next."
      busy={isUploading}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onStartUpload();
        }}
      >
        <fieldset disabled={isUploading} className="space-y-5">
          <div>
            <label
              className="drop-zone"
              data-active={dragActive}
              htmlFor={inputId}
              onDragEnter={(e) => drag(e, true)}
              onDragOver={(e) => drag(e, true)}
              onDragLeave={(e) => drag(e, false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                chooseFile(e.dataTransfer.files?.[0] || null);
              }}
            >
              <input
                id={inputId}
                type="file"
                accept=".pdf,.docx"
                aria-label="Choose your resume file"
                className="sr-only"
                onChange={(e) => chooseFile(e.target.files?.[0] || null)}
              />
              <span className="icon-tile mb-4 !h-12 !w-12 !bg-white">
                {selectedFile ? (
                  <FileText size={23} />
                ) : (
                  <Upload size={23} strokeWidth={1.5} />
                )}
              </span>
              <strong className="max-w-full break-all text-sm font-medium">
                {selectedFile ? selectedFile.name : "Drop your resume here"}
              </strong>
              <span className="mt-1 text-xs text-zinc-500">
                {selectedFile
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Click to choose a different file`
                  : "or click to browse your files"}
              </span>
              <span className="mt-4 text-[11px] text-zinc-400">
                PDF or DOCX · Maximum 5 MB
              </span>
            </label>
            {fileError && (
              <p role="alert" className="mt-2 text-xs text-rose-700">
                {fileError}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={roleId} className="field-label">
              What role are you working toward?
            </label>
            <input
              id={roleId}
              className="field-input"
              required
              value={roleTarget}
              onChange={(e) => onRoleTargetChange(e.target.value)}
              placeholder="e.g. Product Designer"
            />
            <p className="field-help">
              We’ll tailor keywords and suggestions to this role.
            </p>
          </div>
        </fieldset>
        <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-zinc-500">
          <ShieldCheck size={15} className="mt-0.5 shrink-0" />
          <p>
            Your resume stays in your workspace. You can download or delete it
            anytime.
          </p>
        </div>
        {uploadError && (
          <div role="alert" className="form-error mt-4">
            {uploadError}
          </div>
        )}
        {uploadResult && (
          <p role="status" className="mt-4 text-sm text-emerald-700">
            {uploadResult.fileName} uploaded successfully.
          </p>
        )}
        <div className="form-footer">
          <Button
            variant="secondary"
            onClick={() => {
              setFileError(null);
              onClose();
            }}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUploading || !selectedFile || !roleTarget.trim()}
          >
            {isUploading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Sparkles size={16} />
            )}
            {isUploading ? "Uploading your resume…" : "Upload & review"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
