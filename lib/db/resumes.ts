import { prisma } from "@/lib/prisma";
import type { ResumeStatus } from "@prisma/client";

type CreateResumeInput = {
  userId: string;
  fileName: string;
  storageKey: string;
  mimeType: string;
  size: number;
  roleTarget?: string;
  targetLevel?: string;
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
}) {
  return prisma.resume.updateMany({
    where: {
      id: input.resumeId,
      userId: input.userId,
    },
    data: {
      roleTarget: input.roleTarget,
      targetLevel: input.targetLevel,
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
