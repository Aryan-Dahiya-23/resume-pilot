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
  Plus,
  Sparkles,
  TrendingUp,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
          <Sparkles className="size-3.5" />
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
      <Card className="rounded-3xl border-slate-200/90 shadow-xs">
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
        <CardContent>
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
              <Button onClick={onUploadResume} className="w-full sm:w-auto">
                <Upload className="size-4" />
                Upload Resume PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="min-w-0 flex-1 text-center sm:text-left w-full">
            <div className="flex items-center justify-center sm:justify-start gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FileCheck2 className="size-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Active Document
                </div>
                <h3 className="text-lg font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                  {latestResume.version}
                </h3>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge variant={delta >= 0 ? "success" : "danger"} withDot>
                {delta >= 0 ? `+${delta}` : delta} pts vs previous
              </Badge>
              {latestResume.roleTarget ? (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 truncate max-w-[180px]">
                  {latestResume.roleTarget}
                </span>
              ) : null}
            </div>

            <div className="mt-4 truncate text-xs text-slate-400">
              Uploaded {latestResume.uploadedAt} • {latestResume.fileName}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <ProgressRing value={latestResume.score} size={110} strokeWidth={10} />
          </div>
        </div>

        {/* Priority AI Action Callout */}
        {nextActions.length > 0 ? (
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <Sparkles className="size-3.5 text-emerald-600" />
              <span>Priority AI Recommendation</span>
            </div>
            <p className="mt-1 text-xs text-emerald-950 font-medium leading-relaxed">
              {nextActions[0]}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <Button variant="secondary" size="sm" asChild className="w-full sm:w-auto">
            <Link href="/dashboard/resumes">
              View Version History
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>

          <Button size="sm" asChild className="w-full sm:w-auto shadow-xs shadow-emerald-600/20">
            <Link href={`/dashboard/resumes/${latestResume.id}`}>
              Open Full Audit Report
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
}: {
  jobs: Job[];
  jobsByStatus: Record<JobStatus, number>;
  interviewRate: number;
}) {
  const recentJobs = jobs.slice(0, 3);
  const totalTracked = jobs.length;

  return (
    <Card className="rounded-3xl border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Briefcase className="size-5" />
            </div>
            <div>
              <CardTitle>Application Pipeline</CardTitle>
              <CardDescription>
                {totalTracked} opportunities currently tracked
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
            <Flame className="size-3.5 text-teal-600" />
            <span>{interviewRate}% Interview Rate</span>
          </div>
        </div>

        {/* 4-Stage Metric Grid */}
        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
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

        {/* Recent Jobs Mini List */}
        <div className="mt-6 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Recent Pipeline Activity
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
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
              No jobs in tracker yet.
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
          <Button variant="secondary" size="sm" asChild className="w-full sm:w-auto">
            <Link href="/dashboard/jobs">
              Go to Job Pipeline
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function NextActionsCard({ items }: { items: string[] }) {
  return (
    <Card className="rounded-3xl border-slate-200/90 shadow-xs">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base">High-Impact Next Steps</CardTitle>
            <CardDescription>
              Prioritized checklist generated from your latest resume audit.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {items.length > 0 ? (
            items.map((action, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5"
              >
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium break-words">
                  {action}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
              All recommended adjustments completed! Upload a new version to re-evaluate.
            </div>
          )}
        </div>
      </CardContent>
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
  return (
    <Card className="rounded-3xl border-slate-200/90 shadow-xs">
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Calendar className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base">Weekly Momentum</CardTitle>
            <CardDescription>
              Activity logged over the past 7 rolling days.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Executive Summary
          </div>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">
            {summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
