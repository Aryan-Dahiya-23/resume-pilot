import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDot,
  FileText,
  Gauge,
  Plus,
  Target,
  TrendingUp,
  Upload,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProgressRing } from "@/components/ui/progress-ring";
import {
  statusVariant,
  type Job,
  type JobStatus,
  type Resume,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function DashboardOverviewHeader({
  onUploadClick,
  onAddJobClick,
}: {
  onUploadClick?: () => void;
  onAddJobClick?: () => void;
}) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
          Today’s focus
        </div>
        <h1 className="max-w-2xl font-heading text-4xl leading-[0.98] font-medium tracking-[-0.035em] text-foreground sm:text-5xl">
          Move your job search forward.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          One focused resume improvement and a few thoughtful applications can
          change the shape of your week.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
        <Button onClick={onUploadClick}>
          <Upload className="size-4" />
          Upload resume
        </Button>
        <Button variant="secondary" onClick={onAddJobClick}>
          <Plus className="size-4" />
          Add job
        </Button>
      </div>
    </header>
  );
}

function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  helper: string;
  icon: typeof Gauge;
  tone?: "neutral" | "primary" | "success";
}) {
  return (
    <section className="surface-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            {label}
          </div>
          <div className="mt-2 text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
            {value}
          </div>
        </div>
        <span
          className={cn(
            "mt-0.5",
            tone === "primary" && "text-brand",
            tone === "success" && "text-emerald-700",
            tone === "neutral" && "text-muted-foreground",
          )}
        >
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{helper}</p>
    </section>
  );
}

