"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getResumeDetails, listResumesQuery, type ListResumesFilters } from "@/lib/api/resumes";
import { queryKeys } from "@/lib/react-query/query-keys";

export function useResumes(filters: ListResumesFilters) {
  return useQuery({
    queryKey: queryKeys.resumes.listWithFilters(filters),
    queryFn: () => listResumesQuery(filters),
    placeholderData: keepPreviousData,
  });
}

export function useResumeDetails(resumeId: string) {
  return useQuery({
    queryKey: queryKeys.resumes.detail(resumeId),
    queryFn: () => getResumeDetails(resumeId),
    enabled: Boolean(resumeId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || status === "READY" || status === "FAILED") return false;
      return 2000;
    },
  });
}

export function useResumeReviewHistory(resumeId: string) {
  return useQuery({
    queryKey: queryKeys.resumes.detail(resumeId),
    queryFn: () => getResumeDetails(resumeId),
    enabled: Boolean(resumeId),
    select: (data) => data.reviewHistory,
  });
}
