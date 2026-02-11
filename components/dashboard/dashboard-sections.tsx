import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  ChevronRight,
  FileText,
  Plus,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import {
  statusVariant,
  type Job,
  type JobStatus,
  type Resume,
} from "@/lib/mock-data";

export function DashboardOverviewHeader() {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm text-zinc-500">Overview</div>
        <h1 className="text-xl font-semibold text-zinc-900">
          Resume + Job Hunt Dashboard
        </h1>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button>
          <Upload className="h-4 w-4" />
          Upload resume
        </Button>
        <Button variant="secondary">
          <Plus className="h-4 w-4" />
          Add job
        </Button>
      </div>
    </div>
  );
}

export function ResumeOverviewCard({
  latestResume,
  delta,
  nextActions,
}: {
  latestResume: Resume;
  delta: number;
  nextActions: string[];
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-zinc-900 text-white">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-zinc-900">
                Latest resume
              </div>
              <div className="truncate text-sm text-zinc-500">
                {latestResume.version} • Uploaded {latestResume.uploadedAt}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant={delta >= 0 ? "success" : "danger"}>
              {delta >= 0 ? `+${delta}` : delta} vs last version
            </Badge>
            <Badge variant="neutral">
              Target: {latestResume.roleTarget ?? "Not set"}
            </Badge>
          </div>
        </div>

        <div className="self-start sm:self-auto">
          <ProgressRing value={latestResume.score} />
        </div>
      </div>

      <div className="mt-5">
        <div className="text-sm font-medium text-zinc-900">
          Top improvements
        </div>
        <ul className="mt-3 space-y-2">
          {nextActions.slice(0, 3).map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-zinc-700"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link href={`/dashboard/resumes/${latestResume.id}`}>
          <Button variant="secondary" className="px-3">
            View feedback
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>

        <div className="sm:ml-auto sm:max-w-[280px]">
          <div className="rounded-2xl bg-zinc-50 px-3 py-2 text-xs text-zinc-600 sm:text-right">
            Tip: upload a new version after edits to track improvement.
          </div>
        </div>
      </div>
    </section>
  );
}

export function JobPipelineCard({
  jobs,
  jobsByStatus,
}: {
  jobs: Job[];
  jobsByStatus: Record<JobStatus, number>;
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-zinc-900 text-white">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-medium text-zinc-900">
                Job pipeline
              </div>
              <div className="text-sm text-zinc-500">
                {jobs.length} jobs tracked
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(jobsByStatus).map(([status, count]) => (
              <Badge key={status} variant={statusVariant(status)}>
                {status}: {count}
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
          <div className="text-xs text-zinc-500">Interview rate</div>
          <div className="mt-1 text-2xl font-semibold text-zinc-900">16%</div>
          <div className="mt-1 text-xs text-zinc-500">Applied → Interview</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-zinc-900">Recent jobs</div>
          <Link
            href="/dashboard/jobs"
            className="text-sm font-medium text-zinc-900 hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200">
          <div className="divide-y divide-zinc-200">
            {jobs.slice(0, 5).map((job) => (
              <Link
                key={job.id}
                href={`/dashboard/jobs/${job.id}`}
                className="flex w-full items-center justify-between gap-3 bg-white px-4 py-3 text-left hover:bg-zinc-50"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-zinc-900">
                    {job.company}
                  </div>
                  <div className="truncate text-sm text-zinc-500">
                    {job.role}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden items-center gap-1 text-xs text-zinc-500 sm:flex">
                    <Calendar className="h-3.5 w-3.5" />
                    {job.when}
                  </div>
                  <Badge variant={statusVariant(job.status)}>
                    {job.status}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-zinc-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Link href="/dashboard/jobs">
            <Button variant="secondary" className="px-3">
              Go to jobs
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>

          <div className="sm:ml-auto sm:max-w-[280px]">
            <div className="rounded-2xl bg-zinc-50 px-3 py-2 text-xs text-zinc-600 sm:text-right">
              Tip: keep “Saved” jobs short. Apply fast.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NextActionsCard() {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-zinc-900">What to do next</div>
      <div className="mt-3 space-y-2">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="text-sm font-medium text-zinc-900">
            Fix 2 resume bullets today
          </div>
          <div className="mt-1 text-sm text-zinc-600">
            Add impact + numbers. Your score will jump quickly.
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="text-sm font-medium text-zinc-900">
            Apply to 3 roles from your Saved list
          </div>
          <div className="mt-1 text-sm text-zinc-600">
            Momentum beats perfection.
          </div>
        </div>
      </div>
    </section>
  );
}

export function WeeklySnapshotCard() {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-zinc-900">Weekly snapshot</div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="text-xs text-zinc-500">Jobs added</div>
          <div className="mt-1 text-xl font-semibold text-zinc-900">6</div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="text-xs text-zinc-500">Applications</div>
          <div className="mt-1 text-xl font-semibold text-zinc-900">4</div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="text-xs text-zinc-500">Interviews</div>
          <div className="mt-1 text-xl font-semibold text-zinc-900">1</div>
        </div>
      </div>

      <div className="mt-4 text-sm text-zinc-600">
        Your resume score is improving — now push volume. The fastest path is
        10–15 high-quality applications/week.
      </div>
    </section>
  );
}
