import { prisma } from "@/lib/prisma";
import type { ResumeStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";
import type { ResumeReviewOutput } from "@/lib/ai/review-resume";

export async function saveCompletedResumeReview(
  resumeId: string,
  runId: string,
  review: ResumeReviewOutput,
) {
  const data = {
    resumeId,
    score: review.score,
    summaryJson: {
      findings: review.findings,
      jobMatch: review.jobMatch,
      strengths: review.strengths,
      weaknesses: review.weaknesses,
      nextActions: review.nextActions,
    },
    missingKeywords: review.missingKeywords,
    suggestionsJson: review.rewriteSuggestions,
    model: review.model,
  };
  // Publish review, history, and ready status together. Replayed saves reuse
  // the run ID so retries cannot create duplicate history entries.
  return prisma.$transaction([
    prisma.resumeReviewHistory.upsert({
      where: { id: runId },
      create: { id: runId, ...data },
      update: {},
    }),
    prisma.resumeReview.upsert({ where: { resumeId }, create: data, update: data }),
    prisma.resume.update({ where: { id: resumeId }, data: { status: "READY" } }),
  ]);
}

type CreateResumeInput = {
  userId: string;
  fileName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  roleTarget?: string;
  targetLevel?: string;
  jobDescription?: string;
  status?: ResumeStatus;
};

export async function createResume(input: CreateResumeInput) {
  return prisma.resume.create({
    data: {
      userId: input.userId,
      fileName: input.fileName,
      storageKey: input.storageKey,
      mimeType: input.mimeType,
      size: input.size,
      roleTarget: input.roleTarget,
      targetLevel: input.targetLevel,
      jobDescription: input.jobDescription,
      status: input.status ?? "UPLOADED",
    },
  });
}

export async function getResumeById(resumeId: string) {
  return prisma.resume.findUnique({
    where: { id: resumeId },
  });
}

export async function listResumesByUserId(userId: string) {
  return prisma.resume.findMany({
    where: { userId },
    include: {
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

type ListResumesFilters = {
  query?: string;
  status?: ResumeStatus;
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

export async function listResumesByUserIdWithFilters(
  userId: string,
  filters: ListResumesFilters,
) {
  const andFilters: Prisma.ResumeWhereInput[] = [];

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
        { fileName: { contains: search, mode: "insensitive" } },
        { roleTarget: { contains: search, mode: "insensitive" } },
        { targetLevel: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  return prisma.resume.findMany({
    where: {
      userId,
      ...(andFilters.length ? { AND: andFilters } : {}),
    },
    include: {
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function countResumesByUserId(userId: string) {
  return prisma.resume.count({
    where: { userId },
  });
}

export async function getResumeDetailsByIdForUser(input: { resumeId: string; userId: string }) {
  return prisma.resume.findFirst({
    where: {
      id: input.resumeId,
      userId: input.userId,
    },
    include: {
      parse: true,
      review: true,
      reviewHistory: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function updateResumeStatus(resumeId: string, status: ResumeStatus) {
  return prisma.resume.update({
    where: { id: resumeId },
    data: { status },
  });
}

// Compare status and timestamp so concurrent retry requests cannot both queue work.
export async function claimResumeReview(input: {
  resumeId: string;
  userId: string;
  status: ResumeStatus;
  updatedAt: Date;
}) {
  return prisma.resume.updateMany({
    where: { id: input.resumeId, userId: input.userId, status: input.status, updatedAt: input.updatedAt },
    data: { status: "UPLOADED", updatedAt: new Date() },
  });
}

export async function getResumeByIdForUser(input: { resumeId: string; userId: string }) {
  return prisma.resume.findFirst({
    where: {
      id: input.resumeId,
      userId: input.userId,
    },
  });
}

export async function deleteResumeByIdForUser(input: { resumeId: string; userId: string }) {
  return prisma.resume.deleteMany({
    where: {
      id: input.resumeId,
      userId: input.userId,
    },
  });
}

export async function updateResumeTargetByIdForUser(input: {
  resumeId: string;
  userId: string;
  roleTarget: string | null;
  targetLevel: string | null;
  jobDescription?: string | null;
}) {
  return prisma.resume.updateMany({
    where: {
      id: input.resumeId,
      userId: input.userId,
    },
    data: {
      roleTarget: input.roleTarget,
      targetLevel: input.targetLevel,
      jobDescription: input.jobDescription,
    },
  });
}

export async function upsertResumeParse(input: {
  resumeId: string;
  rawText: string;
  structuredJson: unknown;
  parserVersion: string;
}) {
  return prisma.resumeParse.upsert({
    where: { resumeId: input.resumeId },
    update: {
      rawText: input.rawText,
      structuredJson: input.structuredJson as object,
      parserVersion: input.parserVersion,
    },
    create: {
      resumeId: input.resumeId,
      rawText: input.rawText,
      structuredJson: input.structuredJson as object,
      parserVersion: input.parserVersion,
    },
  });
}

export async function upsertResumeReview(input: {
  resumeId: string;
  score: number;
  summaryJson: unknown;
  missingKeywords: unknown;
  suggestionsJson: unknown;
  model: string;
}) {
  return prisma.resumeReview.upsert({
    where: { resumeId: input.resumeId },
    update: {
      score: input.score,
      summaryJson: input.summaryJson as object,
      missingKeywords: input.missingKeywords as object,
      suggestionsJson: input.suggestionsJson as object,
      model: input.model,
    },
    create: {
      resumeId: input.resumeId,
      score: input.score,
      summaryJson: input.summaryJson as object,
      missingKeywords: input.missingKeywords as object,
      suggestionsJson: input.suggestionsJson as object,
      model: input.model,
    },
  });
}

export async function createResumeReviewHistory(input: {
  resumeId: string;
  score: number;
  summaryJson: unknown;
  missingKeywords: unknown;
  suggestionsJson: unknown;
  model: string;
}) {
  return prisma.resumeReviewHistory.create({
    data: {
      resumeId: input.resumeId,
      score: input.score,
      summaryJson: input.summaryJson as object,
      missingKeywords: input.missingKeywords as object,
      suggestionsJson: input.suggestionsJson as object,
      model: input.model,
    },
  });
}
