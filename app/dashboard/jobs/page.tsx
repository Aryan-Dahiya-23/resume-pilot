"use client";

import { useMemo, useState } from "react";
import { JobsHeader, JobsTableSection } from "@/components/dashboard/jobs-sections";
import { mockData, type JobStatus } from "@/lib/mock-data";

export default function JobsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<JobStatus | "All">("All");

  const rows = useMemo(() => {
    const search = query.trim().toLowerCase();

    return mockData.jobs.filter((job) => {
      const matchesStatus = status === "All" ? true : job.status === status;
      const matchesQuery = search
        ? [job.company, job.role, job.location ?? ""].join(" ").toLowerCase().includes(search)
        : true;

      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  return (
    <>
      <JobsHeader />
      <JobsTableSection
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        rows={rows}
      />
    </>
  );
}
