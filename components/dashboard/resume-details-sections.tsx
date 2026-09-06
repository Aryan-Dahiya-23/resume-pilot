"use client";
import { FormSelect } from "@/components/ui/form-select";
import { SelectItem } from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  History,
  PenLine,
  RefreshCw,
  Save,
  Target,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressRing } from "@/components/ui/progress-ring";
import type { Resume, ResumeFeedback } from "@/lib/mock-data";

export function ResumeFeedbackHeader({
  resume,
  onRerunReview,
  isRerunning,
  scoreDelta,
  versionOptions,
  selectedVersionId,
  onSelectVersion,
}: {
  resume: Resume;
  onRerunReview?: () => void;
  isRerunning?: boolean;
  scoreDelta?: number | null;
  versionOptions?: Array<{ id: string; label: string }>;
  selectedVersionId?: string;
  onSelectVersion?: (value: string) => void;
}) {
  return (
    <>
      <Link href="/dashboard/resumes" className="text-link !text-xs">
        <ArrowLeft size={14} />
        Back to my resumes
      </Link>
      <PageHeader
        eyebrow="YOUR EXPERIENCE, WITH MORE IMPACT"
        title="A stronger story starts here."
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            <FileText size={14} />
            {resume.fileName}
            <span className="text-zinc-300">/</span>
            {resume.uploadedAt}
            {scoreDelta != null && (
              <Badge variant={scoreDelta >= 0 ? "success" : "warning"}>
                {scoreDelta > 0 ? "+" : ""}
                {scoreDelta} vs. previous review
              </Badge>
            )}
          </span>
        }
        actions={
          <>
            {Boolean(versionOptions?.length) && (
              <FormSelect
                aria-label="Select a review version"
                className="field-input !w-auto !text-xs"
                value={selectedVersionId ?? versionOptions?.[0].id}
                onValueChange={(e) => onSelectVersion?.(e)}
              >
                {versionOptions?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
              </FormSelect>
            )}
            <Button onClick={onRerunReview} disabled={isRerunning}>
              <RefreshCw size={15} />
              {isRerunning ? "Queuing review…" : "Review again"}
            </Button>
          </>
        }
      />
    </>
  );
}

