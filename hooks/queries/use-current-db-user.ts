"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentDbUserClient } from "@/lib/api/users";
import { queryKeys } from "@/lib/react-query/query-keys";

export function useCurrentDbUser() {
  return useQuery({
    queryKey: queryKeys.user.current(),
    queryFn: getCurrentDbUserClient,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
