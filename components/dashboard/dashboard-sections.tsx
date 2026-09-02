"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  FileText,
  Flame,
  HelpCircle,
  Lightbulb,
  ListChecks,
  Plus,
  Target,
  TrendingUp,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProgressRing } from "@/components/ui/progress-ring";
import {
  statusVariant,
  type Job,
  type JobStatus,
  type Resume,
} from "@/lib/mock-data";

export function DashboardOverviewHeader({
  onUploadClick,
  onAddJobClick,
}: {
  onUploadClick?: () => void;
  onAddJobClick?: () => void;
}) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{today} • Intelligence Hub</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Career Command Center
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Monitor your resume ATS readiness, track active interviews, and maintain momentum.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <Button onClick={onUploadClick} className="shadow-xs shadow-emerald-600/20 w-full sm:w-auto">
          <Upload className="size-4" />
          Upload Resume
        </Button>
        <Button variant="secondary" onClick={onAddJobClick} className="w-full sm:w-auto">
          <Plus className="size-4" />
          Track Job
        </Button>
      </div>
    </div>
  );
}

export function ResumeOverviewCard({
  latestResume,
  delta,
  nextActions,
  onUploadResume,
}: {
  latestResume: Resume;
  delta: number;
  nextActions: string[];
  onUploadResume?: () => void;
}) {
  const hasResume = Boolean(latestResume.id);

  if (!hasResume) {
    return (
      <Card className="rounded-3xl border-slate-200/90 shadow-xs flex flex-col justify-between">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <FileText className="size-5" />
            </div>
            <div>
              <CardTitle>Resume Intelligence</CardTitle>
              <CardDescription>No resume uploaded yet</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white shadow-xs text-emerald-600 mb-3">
              <Upload className="size-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-900">
              Upload Your First Resume
            </h4>
            <p className="mx-auto mt-1 max-w-sm text-xs sm:text-sm text-slate-500">
              Receive automated DeepSeek AI analysis, ATS compatibility score, and bullet-level rewrite recommendations.
            </p>
            <div className="mt-5">
              <Button onClick={onUploadResume} className="w-full sm:w-auto shadow-xs shadow-emerald-600/20">
                <Upload className="size-4" />
                Upload Resume PDF
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 flex items-start gap-2.5">
            <Lightbulb className="size-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              <strong className="font-semibold">Quick Start Tip:</strong> Upload any PDF or DOCX resume to benchmark your baseline ATS score and reveal missing high-value keywords for your target role.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Top improvements list (from nextActions)
  const topImprovements =
    nextActions.length > 0
      ? nextActions.slice(0, 3)
      : [
          "Quantify recent engineering achievements with measurable business impact metrics.",
          "Incorporate missing core domain keywords into your experience bullet points.",
          "Ensure formatting headers strictly align with standard applicant tracking parsers.",
        ];

  return (
    <Card className="rounded-3xl border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="p-5 sm:p-7 space-y-6">
        {/* Document Header & Score Ring */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="min-w-0 flex-1 text-center sm:text-left w-full">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <FileCheck2 className="size-5" />
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Active Document
                </div>
                <h3 className="text-lg font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                  {latestResume.version}
                </h3>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge variant={delta >= 0 ? "success" : "danger"} withDot>
                {delta >= 0 ? `+${delta}` : delta} pts vs previous
              </Badge>
              {latestResume.roleTarget ? (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 truncate max-w-[180px]">
                  Target: {latestResume.roleTarget}
                </span>
              ) : null}
            </div>

            <div className="mt-2 truncate text-xs text-slate-400">
              Uploaded {latestResume.uploadedAt} • {latestResume.fileName}
            </div>
          </div>

          <div className="flex flex-col items-center shrink-0">
            <ProgressRing value={latestResume.score} size={105} strokeWidth={9} />
            <span className="mt-1 text-[11px] font-semibold text-slate-500">
              {latestResume.score >= 80
                ? "Ready to Apply"
                : latestResume.score >= 60
                  ? "Competitive"
                  : "Needs Optimization"}
            </span>
          </div>
        </div>

        {/* Top Improvements Section (Restored & Enhanced from Main) */}
        <div className="space-y-2.5 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <ListChecks className="size-3.5 text-emerald-600" />
              <span>Top Recommended Improvements</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded px-1.5 py-0.5 border border-emerald-100">
              DeepSeek AI
            </span>
          </div>

          <ul className="space-y-2 pt-1">
            {topImprovements.map((improvement, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed font-medium"
              >
                <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold mt-0.5">
                  {index + 1}
                </span>
                <span className="break-words">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contextual Coaching Pro-Tip (From Main Branch) */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 flex items-start gap-2.5">
          <Lightbulb className="size-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-950 leading-relaxed font-medium">
            <strong className="font-semibold text-emerald-900">Pro-Tip:</strong> Upload a new version after applying edits to benchmark your ATS score progression and verify bullet point impact.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="secondary" size="sm" asChild className="w-full sm:w-auto">
              <Link href="/dashboard/resumes">
                Version History
                <ChevronRight className="size-3.5" />
              </Link>
            </Button>
            {onUploadResume ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onUploadResume}
                className="w-full sm:w-auto text-emerald-700 hover:bg-emerald-50"
              >
                <Upload className="size-3.5" />
                Upload Revision
              </Button>
            ) : null}
          </div>

          <Button size="sm" asChild className="w-full sm:w-auto shadow-xs shadow-emerald-600/20">
            <Link href={`/dashboard/resumes/${latestResume.id}`}>
              Full Audit Report
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function JobPipelineCard({
  jobs,
  jobsByStatus,
  interviewRate,
  onAddJobClick,
}: {
  jobs: Job[];
  jobsByStatus: Record<JobStatus, number>;
  interviewRate: number;
  onAddJobClick?: () => void;
}) {
  const recentJobs = jobs.slice(0, 4);
  const totalTracked = jobs.length;

  return (
    <Card className="rounded-3xl border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between">
      <div className="p-5 sm:p-7 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 shrink-0">
              <Briefcase className="size-5" />
            </div>
            <div>
              <CardTitle>Application Pipeline</CardTitle>
              <CardDescription>
                {totalTracked} active opportunities tracked
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            <Flame className="size-3.5 text-teal-600" />
            <span>{interviewRate}% Interview Rate</span>
          </div>
        </div>

        {/* 4-Stage Metric Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center">
            <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Saved
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
              {jobsByStatus.Saved ?? 0}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center">
            <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Applied
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
              {jobsByStatus.Applied ?? 0}
            </div>
          </div>
          <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-3 text-center">
            <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-teal-700">
              Interview
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-bold text-teal-900">
              {jobsByStatus.Interview ?? 0}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3 text-center">
            <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              Offers
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-bold text-emerald-900">
              {jobsByStatus.Offer ?? 0}
            </div>
          </div>
        </div>

        {/* Strategy Coaching Tip (From Main Branch) */}
        <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-3.5 flex items-start gap-2.5">
          <Lightbulb className="size-4 text-teal-600 shrink-0 mt-0.5" />
          <p className="text-xs text-teal-950 leading-relaxed font-medium">
            <strong className="font-semibold text-teal-900">Strategy Tip:</strong> Keep &quot;Saved&quot; jobs short and apply within 48 hours. Candidates who submit within the first 2 days receive 3x higher callback rates.
          </p>
        </div>

        {/* Recent Jobs Mini List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Recent Pipeline Activity</span>
            <Link href="/dashboard/jobs" className="text-emerald-700 hover:underline capitalize">
              View All ({totalTracked})
            </Link>
          </div>

          {recentJobs.length > 0 ? (
            recentJobs.map((job) => (
              <Link
                key={job.id}
                href={`/dashboard/jobs/${job.id}`}
                className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-2xs transition-colors hover:bg-slate-50"
              >
                <div className="min-w-0 pr-3">
                  <div className="truncate text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {job.company}
                  </div>
                  <div className="truncate text-[11px] text-slate-500">
                    {job.role}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={statusVariant(job.status)} withDot>
                    {job.status}
                  </Badge>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">{job.when}</span>
                  <ChevronRight className="size-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
              No jobs in tracker yet. Track opportunities to monitor your interview conversion rate.
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4">
          {onAddJobClick ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddJobClick}
              className="w-full sm:w-auto text-emerald-700 hover:bg-emerald-50"
            >
              <Plus className="size-3.5" />
              Quick Add Job
            </Button>
          ) : <div />}

          <Button variant="secondary" size="sm" asChild className="w-full sm:w-auto">
            <Link href="/dashboard/jobs">
              Go to Full Pipeline
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function NextActionsCard({ items }: { items: string[] }) {
  const actions =
    items.length > 0
      ? items.slice(0, 3)
      : [
          "Optimize 2 bullet points in your primary engineering role with measurable metrics.",
          "Apply to 3 high-affinity positions from your Saved opportunity list.",
          "Target role keywords: verify tech stack coverage in your resume summary.",
        ];

  const actionGuidance = [
    "High Impact: Action-verb + metric rewrites yield the fastest ATS score boost.",
    "Pipeline Momentum: Early applications enjoy significantly higher recruiter visibility.",
    "Keyword Precision: Exact skill matches satisfy enterprise ATS filter thresholds.",
  ];

  return (
    <Card className="rounded-3xl border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden">
      <div className="p-5 sm:p-7 space-y-4 flex-1">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <CheckCircle2 className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base">What to Do Next</CardTitle>
            <CardDescription>
              High-impact priority checklist generated from your latest resume evaluation.
            </CardDescription>
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
          {actions.map((action, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 space-y-1"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold mt-0.5">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-800 leading-relaxed font-semibold break-words">
                    {action}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-normal mt-0.5">
                    {actionGuidance[index] || "Consistency compounds over time."}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coaching Tip */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 flex items-start gap-2">
          <Lightbulb className="size-3.5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong className="font-semibold text-slate-800">Habit:</strong> Focus on 1–2 high-impact edits each morning before submitting applications for peak callback conversions.
          </p>
        </div>
      </div>

      <div className="px-5 sm:px-7 pb-5 sm:pb-6 pt-0">
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-[11px] text-slate-400 font-medium">Prioritized by ATS scoring impact</span>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/dashboard/resumes">
              Review Audits
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function WeeklySnapshotCard({
  jobsAdded,
  applications,
  interviews,
  summary,
}: {
  jobsAdded: number;
  applications: number;
  interviews: number;
  summary: string;
}) {
  const hasWeeklyActivity = jobsAdded > 0 || applications > 0 || interviews > 0;
  const weeklyTarget = 10;
  const weeklyProgress = Math.min(
    100,
    Math.max(0, Math.round((applications / weeklyTarget) * 100)),
  );
  const remaining = Math.max(0, weeklyTarget - applications);

  return (
    <Card className="rounded-3xl border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden">
      <div className="p-5 sm:p-7 space-y-4 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-teal-50 text-teal-600 shrink-0">
              <Calendar className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base">Weekly Momentum</CardTitle>
              <CardDescription>
                Activity logged over the past 7 rolling days.
              </CardDescription>
            </div>
          </div>

          <Badge variant={hasWeeklyActivity ? "success" : "neutral"} withDot>
            {hasWeeklyActivity ? "Active Sprint" : "Sprint Inactive"}
          </Badge>
        </div>

        {/* 3 Metrics */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-center">
            <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Added
            </div>
            <div className="mt-1 text-lg sm:text-2xl font-bold text-slate-900">
              {jobsAdded}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-center">
            <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Sent
            </div>
            <div className="mt-1 text-lg sm:text-2xl font-bold text-slate-900">
              {applications}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3 text-center">
            <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              Interviews
            </div>
            <div className="mt-1 text-lg sm:text-2xl font-bold text-emerald-900">
              {interviews}
            </div>
          </div>
        </div>

        {/* Weekly Target Progress Bar */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-teal-600" />
              Weekly Sprint Goal
            </span>
            <span className="font-bold text-slate-900">
              {applications} <span className="font-normal text-slate-400">/ {weeklyTarget} sent ({weeklyProgress}%)</span>
            </span>
          </div>
          <Progress value={weeklyProgress} className="h-2" />
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>
              {applications >= weeklyTarget
                ? "Weekly application target achieved! 🎯"
                : `${remaining} more application${remaining === 1 ? "" : "s"} to reach optimal momentum`}
            </span>
            <span className="font-semibold text-teal-700">
              {weeklyProgress >= 70 ? "Optimal Pace" : weeklyProgress > 0 ? "In Progress" : "Not Started"}
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Weekly Executive Summary</span>
            {hasWeeklyActivity ? (
              <Badge variant="brand" className="text-[10px] px-1.5 py-0">
                Active
              </Badge>
            ) : (
              <Badge variant="neutral" className="text-[10px] px-1.5 py-0">
                Needs Push
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
            {summary}
          </p>
        </div>

        {/* Consistency Rule Callout */}
        <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-3 flex items-start gap-2">
          <Lightbulb className="size-3.5 text-teal-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-teal-950 leading-relaxed">
            <strong className="font-semibold text-teal-900">Consistency Rule:</strong> Submitting 5–10 tailored applications per week creates steady interview pipeline velocity without candidate burnout.
          </p>
        </div>
      </div>

      <div className="px-5 sm:px-7 pb-5 sm:pb-6 pt-0">
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-[11px] text-slate-400 font-medium">Sprint resets every Monday</span>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/dashboard/jobs">
              Track Applications
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