type ReviewHistory = {
  id: string;
  versionLabel: string;
  createdAt: string;
  model: string;
  score: number;
};
export function ResumeDetailsMain({
  feedback,
  reviewHistory,
  selectedReviewId,
  onSelectReview,
  onCopyKeywords,
  onCopySuggestion,
}: {
  feedback: ResumeFeedback;
  reviewHistory?: ReviewHistory[];
  selectedReviewId?: string | null;
  onSelectReview?: (id: string) => void;
  onCopyKeywords?: () => void;
  onCopySuggestion?: (input: {
    before: string;
    after: string;
    why: string;
  }) => void;
}) {
  return (
    <div className="min-w-0 space-y-6">
      <section className="panel overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-[#e1e9d5] bg-[#eef3e4] p-6">
          <div>
            <p className="eyebrow">YOUR RESUME READINESS</p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight">
              {feedback.score >= 75
                ? "You have a strong foundation."
                : feedback.score >= 50
                  ? "Your story has more to give."
                  : "There’s a clear way forward."}
            </h2>
            <p className="mt-2 max-w-sm text-xs leading-6 text-zinc-500">
              Use the suggestions below to make your experience clearer, more
              specific, and more relevant.
            </p>
          </div>
          <ProgressRing value={feedback.score} />
        </div>
        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 size={16} className="text-[#6b9150]" />
              What’s working
            </h3>
            <ul className="mt-4 space-y-3">
              {feedback.summary.strengths.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-[13px] leading-6 text-zinc-600"
                >
                  <Check size={13} className="mt-1.5 shrink-0 text-[#7f9c65]" />
                  {item}
                </li>
              ))}
            </ul>
            {feedback.summary.strengths.length === 0 && (
              <p className="mt-3 text-xs text-zinc-500">
                No strengths were listed in this review.
              </p>
            )}
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle size={16} className="text-[#b38c4f]" />
              Where to focus
            </h3>
            <ul className="mt-4 space-y-3">
              {feedback.summary.weaknesses.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-[13px] leading-6 text-zinc-600"
                >
                  <ArrowRight
                    size={13}
                    className="mt-1.5 shrink-0 text-[#b39765]"
                  />
                  {item}
                </li>
              ))}
            </ul>
            {feedback.summary.weaknesses.length === 0 && (
              <p className="mt-3 text-xs text-zinc-500">
                No specific issues flagged in this review.
              </p>
            )}
          </div>
        </div>
        <p className="border-t border-zinc-100 px-6 py-3 text-[11px] leading-5 text-zinc-500">
          An AI estimate to guide your edits. Scores do not predict a hiring
          outcome.
        </p>
      </section>
      <section className="panel p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="section-title">Find the right words.</h2>
            <p className="mt-1 text-xs leading-6 text-zinc-500">
              Add relevant keywords naturally, wherever they reflect your actual
              experience.
            </p>
          </div>
          <Button
            variant="secondary"
            className="!min-h-9 !px-3 !text-xs"
            onClick={onCopyKeywords}
            disabled={feedback.missingKeywords.length === 0}
          >
            <Copy size={13} />
            Copy all
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {feedback.missingKeywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-md border border-[#dae5ce] bg-[#f3f7ec] px-3 py-1.5 text-xs text-[#658048]"
            >
              {keyword}
            </span>
          ))}
        </div>
        {feedback.missingKeywords.length === 0 && (
          <p className="text-xs text-zinc-500">
            No additional keywords suggested.
          </p>
        )}
      </section>
      <section className="panel overflow-hidden">
        <div className="panel-heading">
          <div>
            <h2 className="section-title">Same experience. Stronger words.</h2>
            <p className="panel-kicker">
              Practical rewrites to make your contribution clear.
            </p>
          </div>
          <PenLine size={18} className="text-[#8aa769]" />
        </div>
        <div className="space-y-5 px-6 pb-6">
          {feedback.rewriteSuggestions.map((suggestion, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-xl border border-zinc-200"
            >
              <div className="bg-zinc-50 p-4">
                <p className="eyebrow !text-[10px]">YOUR ORIGINAL</p>
                <p className="mt-2 text-[13px] leading-7 text-zinc-500">
                  {suggestion.before}
                </p>
              </div>
              <div className="border-t border-[#e1ead5] bg-[#f1f6e9] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow !text-[10px] !text-[#6c8b4e]">
                    A STRONGER VERSION
                  </p>
                  <button
                    type="button"
                    className="text-link !text-xs"
                    aria-label={`Copy rewrite ${index + 1}`}
                    onClick={() => onCopySuggestion?.(suggestion)}
                  >
                    <Copy size={12} />
                    Copy rewrite
                  </button>
                </div>
                <p className="mt-2 text-sm leading-7 text-[#38502a]">
                  {suggestion.after}
                </p>
              </div>
              <p className="border-t border-zinc-100 px-4 py-3 text-xs leading-6 text-zinc-500">
                {suggestion.why}
              </p>
            </article>
          ))}
          {feedback.rewriteSuggestions.length === 0 && (
            <p className="text-xs text-zinc-500">
              No bullet rewrites were suggested in this review.
            </p>
          )}
          <p className="text-[11px] leading-5 text-zinc-500">
            Check each suggestion before using it. Keep every claim and metric
            true to your experience.
          </p>
        </div>
      </section>
      <section className="panel p-6">
        <h2 className="section-title">Easy for people. Readable by systems.</h2>
        <p className="mt-1 text-xs leading-6 text-zinc-500">
          Formatting checks for applicant tracking systems.
        </p>
        <div className="mt-4 divide-y divide-zinc-100">
          {feedback.atsChecks.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 py-3"
            >
              <span className="text-[13px] text-zinc-600">{item.label}</span>
              <Badge variant={item.ok ? "success" : "warning"}>
                {item.ok ? "Looks good" : "Review this"}
              </Badge>
            </div>
          ))}
        </div>
      </section>
      {Boolean(reviewHistory?.length) && (
        <section className="panel p-6">
          <div className="flex items-center gap-2">
            <History size={17} className="text-zinc-400" />
            <h2 className="section-title">
              Your progress, version by version.
            </h2>
          </div>
          <div
            className="mt-5 space-y-2"
            role="group"
            aria-label="Review history"
          >
            {reviewHistory?.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={selectedReviewId === item.id}
                onClick={() => onSelectReview?.(item.id)}
                className={`flex w-full items-center justify-between gap-4 rounded-lg border px-4 py-3 text-left ${selectedReviewId === item.id ? "border-[#c5d7b1] bg-[#f2f6eb]" : "border-zinc-100 hover:bg-zinc-50"}`}
              >
                <div>
                  <span className="text-sm font-medium">
                    Review {item.versionLabel}
                  </span>
                  <span className="ml-3 text-xs text-zinc-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {item.score}
                  <span className="ml-1 text-xs font-normal text-zinc-400">
                    / 100
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function ResumeDetailsSidebar({
  feedback,
  roleTarget,
  targetLevel,
  onRoleTargetChange,
  onTargetLevelChange,
  onSaveTargetRole,
  isSavingRole,
  onDownload,
  onDelete,
  isDownloading,
  isDeleting,
}: {
  feedback: ResumeFeedback;
  roleTarget?: string;
  targetLevel?: string;
  onRoleTargetChange?: (value: string) => void;
  onTargetLevelChange?: (value: string) => void;
  onSaveTargetRole?: () => void;
  isSavingRole?: boolean;
  onDownload?: () => void;
  onDelete?: () => void;
  isDownloading?: boolean;
  isDeleting?: boolean;
}) {
  return (
    <aside className="min-w-0 space-y-5">
      <section className="panel p-6">
        <h2 className="section-title flex items-center gap-2">
          <Target size={17} className="text-[#86a266]" />
          Where you’re headed
        </h2>
        <p className="mt-2 text-xs leading-6 text-zinc-500">
          A target role makes your next review more relevant.
        </p>
        <div className="mt-5 space-y-4">
          <div>
            <Label htmlFor="resume-target-role" className="field-label">
              Target role
            </Label>
            <Input
              id="resume-target-role"
              className="field-input"
              value={roleTarget ?? ""}
              onChange={(e) => onRoleTargetChange?.(e.target.value)}
              placeholder="e.g. Frontend Engineer"
            />
          </div>
          <div>
            <Label htmlFor="resume-target-level" className="field-label">
              Experience level
            </Label>
            <FormSelect
              id="resume-target-level"
              className="field-input"
              value={targetLevel || "Internship"}
              onValueChange={(e) => onTargetLevelChange?.(e)}
            >
              {targetLevel &&
                ![
                  "Internship",
                  "0-1 years",
                  "1-3 years",
                  "3-5 years",
                  "5+ years",
                ].includes(targetLevel) && (
                  <SelectItem value={targetLevel}>{targetLevel}</SelectItem>
                )}
              {[
                "Internship",
                "0-1 years",
                "1-3 years",
                "3-5 years",
                "5+ years",
              ].map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </FormSelect>
          </div>
        </div>
        <Button
          variant="secondary"
          className="mt-5 w-full"
          onClick={onSaveTargetRole}
          disabled={isSavingRole || !roleTarget?.trim()}
        >
          <Save size={15} />
          {isSavingRole ? "Saving…" : "Save target"}
        </Button>
        <p className="field-help">
          Run a new review after changing your target.
        </p>
      </section>
      <section className="panel !border-[#dfe8d1] !bg-[#eef3e4] p-6">
        <h2 className="section-title">Your next small steps</h2>
        <div className="mt-3">
          {feedback.nextActions.map((item, index) => (
            <div key={item} className="action-item">
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
          {feedback.nextActions.length === 0 && (
            <p className="text-xs leading-6 text-zinc-500">
              Review the suggestions, then upload a new version to see your
              progress.
            </p>
          )}
        </div>
      </section>
      <section className="panel p-6">
        <h2 className="section-title">Your original file</h2>
        <p className="mt-2 text-xs leading-6 text-zinc-500">
          Keep a copy of your resume or remove it from your workspace.
        </p>
        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={onDownload}
          disabled={isDownloading}
        >
          <Download size={15} />
          {isDownloading ? "Preparing download…" : "Download resume"}
        </Button>
        <Button
          variant="ghost"
          className="mt-2 w-full !text-rose-700"
          onClick={onDelete}
          disabled={isDeleting}
        >
          <Trash2 size={14} />
          {isDeleting ? "Deleting…" : "Delete this resume"}
        </Button>
      </section>
    </aside>
  );
}
