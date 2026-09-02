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
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
          <Sparkles className="size-3.5" />
          <span>{today} • Intelligence Hub</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Career Command Center
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor your resume ATS readiness, track active interviews, and maintain momentum.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Button onClick={onUploadClick} className="shadow-xs shadow-indigo-500/20">
          <Upload className="size-4" />
          Upload Resume
        </Button>
        <Button variant="secondary" onClick={onAddJobClick}>
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
            <div className="flex size-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
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
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white shadow-xs text-indigo-600 mb-3">
              <Upload className="size-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-900">
              Upload Your First Resume
            </h4>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              Receive automated DeepSeek AI analysis, ATS compatibility score, and bullet-level rewrite recommendations.
            </p>
            <div className="mt-5">
              <Button onClick={onUploadResume}>
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
      <div className="p-6 sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileCheck2 className="size-5" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Active Document
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {latestResume.version}
                </h3>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant={delta >= 0 ? "success" : "danger"} withDot>
                {delta >= 0 ? `+${delta}` : delta} pts vs previous
              </Badge>
              <Badge variant="neutral">
                Role: {latestResume.roleTarget ?? "General Engineering"}
              </Badge>
              <span className="text-xs text-slate-400">
                Uploaded {latestResume.uploadedAt}
              </span>
            </div>

            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                High-Impact Optimizations
              </div>
              <ul className="mt-3 space-y-2.5">
                {nextActions.slice(0, 3).map((item, index) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-slate-700 bg-slate-50/80 rounded-xl p-2.5 border border-slate-100"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-indigo-100 font-mono text-[11px] font-bold text-indigo-700 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center sm:pl-4">
            <ProgressRing value={latestResume.score} size={130} strokeWidth={11} />
            <span className="mt-2 text-xs font-medium text-slate-500">
              {latestResume.score >= 80 ? "Optimal Candidate" : "Improvements Needed"}
            </span>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 pt-5">
          <Button variant="secondary" asChild>
            <Link href={`/dashboard/resumes/${latestResume.id}`}>
              Inspect Full Audit Report
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>

          <span className="text-xs text-slate-400">
            Re-upload after editing to measure ATS score growth.
          </span>
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
  const hasJobs = jobs.length > 0;

  return (
    <Card className="rounded-3xl border-slate-200/90 shadow-xs">
      <div className="p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Briefcase className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Application Pipeline
                </h3>
                <p className="text-xs text-slate-500">
                  {jobs.length} total opportunities in flight
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {Object.entries(jobsByStatus).map(([status, count]) => (
                <Badge
                  key={status}
                  variant={statusVariant(status)}
                  withDot
                  className="px-2.5 py-1"
                >
                  {status}: <span className="font-bold ml-1">{count}</span>
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 text-center sm:text-right min-w-[140px]">
            <div className="text-xs font-medium text-slate-500">Interview Rate</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
              {interviewRate}%
            </div>
            <div className="text-[11px] font-medium text-emerald-600 mt-0.5">
              Applied ➔ Interview
            </div>
          </div>
        </div>

        <div className="mt-6">
          {hasJobs ? (
            <>
              <div className="flex items-center justify-between pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Recent Activity
                </span>
                <Link
                  href="/dashboard/jobs"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 hover:underline inline-flex items-center gap-1"
                >
                  View full board
                  <ArrowRight className="size-3" />
                </Link>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
                <div className="divide-y divide-slate-100">
                  {jobs.slice(0, 5).map((job) => (
                    <Link
                      key={job.id}
                      href={`/dashboard/jobs/${job.id}`}
                      className="group flex w-full items-center justify-between gap-3 p-3.5 text-left transition-colors hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {job.company}
                        </div>
                        <div className="truncate text-xs text-slate-500">
                          {job.role}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden items-center gap-1 text-xs text-slate-400 sm:flex">
                          <Calendar className="size-3.5" />
                          {job.when}
                        </div>
                        <Badge variant={statusVariant(job.status)} withDot>
                          {job.status}
                        </Badge>
                        <ChevronRight className="size-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/dashboard/jobs">
                    Go to Job Pipeline
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </Button>
                <span className="text-xs text-slate-400">
                  Tip: Target 3-5 applications per week for consistent response rates.
                </span>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center">
              <div className="text-sm font-semibold text-slate-800">
                Pipeline is empty
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Track your active job applications to calculate response rates and interview velocity.
              </p>
              <div className="mt-4">
                <Button size="sm" asChild>
                  <Link href="/dashboard/jobs">
                    <Plus className="size-3.5" />
                    Add First Job
                  </Link>
                </Button>
              </div>
            </div>
          )}
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
          "Quantify impact metrics on your most recent project bullet",
          "Add 3 missing keywords for target Fullstack Engineer role",
          "Schedule a follow-up for applied positions",
        ];

  return (
    <Card className="rounded-3xl border-slate-200/90 shadow-xs border-t-4 border-t-indigo-600">
      <div className="p-6 sm:p-7">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
          <Flame className="size-4 text-indigo-600" />
          <span>Priority Action</span>
        </div>

        <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-900">
          {actions[0]}
        </h3>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          High-impact resume improvements significantly improve your initial ATS screening pass rate.
        </p>

        <div className="mt-5">
          <Button asChild>
            <Link href="/dashboard/resumes">
              Execute Optimization
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {actions.length > 1 ? (
          <div className="mt-6 border-t border-slate-100 pt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Next Up in Queue
            </span>
            <div className="mt-3 space-y-2">
              {actions.slice(1).map((action) => (
                <div
                  key={action}
                  className="flex items-start gap-2.5 text-xs text-slate-600"
                >
                  <CheckCircle2 className="size-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{action}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
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
  return (
    <Card className="rounded-3xl border-slate-200/90 shadow-xs">
      <div className="p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">Weekly Pulse</h3>
          </div>
          <span className="text-xs font-medium text-slate-400">Past 7 Days</span>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-center">
            <div className="text-[11px] font-medium text-slate-500">Jobs Added</div>
            <div className="mt-1 text-2xl font-extrabold text-slate-900">
              {jobsAdded}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-center">
            <div className="text-[11px] font-medium text-slate-500">Applications</div>
            <div className="mt-1 text-2xl font-extrabold text-slate-900">
              {applications}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-center">
            <div className="text-[11px] font-medium text-slate-500">Interviews</div>
            <div className="mt-1 text-2xl font-extrabold text-emerald-600">
              {interviews}
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
          {summary || "Consistent weekly outreach dramatically increases interview invitation likelihood."}
        </p>
      </div>
    </Card>
  );
}
