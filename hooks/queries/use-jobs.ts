"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createJob, deleteJob, getJob, listJobs, listJobsQuery, updateJob, type ListJobsFilters } from "@/lib/api/jobs";
import { queryKeys } from "@/lib/react-query/query-keys";

export function useJobs(filters: ListJobsFilters) {
  return useQuery({
    queryKey: queryKeys.jobs.listWithFilters(filters),
    queryFn: () => listJobsQuery(filters),
    placeholderData: keepPreviousData,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.jobs.list() });

      const previousJobs = queryClient.getQueryData<Awaited<ReturnType<typeof listJobs>>>(queryKeys.jobs.list());
      const now = new Date().toISOString();
      const optimisticId = `temp-job-${Date.now()}`;
      const optimisticJob = {
        id: optimisticId,
        company: payload.company,
        role: payload.role,
        status: payload.status ?? "Saved",
        notes: null,
        followUp: payload.followUp ?? null,
        contactName: payload.contactName ?? null,
        contactEmail: payload.contactEmail ?? null,
        interviewRounds: payload.interviewRounds ?? [],
        location: payload.location ?? null,
        link: payload.link ?? null,
        createdAt: now,
        updatedAt: now,
      };

      queryClient.setQueryData<Awaited<ReturnType<typeof listJobs>>>(
        queryKeys.jobs.list(),
        previousJobs ? [optimisticJob, ...previousJobs] : [optimisticJob],
      );

      return { previousJobs, optimisticId };
    },
    onError: (_error, _payload, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(queryKeys.jobs.list(), context.previousJobs);
        return;
      }

      queryClient.setQueryData<Awaited<ReturnType<typeof listJobs>>>(queryKeys.jobs.list(), (current = []) =>
        current.filter((job) => job.id !== context?.optimisticId),
      );
    },
    onSuccess: (createdJob, _payload, context) => {
      queryClient.setQueryData<Awaited<ReturnType<typeof listJobs>>>(queryKeys.jobs.list(), (current = []) =>
        current.map((job) => (job.id === context?.optimisticId ? createdJob : job)),
      );
      queryClient.setQueryData(queryKeys.jobs.detail(createdJob.id), createdJob);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview() });
    },
  });
}

export function useJob(jobId: string) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(jobId),
    queryFn: () => getJob(jobId),
    enabled: Boolean(jobId),
  });
}

export function useUpdateJob(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof updateJob>[1]) =>
      updateJob(jobId, payload),
    onMutate: async (payload) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.jobs.list() }),
        queryClient.cancelQueries({ queryKey: queryKeys.jobs.detail(jobId) }),
      ]);

      const previousJobs = queryClient.getQueryData<Awaited<ReturnType<typeof listJobs>>>(queryKeys.jobs.list());
      const previousJobDetail = queryClient.getQueryData<Awaited<ReturnType<typeof getJob>>>(queryKeys.jobs.detail(jobId));

      queryClient.setQueryData<Awaited<ReturnType<typeof listJobs>>>(queryKeys.jobs.list(), (current = []) =>
        current.map((job) =>
          job.id === jobId
            ? {
                ...job,
                ...payload,
                updatedAt: new Date().toISOString(),
              }
            : job,
        ),
      );

      queryClient.setQueryData<Awaited<ReturnType<typeof getJob>>>(queryKeys.jobs.detail(jobId), (current) =>
        current
          ? {
              ...current,
              ...payload,
              updatedAt: new Date().toISOString(),
            }
          : current,
      );

      return { previousJobs, previousJobDetail };
    },
    onError: (_error, _payload, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(queryKeys.jobs.list(), context.previousJobs);
      }
      if (context?.previousJobDetail) {
        queryClient.setQueryData(queryKeys.jobs.detail(jobId), context.previousJobDetail);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview() });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.jobs.list() });

      const previousJobs = queryClient.getQueryData<Awaited<ReturnType<typeof listJobs>>>(queryKeys.jobs.list());

      queryClient.setQueryData<Awaited<ReturnType<typeof listJobs>>>(queryKeys.jobs.list(), (current = []) =>
        current.filter((job) => job.id !== jobId),
      );

      return { previousJobs };
    },
    onError: (_error, _jobId, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(queryKeys.jobs.list(), context.previousJobs);
        return;
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.list() });
    },
    onSettled: (_data, _error, jobId) => {
      queryClient.removeQueries({ queryKey: queryKeys.jobs.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview() });
    },
  });
}
