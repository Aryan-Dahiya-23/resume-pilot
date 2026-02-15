import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { listJobsByUserId } from "@/lib/db/jobs";
import { listResumesByUserId } from "@/lib/db/resumes";
import { ensureCurrentDbUser } from "@/lib/db/users";
import type { JobStatus } from "@/lib/mock-data";

function toRelativeDayLabel(dateInput: Date) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfInputDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diffMs = startOfToday.getTime() - startOfInputDay.getTime();
  const dayDiff = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (dayDiff <= 0) return "Today";
  if (dayDiff === 1) return "Yesterday";
  if (dayDiff < 7) return `${dayDiff} days ago`;

  const weekDiff = Math.floor(dayDiff / 7);
  if (weekDiff === 1) return "1 week ago";
  return `${weekDiff} weeks ago`;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function startOfLast7Days() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await ensureCurrentDbUser();
  if (!dbUser) {
    return NextResponse.json(
      { error: "Could not create or load user record" },
      { status: 500 },
    );
  }

  const [resumes, jobs] = await Promise.all([
    listResumesByUserId(dbUser.id),
    listJobsByUserId(dbUser.id),
  ]);

  const latestResumeRaw = resumes[0];
  const prevResumeRaw = resumes[1];
  const latestResumeScore = latestResumeRaw?.review?.score ?? 0;
  const previousResumeScore = prevResumeRaw?.review?.score ?? latestResumeScore;
  const delta = latestResumeScore - previousResumeScore;

  const summaryJson =
    (latestResumeRaw?.review?.summaryJson as { nextActions?: unknown } | null) ??
    null;
  const nextActions = toStringArray(summaryJson?.nextActions);

  const latestResume = latestResumeRaw
    ? {
        id: latestResumeRaw.id,
        version: `v${resumes.length}`,
        uploadedAt: toRelativeDayLabel(latestResumeRaw.createdAt),
        score: latestResumeScore,
        roleTarget: latestResumeRaw.roleTarget ?? null,
        fileName: latestResumeRaw.fileName,
      }
    : {
        id: "",
        version: "v0",
        uploadedAt: "No uploads yet",
        score: 0,
        roleTarget: null,
        fileName: "No resume uploaded",
      };

  const mappedJobs = jobs.map((job) => ({
    id: job.id,
    company: job.company,
    role: job.role,
    status: job.status as JobStatus,
    when: toRelativeDayLabel(job.createdAt),
    link: job.link ?? null,
    location: job.location ?? null,
  }));

  const jobsByStatus = mappedJobs.reduce(
    (acc, job) => {
      acc[job.status] += 1;
      return acc;
    },
    { Saved: 0, Applied: 0, Interview: 0, Offer: 0, Rejected: 0 } as Record<
      JobStatus,
      number
    >,
  );

  const submittedCount =
    jobsByStatus.Applied +
    jobsByStatus.Interview +
    jobsByStatus.Offer +
    jobsByStatus.Rejected;
  const progressedCount = jobsByStatus.Interview + jobsByStatus.Offer;
  const interviewRate =
    submittedCount > 0 ? Math.round((progressedCount / submittedCount) * 100) : 0;

  const weekStart = startOfLast7Days();
  const weeklyJobs = jobs.filter((job) => job.createdAt >= weekStart);
  const weeklyJobsAdded = weeklyJobs.length;
  const weeklyApplications = weeklyJobs.filter((job) => job.status !== "Saved").length;
  const weeklyInterviews = weeklyJobs.filter((job) => job.status === "Interview").length;

  const weeklySummary =
    delta > 0
      ? "Your resume score improved this cycle. Keep applications consistent this week."
      : "Keep momentum this week with targeted applications and one resume refinement pass.";

  return NextResponse.json(
    {
      latestResume,
      delta,
      nextActions,
      jobs: mappedJobs,
      jobsByStatus,
      interviewRate,
      weeklyJobsAdded,
      weeklyApplications,
      weeklyInterviews,
      weeklySummary,
    },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
