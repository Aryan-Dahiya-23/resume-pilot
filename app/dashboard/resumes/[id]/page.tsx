"use client";

import { useParams } from "next/navigation";
import { ResumeDetailsClient } from "@/components/dashboard/resume-details-client";

export default function ResumeDetailsPage() {
  const params = useParams<{ id: string }>();
  const resumeId = params?.id;

  if (!resumeId) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-5 text-sm text-destructive">
        Invalid resume id.
      </div>
    );
  }

  return <ResumeDetailsClient resumeId={resumeId} />;
}
