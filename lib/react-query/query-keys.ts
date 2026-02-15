export const queryKeys = {
  dashboard: {
    overview: () => ["dashboard", "overview"] as const,
  },
  user: {
    current: () => ["user", "current"] as const,
  },
  resumes: {
    list: () => ["resumes", "list"] as const,
    detail: (resumeId: string) => ["resumes", "detail", resumeId] as const,
  },
  jobs: {
    list: () => ["jobs", "list"] as const,
    detail: (jobId: string) => ["jobs", "detail", jobId] as const,
  },
};
