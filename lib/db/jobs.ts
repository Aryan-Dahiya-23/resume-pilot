import { prisma } from "@/lib/prisma";
import { Prisma, type JobStatus } from "@prisma/client";

type CreateJobInput = {
  userId: string;
  company: string;
  role: string;
  status?: JobStatus;
  notes?: string | null;
  followUp?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  interviewRounds?: Prisma.InputJsonValue;
  location?: string | null;
  link?: string | null;
};

type UpdateJobInput = {
  jobId: string;
  userId: string;
  company?: string;
  role?: string;
  status?: JobStatus;
  notes?: string | null;
  followUp?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  interviewRounds?: Prisma.InputJsonValue | null;
  location?: string | null;
  link?: string | null;
};

export async function listJobsByUserId(userId: string) {
  return prisma.job.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
}

type ListJobsFilters = {
  query?: string;
  status?: JobStatus;
  dateRange?: "today" | "7d" | "30d";
};

function getDateRangeStart(dateRange: "today" | "7d" | "30d") {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (dateRange === "today") return startOfToday;
  if (dateRange === "7d") {
    return new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);
  }

  return new Date(startOfToday.getTime() - 29 * 24 * 60 * 60 * 1000);
}

export async function listJobsByUserIdWithFilters(userId: string, filters: ListJobsFilters) {
  const andFilters: Prisma.JobWhereInput[] = [];

  if (filters.status) {
    andFilters.push({ status: filters.status });
  }

  if (filters.dateRange) {
    andFilters.push({
      createdAt: {
        gte: getDateRangeStart(filters.dateRange),
      },
    });
  }

  if (filters.query?.trim()) {
    const search = filters.query.trim();
    andFilters.push({
      OR: [
        { company: { contains: search, mode: "insensitive" } },
        { role: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  return prisma.job.findMany({
    where: {
      userId,
      ...(andFilters.length ? { AND: andFilters } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

type ListJobsPagination = {
  page: number;
  limit: number;
};

export async function listJobsByUserIdWithFiltersPaginated(
  userId: string,
  filters: ListJobsFilters,
  pagination: ListJobsPagination,
) {
  const andFilters: Prisma.JobWhereInput[] = [];

  if (filters.status) {
    andFilters.push({ status: filters.status });
  }

  if (filters.dateRange) {
    andFilters.push({
      createdAt: {
        gte: getDateRangeStart(filters.dateRange),
      },
    });
  }

  if (filters.query?.trim()) {
    const search = filters.query.trim();
    andFilters.push({
      OR: [
        { company: { contains: search, mode: "insensitive" } },
        { role: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  return prisma.job.findMany({
    where: {
      userId,
      ...(andFilters.length ? { AND: andFilters } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (pagination.page - 1) * pagination.limit,
    take: pagination.limit,
  });
}

export async function countJobsByUserId(userId: string) {
  return prisma.job.count({
    where: { userId },
  });
}

export async function countJobsByUserIdWithFilters(userId: string, filters: ListJobsFilters) {
  const andFilters: Prisma.JobWhereInput[] = [];

  if (filters.status) {
    andFilters.push({ status: filters.status });
  }

  if (filters.dateRange) {
    andFilters.push({
      createdAt: {
        gte: getDateRangeStart(filters.dateRange),
      },
    });
  }

  if (filters.query?.trim()) {
    const search = filters.query.trim();
    andFilters.push({
      OR: [
        { company: { contains: search, mode: "insensitive" } },
        { role: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  return prisma.job.count({
    where: {
      userId,
      ...(andFilters.length ? { AND: andFilters } : {}),
    },
  });
}

export async function createJob(input: CreateJobInput) {
  return prisma.job.create({
    data: {
      userId: input.userId,
      company: input.company,
      role: input.role,
      status: input.status ?? "Saved",
      notes: input.notes ?? null,
      followUp: input.followUp ?? null,
      contactName: input.contactName ?? null,
      contactEmail: input.contactEmail ?? null,
      interviewRounds: input.interviewRounds ?? [],
      location: input.location ?? null,
      link: input.link ?? null,
    },
  });
}

export async function getJobByIdForUser(input: { jobId: string; userId: string }) {
  return prisma.job.findFirst({
    where: {
      id: input.jobId,
      userId: input.userId,
    },
  });
}

export async function updateJobByIdForUser(input: UpdateJobInput) {
  const data: Prisma.JobUpdateManyMutationInput = {};

  if (typeof input.company === "string") data.company = input.company;
  if (typeof input.role === "string") data.role = input.role;
  if (input.status) data.status = input.status;
  if (input.notes !== undefined) data.notes = input.notes;
  if (input.followUp !== undefined) data.followUp = input.followUp;
  if (input.contactName !== undefined) data.contactName = input.contactName;
  if (input.contactEmail !== undefined) data.contactEmail = input.contactEmail;
  if (input.interviewRounds !== undefined) {
    data.interviewRounds =
      input.interviewRounds === null ? Prisma.JsonNull : input.interviewRounds;
  }
  if (input.location !== undefined) data.location = input.location;
  if (input.link !== undefined) data.link = input.link;

  return prisma.job.updateMany({
    where: {
      id: input.jobId,
      userId: input.userId,
    },
    data,
  });
}

export async function deleteJobByIdForUser(input: { jobId: string; userId: string }) {
  return prisma.job.deleteMany({
    where: {
      id: input.jobId,
      userId: input.userId,
    },
  });
}
