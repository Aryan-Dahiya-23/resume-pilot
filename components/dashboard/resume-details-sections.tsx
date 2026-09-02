"use client";

import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  Save,
  Trash2,
  Wand2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <PageHeader
      kicker="Resume feedback"
      title={resume.fileName}
      description={`${resume.version} • Uploaded ${resume.uploadedAt} • Target: ${resume.roleTarget ?? "Not set"}`}
      actions={
        <>
          {scoreDelta !== null && scoreDelta !== undefined ? (
            <Badge variant={scoreDelta >= 0 ? "success" : "danger"}>
              {scoreDelta >= 0 ? "+" : ""}
              {scoreDelta} vs previous
            </Badge>
          ) : null}
          {versionOptions && versionOptions.length ? (
            <select
              className="min-w-[200px] rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring"
              value={selectedVersionId ?? versionOptions[0].id}
              onChange={(event) => onSelectVersion?.(event.target.value)}
            >
              {versionOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          ) : null}
          <Button asChild variant="secondary">
            <Link href="/dashboard/resumes">Back to resumes</Link>
          </Button>
          <Button onClick={onRerunReview} disabled={isRerunning}>
            <Wand2 className="h-4 w-4" />
            {isRerunning ? "Re-running..." : "Re-run review"}
          </Button>
        </>
      }
    />
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
      {reviewHistory && reviewHistory.length ? (
        <section className="rounded-xl border border-border bg-card p-5 shadow-none">
          <div className="text-sm font-medium text-foreground">Review history</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Track every AI run and compare scores over time.
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Version</th>
                  <th className="px-3 py-2 font-medium">Run date</th>
                  <th className="px-3 py-2 font-medium">Model</th>
                  <th className="px-3 py-2 font-medium text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {reviewHistory.map((item) => {
                  const active = selectedReviewId === item.id;
                  return (
                    <tr
                      key={item.id}
                      className={`cursor-pointer border-t border-border/70 transition-colors ${
                        active ? "bg-muted/70" : "hover:bg-muted"
                      }`}
                      onClick={() => onSelectReview?.(item.id)}
                    >
                      <td className="px-3 py-3 font-medium text-foreground">{item.versionLabel}</td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{item.model}</td>
                      <td className="px-3 py-3 text-right">
                        <Badge variant="neutral">{item.score}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-border bg-card p-5 shadow-none">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">ATS score</div>
            <div className="mt-1 text-3xl font-semibold text-foreground">
              {feedback.score} / 100
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="success">Strong projects</Badge>
              <Badge variant="neutral">Needs metrics</Badge>
              <Badge variant="info">Good structure</Badge>
            </div>
          </div>
          <ProgressRing value={feedback.score} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/60 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <CheckCircle2 className="h-4 w-4" />
              Strengths
            </div>
            <ul className="mt-3 space-y-2">
              {feedback.summary.strengths.map((item) => (
                <li key={item} className="text-sm text-foreground/80">
                  • {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-muted/60 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <AlertTriangle className="h-4 w-4" />
              Weaknesses
            </div>
            <ul className="mt-3 space-y-2">
              {feedback.summary.weaknesses.map((item) => (
                <li key={item} className="text-sm text-foreground/80">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-none">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-foreground">
              Missing keywords
            </div>
            <div className="text-sm text-muted-foreground">
              Add these naturally into your experience + projects.
            </div>
          </div>
          <Button variant="secondary" className="px-3" onClick={onCopyKeywords}>
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {feedback.missingKeywords.map((keyword) => (
            <Badge key={keyword} variant="neutral">
              {keyword}
            </Badge>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-none">
        <div className="text-sm font-medium text-foreground">
          Bullet rewrites (high impact)
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          Replace weak bullets with measurable, role-aligned ones.
        </div>

        <div className="mt-4 space-y-4">
          {feedback.rewriteSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-muted/60 p-4"
            >
              <div className="text-xs font-medium text-muted-foreground">BEFORE</div>
              <div className="mt-1 text-sm text-foreground">
                {suggestion.before}
              </div>

              <div className="mt-3 text-xs font-medium text-muted-foreground">
                AFTER
              </div>
              <div className="mt-1 text-sm font-medium text-foreground">
                {suggestion.after}
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">{suggestion.why}</div>
                <Button
                  variant="secondary"
                  className="px-3"
                  onClick={() => onCopySuggestion?.(suggestion)}
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-none">
        <div className="text-sm font-medium text-foreground">ATS checks</div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {feedback.atsChecks.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-border bg-muted/60 p-3"
            >
              <div className="text-sm font-medium text-foreground">
                {item.label}
              </div>
              {item.ok ? (
                <Badge variant="success">OK</Badge>
              ) : (
                <Badge variant="danger">Fix</Badge>
              )}
            </div>
          ))}
        </div>
      </section>
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

  const selectedRole =
    roleTarget && roleOptions.includes(roleTarget)
      ? roleTarget
      : roleTarget || roleOptions[0];
  const levelOptions = ["Internship", "0-1 years", "1-3 years", "3-5 years", "5+ years"];
  const selectedLevel =
    targetLevel && levelOptions.includes(targetLevel)
      ? targetLevel
      : targetLevel || levelOptions[0];

  return (
    <aside className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-5 shadow-none">
        <div className="text-sm font-medium text-foreground">Target role</div>
        <div className="mt-2 text-sm text-muted-foreground">
          Selecting a role makes keyword + feedback more accurate.
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Role</label>
          <select
            className="w-full rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring"
            value={selectedRole}
            onChange={(event) => onRoleTargetChange?.(event.target.value)}
          >
            {roleTarget && !roleOptions.includes(roleTarget) ? (
              <option value={roleTarget}>{roleTarget}</option>
            ) : null}
            <option>Frontend Engineer</option>
            <option>Backend Engineer (Go)</option>
            <option>Fullstack Engineer</option>
            <option>Solana / Rust Developer</option>
          </select>

          <label className="mt-3 block text-xs font-medium text-muted-foreground">
            Level
          </label>
          <select
            className="w-full rounded-2xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-ring"
            value={selectedLevel}
            onChange={(event) => onTargetLevelChange?.(event.target.value)}
          >
            {targetLevel && !levelOptions.includes(targetLevel) ? (
              <option value={targetLevel}>{targetLevel}</option>
            ) : null}
            <option>Internship</option>
            <option>0-1 years</option>
            <option>1-3 years</option>
            <option>3-5 years</option>
            <option>5+ years</option>
          </select>
        </div>

        <div className="mt-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={onSaveTargetRole}
            disabled={isSavingRole}
          >
            <Save className="h-4 w-4" />
            {isSavingRole ? "Saving..." : "Save target"}
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-none">
        <div className="text-sm font-medium text-foreground">
          Recommended next actions
        </div>
        <div className="mt-3 space-y-2">
          {feedback.nextActions.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border bg-muted/60 p-3 text-sm text-foreground/80"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-none">
        <div className="text-sm font-medium text-foreground">Resume file</div>
        <div className="mt-2 text-sm text-muted-foreground">
          Stored securely. You can download anytime.
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            variant="secondary"
            className="w-full"
            onClick={onDownload}
            disabled={isDownloading}
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Preparing..." : "Download"}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={onDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </section>
    </aside>
  );
}
