"use client";

import { useParams } from "next/navigation";
import { ResumeDetailsClient } from "@/components/dashboard/resume-details-client";

export default function ResumeDetailsPage() {
  const params = useParams<{ id: string }>();
  const resumeId = params?.id;

  if (!resumeId) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">
        Invalid resume id.
      </div>
    );
  }

  return <ResumeDetailsClient resumeId={resumeId} />;
}
