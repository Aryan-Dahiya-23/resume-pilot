import axios from "axios";

export type JobStatus = "Saved" | "Applied" | "Interview" | "Offer" | "Rejected";
export type InterviewRoundStatus = "Done" | "Upcoming" | "Pending";
export type InterviewRound = {
  name: string;
  status: InterviewRoundStatus;
};

export type JobListItem = {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  notes: string | null;
  followUp: string | null;
  contactName: string | null;
  contactEmail: string | null;
  interviewRounds: InterviewRound[];
  location: string | null;
  link: string | null;
  createdAt: string;
  updatedAt: string;
};

type ListJobsResponse = {
  jobs: JobListItem[];
  totalCount: number;
  filteredCount: number;
  page: number;
  limit: number;
  totalPages: number;
};

type CreateJobPayload = {
  company: string;
  role: string;
  status?: JobStatus;
  contactName?: string;
  contactEmail?: string;
  interviewRounds?: InterviewRound[];
  followUp?: string;
  location?: string;
  link?: string;
};

type CreateJobResponse = {
  job: JobListItem;
};

type GetJobResponse = {
  job: JobListItem;
};

type UpdateJobPayload = {
  company?: string;
  role?: string;
  status?: JobStatus;
  notes?: string | null;
  followUp?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  interviewRounds?: InterviewRound[];
  location?: string | null;
  link?: string | null;
};

export type ListJobsFilters = {
  q?: string;
  status?: JobStatus;
  dateRange?: "today" | "7d" | "30d";
  page?: number;
  limit?: number;
};

export async function listJobsQuery(filters?: ListJobsFilters) {
  const response = await axios.get<ListJobsResponse>("/api/jobs", {
    withCredentials: true,
    params: {
      q: filters?.q || undefined,
      status: filters?.status || undefined,
      dateRange: filters?.dateRange || undefined,
      page: filters?.page ?? undefined,
      limit: filters?.limit ?? undefined,
    },
  });
  return response.data;
}

export async function listJobs() {
  const response = await listJobsQuery();
  return response.jobs;
}

export async function createJob(payload: CreateJobPayload) {
  const response = await axios.post<CreateJobResponse>("/api/jobs", payload, {
    withCredentials: true,
  });
  return response.data.job;
}

export async function getJob(jobId: string) {
  const response = await axios.get<GetJobResponse>(`/api/jobs/${jobId}`, {
    withCredentials: true,
  });
  return response.data.job;
}

export async function updateJob(jobId: string, payload: UpdateJobPayload) {
  await axios.patch(`/api/jobs/${jobId}`, payload, {
    withCredentials: true,
  });
}

export async function deleteJob(jobId: string) {
  await axios.delete(`/api/jobs/${jobId}`, {
    withCredentials: true,
  });
}
