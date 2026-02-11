import {
  DashboardOverviewHeader,
  JobPipelineCard,
  NextActionsCard,
  ResumeOverviewCard,
  WeeklySnapshotCard,
} from "@/components/dashboard/dashboard-sections";
import { mockData, type JobStatus } from "@/lib/mock-data";

export default function DashboardPage() {
  const latestResume = mockData.resumes[0];
  const prevResume = mockData.resumes[1];
  const delta = latestResume.score - (prevResume?.score ?? latestResume.score);

  const jobsByStatus = mockData.jobs.reduce(
    (acc, job) => {
      acc[job.status] += 1;
      return acc;
    },
    { Saved: 0, Applied: 0, Interview: 0, Offer: 0, Rejected: 0 } as Record<
      JobStatus,
      number
    >,
  );

  return (
    <>
      <DashboardOverviewHeader />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ResumeOverviewCard
          latestResume={latestResume}
          delta={delta}
          nextActions={
            mockData.resumeFeedback[latestResume.id]?.nextActions ?? []
          }
        />
        <JobPipelineCard jobs={mockData.jobs} jobsByStatus={jobsByStatus} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <NextActionsCard />
        <WeeklySnapshotCard />
      </div>
    </>
  );
}
