"use client";

import { useParams } from "next/navigation";
import { JobDetailsClient } from "@/components/dashboard/job-details-client";

export default function JobDetailsPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id;

  if (!jobId) {
    return (
      <div className="surface-card border-l-2 border-l-destructive p-5 text-sm text-destructive">
        Invalid job id.
      </div>
    );
  }

  return <JobDetailsClient jobId={jobId} />;
}
