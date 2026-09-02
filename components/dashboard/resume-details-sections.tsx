"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Save,
  Trash2,
  Wand2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import type { Resume, ResumeFeedback } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

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
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <Button variant="link" size="sm" className="-ml-3 mb-4" asChild>
          <Link href="/dashboard/resumes">
            <ArrowLeft className="size-3.5" />
            Resume library
          </Link>
        </Button>
        <div className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
          Resume review
        </div>
        <h1 className="mt-3 truncate font-heading text-4xl leading-[0.98] font-medium tracking-[-0.035em] text-foreground sm:text-5xl">
          {resume.fileName}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>{resume.version}</span>
          <span aria-hidden="true">·</span>
          <span>Uploaded {resume.uploadedAt}</span>
          <span aria-hidden="true">·</span>
          <span>{resume.roleTarget ?? "No target role"}</span>
          {scoreDelta !== null && scoreDelta !== undefined ? (
            <Badge variant={scoreDelta >= 0 ? "success" : "danger"}>
              {scoreDelta >= 0 ? "+" : ""}
              {scoreDelta} from previous
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
        {versionOptions?.length ? (
          <select
            className="h-10 min-w-[190px] rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/15"
            value={selectedVersionId ?? versionOptions[0].id}
            onChange={(event) => onSelectVersion?.(event.target.value)}
            aria-label="Select review run"
          >
            {versionOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        ) : null}
        <Button onClick={onRerunReview} disabled={isRerunning}>
          <Wand2 className="size-4" />
          {isRerunning ? "Reviewing…" : "Run review again"}
        </Button>
      </div>
    </header>
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
    <div className="space-y-4">
      <section className="surface-card overflow-hidden">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.1em] text-brand uppercase">
              ATS readiness
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="font-heading text-5xl leading-none font-medium tracking-[-0.05em] text-foreground">
                {feedback.score}
              </div>
              <div className="text-sm text-muted-foreground">out of 100</div>
            </div>
            <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
              A focused edit to the weak points below will make this version more
              compelling and easier to parse.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="success">Strong projects</Badge>
              <Badge variant="neutral">Needs metrics</Badge>
              <Badge variant="info">Good structure</Badge>
            </div>
          </div>
          <div className="border-l border-border pl-5 sm:pl-6">
            <ProgressRing value={feedback.score} />
          </div>
        </div>
        <div className="grid divide-y divide-border border-t border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <FeedbackList
            title="Strengths"
            items={feedback.summary.strengths}
            icon={CheckCircle2}
            tone="success"
          />
          <FeedbackList
            title="Needs attention"
            items={feedback.summary.weaknesses}
            icon={AlertTriangle}
            tone="warning"
          />
        </div>
      </section>

      {reviewHistory?.length ? (
        <section className="surface-card overflow-hidden">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <div className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Review history
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Compare each review run and its score over time.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/45 text-left text-[11px] font-semibold tracking-[0.09em] text-muted-foreground uppercase">
                <tr>
                  <th className="px-5 py-3 sm:px-6">Version</th>
                  <th className="px-5 py-3">Run date</th>
                  <th className="px-5 py-3">Model</th>
                  <th className="px-5 py-3 text-right sm:px-6">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {reviewHistory.map((item) => {
                  const active = selectedReviewId === item.id;
                  return (
                    <tr
                      key={item.id}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-muted/35",
                        active && "bg-brand/5",
                      )}
                      onClick={() => onSelectReview?.(item.id)}
                    >
                      <td className="px-5 py-3.5 font-semibold text-foreground sm:px-6">
                        {item.versionLabel}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{item.model}</td>
                      <td className="px-5 py-3.5 text-right sm:px-6">
                        <span className="font-semibold text-foreground">{item.score}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.1em] text-brand uppercase">
              Role language
            </div>
            <h2 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
              Missing keywords.
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Work these naturally into relevant experience and project bullets.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={onCopyKeywords}>
            <Copy className="size-3.5" />
            Copy keywords
          </Button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {feedback.missingKeywords.map((keyword) => (
            <Badge key={keyword} variant="neutral">
              {keyword}
            </Badge>
          ))}
        </div>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <div className="text-[11px] font-semibold tracking-[0.1em] text-brand uppercase">
          High-impact rewrites
        </div>
        <h2 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
          Make the proof sharper.
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Replace generic responsibilities with clear, measurable outcomes.
        </p>

        <div className="mt-6 divide-y divide-border">
          {feedback.rewriteSuggestions.map((suggestion, index) => (
            <article key={index} className="py-5 first:pt-0 last:pb-0">
              <div className="grid gap-5 md:grid-cols-[1fr_1fr_auto] md:items-start">
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                    Before
                  </div>
                  <p className="mt-2 text-sm leading-6 text-foreground/72">
                    {suggestion.before}
                  </p>
                </div>
                <div className="border-l-2 border-brand pl-4">
                  <div className="text-[10px] font-semibold tracking-[0.1em] text-brand uppercase">
                    After
                  </div>
                  <p className="mt-2 text-sm leading-6 font-semibold text-foreground">
                    {suggestion.after}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="md:mt-5"
                  onClick={() => onCopySuggestion?.(suggestion)}
                >
                  <Copy className="size-3.5" />
                  Copy
                </Button>
              </div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                {suggestion.why}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <div className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          Parse checks
        </div>
        <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {feedback.atsChecks.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4 border-b border-border/70 py-3">
              <div className="text-sm font-medium text-foreground">{item.label}</div>
              <Badge variant={item.ok ? "success" : "danger"}>
                {item.ok ? "Pass" : "Fix"}
              </Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function FeedbackList({
  title,
  items,
  icon: Icon,
  tone,
}: {
  title: string;
  items: string[];
  icon: typeof CheckCircle2;
  tone: "success" | "warning";
}) {
  return (
    <div className="p-5 sm:p-6">
      <div className={cn("flex items-center gap-2 text-sm font-semibold", tone === "success" ? "text-emerald-700" : "text-amber-700")}>
        <Icon className="size-4" />
        {title}
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-5 text-foreground/78">
            <Check className={cn("mt-0.5 size-3.5 shrink-0", tone === "success" ? "text-emerald-700" : "text-amber-700")} />
            {item}
          </li>
        ))}
      </ul>
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
    <aside className="space-y-4 xl:sticky xl:top-8 xl:self-start">
      <section className="surface-card p-5">
        <div className="text-[11px] font-semibold tracking-[0.1em] text-brand uppercase">
          Review lens
        </div>
        <h2 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
          Target role.
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Set the role and experience level to make feedback more useful.
        </p>

        <div className="mt-5 space-y-4">
          <label className="block text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            Role
            <select
              className="mt-2 h-10 w-full rounded-lg border border-input bg-card px-3 text-sm font-normal text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/15"
              value={selectedRole}
              onChange={(event) => onRoleTargetChange?.(event.target.value)}
            >
              {roleTarget && !roleOptions.includes(roleTarget) ? (
                <option value={roleTarget}>{roleTarget}</option>
              ) : null}
              {roleOptions.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            Experience level
            <select
              className="mt-2 h-10 w-full rounded-lg border border-input bg-card px-3 text-sm font-normal text-foreground outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/15"
              value={selectedLevel}
              onChange={(event) => onTargetLevelChange?.(event.target.value)}
            >
              {targetLevel && !levelOptions.includes(targetLevel) ? (
                <option value={targetLevel}>{targetLevel}</option>
              ) : null}
              {levelOptions.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </label>
        </div>

        <Button
          variant="secondary"
          className="mt-5 w-full"
          onClick={onSaveTargetRole}
          disabled={isSavingRole}
        >
          <Save className="size-4" />
          {isSavingRole ? "Saving…" : "Save review lens"}
        </Button>
      </section>

      <section className="surface-card p-5">
        <div className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          Next actions
        </div>
        <div className="mt-4 space-y-3">
          {feedback.nextActions.map((item, index) => (
            <div key={item} className="flex gap-3 border-l-2 border-border pl-3">
              <span className="text-xs font-semibold text-brand">0{index + 1}</span>
              <p className="text-sm leading-5 text-foreground/80">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card p-5">
        <div className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
          File actions
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Your original document remains available whenever you need it.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onDownload}
            disabled={isDownloading}
          >
            <Download className="size-3.5" />
            {isDownloading ? "Preparing…" : "Download"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            <Trash2 className="size-3.5" />
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </section>
    </aside>
  );
}
