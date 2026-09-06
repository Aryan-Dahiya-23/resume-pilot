"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CircleArrowUp,
  FileText,
  MessagesSquare,
  Plus,
  Sprout,
  Target,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useCurrentDbUser } from "@/hooks/queries";
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
  const { data: user } = useCurrentDbUser();
  const firstName = user?.name?.trim().split(" ")[0];
  return (
    <PageHeader
      eyebrow="YOUR NEXT CHAPTER"
      title={
        firstName ? `Welcome back, ${firstName}.` : "Let’s make your next move."
      }
      description="A little clarity on where you are. A clear path to what’s next."
      actions={
        <>
          <Button variant="secondary" onClick={onAddJobClick}>
            <Plus size={16} />
            Add a job
          </Button>
          <Button onClick={onUploadClick}>
            <Upload size={16} />
            Upload resume
          </Button>
        </>
      }
    />
  );
}

export function OverviewMetrics({
  score,
  jobsByStatus,
  interviewRate,
}: {
  score: number | null;
  jobsByStatus: Record<JobStatus, number>;
  interviewRate: number;
}) {
  const total = Object.values(jobsByStatus).reduce((a, b) => a + b, 0);
  const metrics = [
    {
      label: "Latest resume score",
      value: score === null ? "—" : score,
      suffix: score === null ? "" : "/ 100",
      icon: FileText,
      foot:
        score === null
          ? "Your first review starts here"
          : "An estimate of resume readiness",
    },
    {
      label: "Opportunities tracked",
      value: total,
      icon: BriefcaseBusiness,
      foot: `${jobsByStatus.Saved} saved for your next step`,
    },
    {
      label: "In conversation",
      value: jobsByStatus.Interview,
      icon: MessagesSquare,
      foot: "Applications at interview stage",
    },
    {
      label: "Interview rate",
      value: `${interviewRate}%`,
      icon: CircleArrowUp,
      foot: `${jobsByStatus.Offer} ${jobsByStatus.Offer === 1 ? "offer" : "offers"} in your pipeline`,
    },
  ];
  return (
    <div className="metric-grid">
      {metrics.map((item) => (
        <section key={item.label} className="panel metric">
          <div className="metric-head">
            <h2>{item.label}</h2>
            <item.icon size={16} className="metric-icon" strokeWidth={1.6} />
          </div>
          <div className="metric-value">
            {item.value}
            <span className="ml-1.5 text-sm font-normal tracking-normal text-zinc-400">
              {item.suffix}
            </span>
          </div>
          <p className="metric-foot">{item.foot}</p>
        </section>
      ))}
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
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2 className="section-title">Your resume, at a glance</h2>
          <p className="panel-kicker">Make every word work for you.</p>
        </div>
        <FileText size={18} className="text-zinc-400" />
      </div>
      {latestResume.id ? (
        <>
          <div className="resume-overview-body">
            <div className="resume-file">
              <div className="icon-tile">
                <FileText size={18} />
              </div>
              <div className="min-w-0">
                <h3>{latestResume.fileName}</h3>
                <p>
                  {latestResume.version} · {latestResume.uploadedAt}
                </p>
              </div>
              <span className="ml-auto">
                <Badge variant="success">Latest</Badge>
              </span>
            </div>
            <div className="resume-score-strip">
              <div>
                <span className="eyebrow !text-[10px]">RESUME READINESS</span>
                <h3 className="mt-2 text-xl font-medium tracking-tight">
                  {latestResume.score >= 75
                    ? "A strong foundation."
                    : latestResume.score >= 50
                      ? "Room to tell more."
                      : "Let’s build from here."}
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  {latestResume.roleTarget || "General resume review"}
                </p>
                <div className="mt-3">
                  <Badge variant={delta >= 0 ? "success" : "warning"}>
                    {delta > 0 ? "+" : ""}
                    {delta} points vs. previous version
                  </Badge>
                </div>
              </div>
              <ProgressRing value={latestResume.score} />
            </div>
            {nextActions.length > 0 && (
              <div className="mt-4 flex items-start gap-2 text-xs leading-6 text-zinc-500">
                <Target size={14} className="mt-1 shrink-0 text-[#819e60]" />
                <p>{nextActions[0]}</p>
              </div>
            )}
          </div>
          <div className="panel-bottom">
            <span className="text-xs text-zinc-400">
              One edit closer to your next role.
            </span>
            <Link
              href={`/dashboard/resumes/${latestResume.id}`}
              className="text-link"
            >
              Open feedback
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </>
      ) : (
        <div className="resume-overview-body">
          <button
            type="button"
            className="drop-zone w-full !py-8"
            onClick={onUploadResume}
          >
            <span className="icon-tile mb-4 !h-12 !w-12 !bg-white">
              <Upload size={22} strokeWidth={1.4} />
            </span>
            <h3 className="text-base font-medium">
              Your next chapter starts with a resume.
            </h3>
            <p className="mt-2 max-w-xs text-xs leading-6 text-zinc-500">
              Upload your resume for specific feedback, stronger bullets, and a
              clearer story.
            </p>
            <span className="button button-primary mt-5">
              Upload my first resume
              <ArrowUpRight size={15} />
            </span>
            <span className="mt-3 text-[11px] text-zinc-400">
              PDF or DOCX · Up to 5 MB
            </span>
          </button>
        </div>
      )}
    </section>
  );
}

