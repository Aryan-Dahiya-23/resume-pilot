import axios from "axios";
import type { JobStatus, Resume } from "@/lib/mock-data";

export type DashboardJob = {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  when: string;
  link: string | null;
  location: string | null;
};

export type DashboardOverview = {
  latestResume: Resume & { roleTarget?: string | null };
  delta: number;
  nextActions: string[];
  jobs: DashboardJob[];
  jobsByStatus: Record<JobStatus, number>;
  interviewRate: number;
  weeklyJobsAdded: number;
  weeklyApplications: number;
  weeklyInterviews: number;
  weeklySummary: string;
};

type DashboardOverviewResponse = DashboardOverview;

export async function getDashboardOverview() {
  const response = await axios.get<DashboardOverviewResponse>(
    "/api/dashboard/overview",
    {
      withCredentials: true,
    },
  );

  return response.data;
}