export function DashboardMetrics({
  score,
  delta,
  weeklyApplications,
  interviewRate,
  hasResume,
}: {
  score: number;
  delta: number;
  weeklyApplications: number;
  interviewRate: number;
  hasResume: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <MetricCard
        label="Resume score"
        value={hasResume ? `${score}/100` : "Not scored"}
        helper={
          hasResume
            ? delta === 0
              ? "Upload a revision to measure progress."
              : `${delta > 0 ? "+" : ""}${delta} points from your last version.`
            : "Upload your first resume to get a baseline."
        }
        icon={Gauge}
        tone="primary"
      />
      <MetricCard
        label="Applications"
        value={String(weeklyApplications)}
        helper="Sent this week toward your target of 10."
        icon={Target}
        tone="neutral"
      />
      <MetricCard
        label="Interview rate"
        value={`${interviewRate}%`}
        helper="The share of applications moving to interview."
        icon={TrendingUp}
        tone="success"
      />
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
      <section className="surface-card flex min-h-[330px] flex-col justify-between overflow-hidden p-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-brand">
              <FileText className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold text-foreground">Resume momentum</h2>
              <p className="text-sm text-muted-foreground">
                Start with a clear baseline.
              </p>
            </div>
          </div>
          <h3 className="mt-10 max-w-md text-2xl font-bold tracking-[-0.025em] text-foreground">
            Your first useful recommendation is one upload away.
          </h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Get an ATS score, role-specific feedback, and a prioritized edit
            plan—not a wall of generic advice.
          </p>
        </div>
        <Button className="mt-8 w-fit" onClick={onUploadResume}>
          <Upload className="size-4" />
          Upload your resume
        </Button>
      </section>
    );
  }

  const improvements =
    nextActions.length > 0
      ? nextActions.slice(0, 3)
      : ["Add measurable outcomes to your strongest experience bullets"];

  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="text-brand">
              <FileText className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-semibold text-foreground">Resume momentum</h2>
              <p className="truncate text-sm text-muted-foreground">
                {latestResume.version} · {latestResume.roleTarget ?? "General role"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant={delta >= 0 ? "success" : "danger"}>
              {delta >= 0 ? `+${delta}` : delta} since last version
            </Badge>
            <Badge variant="neutral">Updated {latestResume.uploadedAt}</Badge>
          </div>

          <div className="mt-6">
            <div className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              Highest-impact fixes
            </div>
            <ul className="mt-3 space-y-3">
              {improvements.map((item, index) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center border border-border bg-muted text-[10px] font-bold text-foreground">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-5 text-foreground/80">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-4 border-l border-border bg-muted/35 p-4 sm:flex-col">
          <ProgressRing value={latestResume.score} />
          <div className="sm:text-center">
            <div className="text-xs font-semibold text-foreground">
              ATS readiness
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {latestResume.score >= 80
                ? "Strong foundation"
                : "Room to improve"}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border/70 bg-muted/25 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-muted-foreground">
          Fix one priority, then upload a new version to measure the lift.
        </p>
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/dashboard/resumes/${latestResume.id}`}>
            Open review
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

const pipelineStages: Array<{
  status: JobStatus;
  label: string;
  color: string;
}> = [
  { status: "Saved", label: "Saved", color: "bg-slate-400" },
  { status: "Applied", label: "Applied", color: "bg-brand" },
  { status: "Interview", label: "Interview", color: "bg-amber-500" },
  { status: "Offer", label: "Offer", color: "bg-emerald-500" },
];

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
    <section className="surface-card overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-brand">
              <BriefcaseBusiness className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold text-foreground">Job pipeline</h2>
              <p className="text-sm text-muted-foreground">
                {jobs.length} opportunities tracked
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/jobs">
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {pipelineStages.map((stage) => (
            <div
              key={stage.status}
              className="rounded-lg border border-border/70 bg-muted/25 p-3"
            >
              <div className="flex items-center gap-2">
                <span className={cn("size-2 rounded-full", stage.color)} />
                <span className="text-xs font-medium text-muted-foreground">
                  {stage.label}
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold tracking-[-0.03em] text-foreground">
                {jobsByStatus[stage.status] ?? 0}
              </div>
            </div>
          ))}
        </div>

        {hasJobs ? (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                Recent activity
              </div>
              <div className="text-xs text-muted-foreground">
                {interviewRate}% interview rate
              </div>
            </div>
            <div className="divide-y divide-border/60 overflow-hidden rounded-lg border border-border/70">
              {jobs.slice(0, 4).map((job) => (
                <Link
                  key={job.id}
                  href={`/dashboard/jobs/${job.id}`}
                  className="group flex items-center justify-between gap-3 bg-card px-4 py-3 transition-colors hover:bg-muted/45"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-foreground">
                      {job.role}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {job.company}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                      <CalendarDays className="size-3.5" />
                      {job.when}
                    </div>
                    <Badge variant={statusVariant(job.status)}>
                      {job.status}
                    </Badge>
                    <ChevronRight className="size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/30 p-5">
            <div className="text-sm font-semibold text-foreground">
              Your pipeline is ready.
            </div>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Add a role you are considering—even before you apply—to keep the
              opportunity visible.
            </p>
            <Button className="mt-4" size="sm" asChild>
              <Link href="/dashboard/jobs">
                <Plus className="size-3.5" />
                Add your first job
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export function NextActionsCard({ items }: { items: string[] }) {
  const actions =
    items.length > 0
      ? items.slice(0, 3)
      : [
          "Improve the strongest bullet in your latest role",
          "Apply to three well-matched opportunities",
          "Schedule one follow-up for this week",
        ];

  return (
    <section className="surface-card border-t-2 border-t-brand p-5 sm:p-6">
      <div>
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-brand uppercase">
          <CircleDot className="size-3.5" />
          Highest-impact action
        </div>
        <h2 className="mt-4 max-w-lg font-heading text-3xl leading-[1.05] font-medium tracking-[-0.025em] text-foreground">
          {actions[0]}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          Complete the most valuable task first. Momentum is easier when the
          next step is obvious.
        </p>

        <Button className="mt-6" asChild>
          <Link href="/dashboard/resumes">
            Start this action
            <ArrowRight className="size-4" />
          </Link>
        </Button>

        {actions.length > 1 ? (
          <div className="mt-7 border-t border-border pt-4">
            <div className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
              Up next
            </div>
            <div className="mt-3 space-y-2.5">
              {actions.slice(1).map((action) => (
                <div
                  key={action}
                  className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"
                >
                  <span className="mt-0.5 grid size-4 shrink-0 place-items-center border border-border bg-muted">
                    <Check className="size-2.5" />
                  </span>
                  {action}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
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
  const target = 10;
  const progress = Math.min(100, Math.round((applications / target) * 100));

  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="text-emerald-700">
          <TrendingUp className="size-5" />
        </span>
        <div>
          <h2 className="font-semibold text-foreground">Weekly momentum</h2>
          <p className="text-sm text-muted-foreground">
            A simple pulse on your activity.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              Application goal
            </div>
            <div className="mt-1 text-2xl font-bold tracking-[-0.03em] text-foreground">
              {applications}
              <span className="text-base font-medium text-muted-foreground">
                /{target}
              </span>
            </div>
          </div>
          <div className="text-xs font-semibold text-brand">{progress}%</div>
        </div>
        <Progress value={progress} className="mt-3 h-2" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border/60 bg-muted/35 p-3">
          <div className="text-xs text-muted-foreground">Jobs added</div>
          <div className="mt-1 text-xl font-bold text-foreground">
            {jobsAdded}
          </div>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/35 p-3">
          <div className="text-xs text-muted-foreground">Interviews</div>
          <div className="mt-1 text-xl font-bold text-foreground">
            {interviews}
          </div>
        </div>
      </div>

      <p className="mt-5 border-t border-border/60 pt-4 text-xs leading-5 text-muted-foreground">
        {summary}
      </p>
    </section>
  );
}
