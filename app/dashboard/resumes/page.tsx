"use client";

import { useMemo, useState } from "react";
import {
  ResumeScoreGuideCard,
  ResumesHeader,
  ResumesTableSection,
} from "@/components/dashboard/resumes-sections";
import { mockData } from "@/lib/mock-data";

export default function ResumesPage() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return mockData.resumes;

    return mockData.resumes.filter((resume) =>
      [resume.version, resume.fileName, resume.roleTarget ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [query]);

  return (
    <>
      <ResumesHeader />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <ResumesTableSection
          query={query}
          onQueryChange={setQuery}
          rows={rows}
        />
        <ResumeScoreGuideCard />
      </div>
    </>
  );
}