const pipelineColors: Record<JobStatus, string> = {
  Saved: "#c5d5ac",
  Applied: "#8ba574",
  Interview: "#bdcbea",
  Offer: "#425f35",
  Rejected: "#e1cbbf",
};
export function JobPipelineCard({
  jobs,
  jobsByStatus,
  interviewRate,
}: {
  jobs: Job[];
  jobsByStatus: Record<JobStatus, number>;
  interviewRate: number;
}) {
  const total = Object.values(jobsByStatus).reduce((a, b) => a + b, 0);
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2 className="section-title">Your application pipeline</h2>
          <p className="panel-kicker">Every opportunity has a place.</p>
        </div>
        <Link href="/dashboard/jobs" className="text-link">
          View all
          <ArrowUpRight size={14} />
        </Link>
      </div>
      <div className="px-6 pb-4">
        <div
          className="pipeline-bar"
          role="img"
          aria-label={Object.entries(jobsByStatus)
            .map(([status, count]) => `${count} ${status}`)
            .join(", ")}
        >
          {Object.entries(jobsByStatus)
            .filter(([, n]) => n > 0)
            .map(([status, n]) => (
              <div
                key={status}
                style={{
                  width: `${(n / total) * 100}%`,
                  background: pipelineColors[status as JobStatus],
                }}
              />
            ))}
        </div>
        <div className="pipeline-legend">
          {(
            ["Saved", "Applied", "Interview", "Offer", "Rejected"] as const
          ).map((status) => (
            <div key={status}>
              <span>
                <i style={{ background: pipelineColors[status] }} />
                {status}
              </span>
              <strong>{jobsByStatus[status]}</strong>
            </div>
          ))}
          <div>
            <span>Interview rate</span>
            <strong>{interviewRate}%</strong>
          </div>
        </div>
      </div>
      {jobs.length > 0 ? (
        <div>
          {jobs.slice(0, 3).map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/jobs/${job.id}`}
              className="recent-job"
            >
              <span className="company-avatar">{job.company.slice(0, 1)}</span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[13px] font-medium">
                  {job.company}
                </h3>
                <p className="mt-1 truncate text-xs text-zinc-500">
                  {job.role}
                </p>
              </div>
              <Badge variant={statusVariant(job.status)}>{job.status}</Badge>
              <ArrowUpRight size={15} className="text-zinc-400" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="mx-6 mb-6 rounded-lg border border-dashed border-zinc-200 p-5 text-center">
          <p className="text-sm text-zinc-500">
            Your next opportunity is out there.
          </p>
          <Link href="/dashboard/jobs" className="text-link mt-3">
            Start your job tracker
            <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </section>
  );
}

export function NextActionsCard({ items }: { items: string[] }) {
  return (
    <section className="panel !border-[#dfe8d1] !bg-[#eef3e4] p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="icon-tile !bg-white">
          <Target size={17} />
        </span>
        <div>
          <h2 className="section-title">A little direction</h2>
          <p className="panel-kicker">Focus on what moves you forward.</p>
        </div>
      </div>
      {items.length > 0 ? (
        items.slice(0, 3).map((item, i) => (
          <div className="action-item" key={item}>
            <span>{i + 1}</span>
            <p>{item}</p>
          </div>
        ))
      ) : (
        <>
          <div className="action-item">
            <span>1</span>
            <div>
              <p className="font-medium">Start with your story.</p>
              <p className="text-xs text-zinc-500">
                Upload a resume to get your personal feedback.
              </p>
            </div>
          </div>
          <div className="action-item">
            <span>2</span>
            <div>
              <p className="font-medium">Make room for the possibilities.</p>
              <p className="text-xs text-zinc-500">
                Save a role that feels like a good next step.
              </p>
            </div>
          </div>
        </>
      )}
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#829567]">
        <Sprout size={13} /> Progress happens one step at a time.
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
  const metrics = [
    { label: "Jobs added", value: jobsAdded, color: "#d5e5be" },
    { label: "Applications", value: applications, color: "#9bbb75" },
    { label: "Interviews", value: interviews, color: "#446839" },
  ];
  const max = Math.max(...metrics.map((item) => item.value), 1);
  return (
    <section className="panel p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="section-title">A week of small steps</h2>
          <p className="panel-kicker">Your activity this week.</p>
        </div>
        <span className="icon-tile">
          <Target size={18} />
        </span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-4">
        {metrics.map((item) => (
          <div key={item.label}>
            <span className="text-[11px] text-zinc-500">{item.label}</span>
            <div className="mt-1 text-2xl font-medium tracking-tight">
              {item.value}
            </div>
          </div>
        ))}
      </div>
      <div
        className="weekly-bars"
        role="img"
        aria-label={metrics
          .map((item) => `${item.label}: ${item.value}`)
          .join(", ")}
      >
        {metrics.map((item) => (
          <div className="weekly-bar" key={item.label}>
            <div
              style={{
                height: `${Math.max((item.value / max) * 100, 4)}%`,
                background: item.color,
              }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 border-t border-zinc-100 pt-4 text-xs leading-6 text-zinc-500">
        {jobsAdded + applications + interviews > 0
          ? summary
          : "A fresh week, a fresh start. Add an opportunity to get things moving."}
      </p>
    </section>
  );
}
