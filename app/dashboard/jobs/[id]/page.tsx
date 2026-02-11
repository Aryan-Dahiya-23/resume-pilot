import {
  JobDetailsHeader,
  JobDetailsMain,
  JobDetailsSidebar,
} from "@/components/dashboard/job-details-sections";
import { mockData } from "@/lib/mock-data";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = mockData.jobs.find((item) => item.id === id) ?? mockData.jobs[0];
  const details = mockData.jobDetails[id] ?? {
    notes: "",
    contact: { name: "", email: "" },
    rounds: [],
    followUp: "",
  };

  return (
    <>
      <JobDetailsHeader job={job} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <JobDetailsMain details={details} />
        <JobDetailsSidebar details={details} />
      </div>
    </>
  );
}
