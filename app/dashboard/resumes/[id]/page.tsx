"use client";

import { useParams } from "next/navigation";
import { ResumeDetailsClient } from "@/components/dashboard/resume-details-client";

export default function ResumeDetailsPage() {
  const params = useParams<{ id: string }>();
  const resumeId = params?.id;

  if (!resumeId) {
    return (
      <div className="surface-card border-l-2 border-l-destructive p-5 text-sm text-destructive">
        Invalid resume id.
      </div>
    );
  }

  return <ResumeDetailsClient resumeId={resumeId} />;
}
