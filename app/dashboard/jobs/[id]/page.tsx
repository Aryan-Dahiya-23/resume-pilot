"use client";

import { useParams } from "next/navigation";
import { JobDetailsClient } from "@/components/dashboard/job-details-client";

export default function JobDetailsPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id;

  if (!jobId) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">
        Invalid job id.
      </div>
    );
  }

  return <JobDetailsClient jobId={jobId} />;
}
