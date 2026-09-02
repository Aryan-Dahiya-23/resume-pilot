"use client";

import { useParams } from "next/navigation";
import { JobDetailsClient } from "@/components/dashboard/job-details-client";

export default function JobDetailsPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id;

  if (!jobId) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive">
        Invalid job id.
      </div>
    );
  }

  return <JobDetailsClient jobId={jobId} />;
}
