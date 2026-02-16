export const queryKeys = {
  dashboard: {
    overview: () => ["dashboard", "overview"] as const,
  },
  user: {
    current: () => ["user", "current"] as const,
  },
  resumes: {
    list: () => ["resumes", "list"] as const,
    listWithFilters: (filters: {
      q?: string;
      status?: "UPLOADED" | "PARSING" | "REVIEWING" | "READY" | "FAILED";
      dateRange?: "today" | "7d" | "30d";
    }) =>
      [
        "resumes",
        "list",
        filters.q ?? "",
        filters.status ?? "All",
        filters.dateRange ?? "All",
      ] as const,
    detail: (resumeId: string) => ["resumes", "detail", resumeId] as const,
  },
  jobs: {
    list: () => ["jobs", "list"] as const,
    listWithFilters: (filters: {
      q?: string;
      status?: "Saved" | "Applied" | "Interview" | "Offer" | "Rejected";
      dateRange?: "today" | "7d" | "30d";
      page?: number;
      limit?: number;
    }) =>
      [
        "jobs",
        "list",
        filters.q ?? "",
        filters.status ?? "All",
        filters.dateRange ?? "All",
        filters.page ?? 1,
        filters.limit ?? 10,
      ] as const,
    detail: (jobId: string) => ["jobs", "detail", jobId] as const,
  },
};
