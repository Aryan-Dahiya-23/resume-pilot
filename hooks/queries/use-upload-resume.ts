"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listResumes, uploadResume } from "@/lib/api/resumes";
import { queryKeys } from "@/lib/react-query/query-keys";

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadResume,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.resumes.list() });

      const previousResumes = queryClient.getQueryData<Awaited<ReturnType<typeof listResumes>>>(queryKeys.resumes.list());
      const optimisticId = `temp-resume-${Date.now()}`;

      const optimisticResume = {
        id: optimisticId,
        fileName: payload.file.name,
        roleTarget: payload.roleTarget,
        targetLevel: payload.targetLevel ?? null,
        status: "UPLOADED" as const,
        createdAt: new Date().toISOString(),
        score: null,
      };

      queryClient.setQueryData<Awaited<ReturnType<typeof listResumes>>>(
        queryKeys.resumes.list(),
        previousResumes ? [optimisticResume, ...previousResumes] : [optimisticResume],
      );

      return { previousResumes, optimisticId };
    },
    onError: (_error, _payload, context) => {
      if (context?.previousResumes) {
        queryClient.setQueryData(queryKeys.resumes.list(), context.previousResumes);
        return;
      }

      queryClient.setQueryData<Awaited<ReturnType<typeof listResumes>>>(queryKeys.resumes.list(), (current = []) =>
        current.filter((resume) => resume.id !== context?.optimisticId),
      );
    },
    onSuccess: (response, _payload, context) => {
      queryClient.setQueryData<Awaited<ReturnType<typeof listResumes>>>(queryKeys.resumes.list(), (current = []) =>
        current.map((resume) =>
          resume.id === context?.optimisticId
            ? {
                id: response.resume.id,
                fileName: response.resume.fileName,
                roleTarget: response.resume.roleTarget,
                targetLevel: response.resume.targetLevel,
                status: response.resume.status as "UPLOADED" | "PARSING" | "REVIEWING" | "READY" | "FAILED",
                createdAt: response.resume.createdAt,
                score: null,
              }
            : resume,
        ),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.resumes.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview() });
    },
  });
}
