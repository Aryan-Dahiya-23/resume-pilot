"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Copy,
  Download,
  FileCheck2,
  History,
  Layers,
  Lightbulb,
  Loader2,
  Save,
  Target,
  Trash2,
  Wand2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
          <FileCheck2 className="size-3.5" />
          <span>DeepSeek Audit Report</span>
        </div>
        <h1 className="mt-1 truncate text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {resume.fileName}
        </h1>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-700">{resume.version}</span>
          <span>•</span>
          <span>Uploaded {resume.uploadedAt}</span>
          <span>•</span>
          <span>Target: {resume.roleTarget ?? "General"}</span>
          {scoreDelta !== null && scoreDelta !== undefined ? (
            <Badge variant={scoreDelta >= 0 ? "success" : "danger"} withDot>
              {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} vs previous
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {versionOptions && versionOptions.length > 1 ? (
          <select
            className="h-9.5 rounded-xl border border-slate-200/90 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
            value={selectedVersionId ?? versionOptions[0].id}
            onChange={(e) => onSelectVersion?.(e.target.value)}
          >
            {versionOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        ) : null}

        <Button variant="secondary" size="sm" asChild>
          <Link href="/dashboard/resumes">
            <ArrowLeft className="size-3.5" />
            Library
          </Link>
        </Button>

        <Button
          size="sm"
          onClick={onRerunReview}
          disabled={isRerunning}
          className="shadow-xs shadow-emerald-600/20"
        >
          {isRerunning ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Wand2 className="size-3.5" />
          )}
          {isRerunning ? "Analyzing..." : "Re-run Audit"}
        </Button>
      </div>
    </div>
  );
}

