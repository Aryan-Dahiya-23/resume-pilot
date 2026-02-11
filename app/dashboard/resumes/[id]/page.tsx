import {
  ResumeDetailsMain,
  ResumeDetailsSidebar,
  ResumeFeedbackHeader,
} from "@/components/dashboard/resume-details-sections";
import { mockData } from "@/lib/mock-data";

export default async function ResumeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resume = mockData.resumes.find((item) => item.id === id) ?? mockData.resumes[0];
  const feedback = mockData.resumeFeedback[id] ?? mockData.resumeFeedback[mockData.resumes[0].id];

  return (
    <>
      <ResumeFeedbackHeader resume={resume} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <ResumeDetailsMain feedback={feedback} />
        <ResumeDetailsSidebar feedback={feedback} />
      </div>
    </>
  );
}