export function ResumeDetailsMain({
  feedback,
  reviewHistory,
  selectedReviewId,
  onSelectReview,
  onCopyKeywords,
  onCopySuggestion,
}: {
  feedback: ResumeFeedback;
  reviewHistory?: Array<{
    id: string;
    versionLabel: string;
    createdAt: string;
    model: string;
    score: number;
  }>;
  selectedReviewId?: string | null;
  onSelectReview?: (id: string) => void;
  onCopyKeywords?: () => void;
  onCopySuggestion?: (input: { before: string; after: string; why: string }) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Review History Pill Card */}
      {reviewHistory && reviewHistory.length > 1 ? (
        <Card className="rounded-3xl border-slate-200/90 shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <History className="size-4 text-emerald-600" />
              <CardTitle className="text-base">Audit History Trajectory</CardTitle>
            </div>
            <CardDescription>
              Select a prior run to compare scores and generated recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {reviewHistory.map((item) => {
                const isSelected = item.id === selectedReviewId;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectReview?.(item.id)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs font-bold"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{item.versionLabel}</span>
                    <span className="rounded-md bg-white/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-800 border border-slate-200/60">
                      {item.score} pts
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Master Scorecard Banner */}
      <Card className="rounded-3xl border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                <Target className="size-3.5" />
                <span>Executive Readiness Evaluation</span>
              </div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Overall ATS Compatibility Score
              </h2>
              <p className="mt-1 max-w-lg text-xs sm:text-sm text-slate-500 leading-relaxed">
                Calculated by parsing formatting structure, action verbs, measurable metrics, and role-specific competencies.
              </p>
            </div>

            <ProgressRing value={feedback.score} size={110} strokeWidth={10} />
          </div>

          {/* Sub-Category Breakdowns */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Impact
              </span>
              <div className="mt-1 text-lg sm:text-xl font-bold text-slate-900">
                {Math.min(100, Math.max(40, feedback.score + 2))}%
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Brevity
              </span>
              <div className="mt-1 text-lg sm:text-xl font-bold text-slate-900">
                {Math.min(100, Math.max(50, feedback.score - 2))}%
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Style
              </span>
              <div className="mt-1 text-lg sm:text-xl font-bold text-slate-900">
                {Math.min(100, Math.max(45, feedback.score + 1))}%
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-center">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Skills Match
              </span>
              <div className="mt-1 text-lg sm:text-xl font-bold text-slate-900">
                {Math.min(100, Math.max(35, feedback.score - 4))}%
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses Callout */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <span>Demonstrated Strengths</span>
              </div>
              <ul className="mt-3 space-y-2">
                {feedback.summary.strengths.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="size-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                <AlertCircle className="size-4 text-amber-600" />
                <span>Areas for Growth</span>
              </div>
              <ul className="mt-3 space-y-2">
                {feedback.summary.weaknesses.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="size-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Bullet Rewrites Section */}
      <Card className="rounded-3xl border-slate-200/90 shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wand2 className="size-4 text-emerald-600" />
            <CardTitle>AI Bullet Point Rewrites</CardTitle>
          </div>
          <CardDescription>
            Replace vague statements with quantifiable, action-verb-driven accomplishments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedback.rewriteSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3"
            >
              {/* Original Weak Bullet */}
              <div className="rounded-xl border border-rose-200/80 bg-rose-50/50 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                  Original / Weak
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-mono">
                  {suggestion.before}
                </p>
              </div>

              {/* AI Optimized Bullet */}
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  AI Optimized / High-Impact
                </span>
                <p className="text-xs font-semibold text-slate-900 leading-relaxed font-mono">
                  {suggestion.after}
                </p>
              </div>

              {/* Rationale & Copy */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Lightbulb className="size-3.5 text-amber-500 shrink-0" />
                  <span>{suggestion.why}</span>
                </div>

                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => onCopySuggestion?.(suggestion)}
                  className="shrink-0 self-start sm:self-auto"
                >
                  <Copy className="size-3" />
                  Copy Bullet
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Missing Keywords Section */}
      <Card className="rounded-3xl border-slate-200/90 shadow-xs">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">Missing ATS Keywords</h3>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Incorporate these keywords into your skill list, summary, or work history.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={onCopyKeywords} className="self-start sm:self-auto">
              <Copy className="size-3.5" />
              Copy All
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {feedback.missingKeywords.map((keyword) => (
              <Badge key={keyword} variant="brand" className="px-3 py-1 text-xs">
                + {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* ATS Formatting Checks */}
      <Card className="rounded-3xl border-slate-200/90 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">Parsing & Formatting Integrity</CardTitle>
          <CardDescription>
            Validates machine readability against standard applicant tracking parsers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {feedback.atsChecks.map((check) => (
              <div
                key={check.label}
                className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/50 p-3"
              >
                <span className="text-xs font-medium text-slate-700">{check.label}</span>
                <Badge variant={check.ok ? "success" : "danger"} withDot>
                  {check.ok ? "Pass" : "Attention"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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
  const roleOptions = [
    "Frontend Engineer",
    "Backend Engineer (Go)",
    "Fullstack Engineer",
    "Solana / Rust Developer",
  ];
  const selectedRole = roleTarget || roleOptions[0];
  const levelOptions = ["Internship", "0-1 years", "1-3 years", "3-5 years", "5+ years"];
  const selectedLevel = targetLevel || levelOptions[0];

  return (
    <aside className="space-y-5 xl:sticky xl:top-6">
      {/* Target Role Selector */}
      <Card className="rounded-3xl border-slate-200/90 shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Briefcase className="size-4 text-emerald-600" />
            <CardTitle className="text-base">Role Targeting</CardTitle>
          </div>
          <CardDescription>
            Calibrates keyword relevance and ATS benchmark models.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Target Position
            </label>
            <select
              className="mt-1 h-9.5 w-full rounded-xl border border-slate-200/90 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={selectedRole}
              onChange={(e) => onRoleTargetChange?.(e.target.value)}
            >
              {roleOptions.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Experience Bracket
            </label>
            <select
              className="mt-1 h-9.5 w-full rounded-xl border border-slate-200/90 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={selectedLevel}
              onChange={(e) => onTargetLevelChange?.(e.target.value)}
            >
              {levelOptions.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </div>

          <Button
            size="sm"
            className="w-full shadow-xs shadow-emerald-600/20"
            onClick={onSaveTargetRole}
            disabled={isSavingRole}
          >
            {isSavingRole ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            {isSavingRole ? "Updating..." : "Save Role Target"}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card className="rounded-3xl border-slate-200/90 shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Document Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-start"
            onClick={onDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
            {isDownloading ? "Downloading..." : "Download Original PDF"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Trash2 className="size-3.5" />
            )}
            {isDeleting ? "Deleting..." : "Delete Resume"}
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
