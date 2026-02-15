import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureCurrentDbUser } from "@/lib/db/users";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await ensureCurrentDbUser();
  if (!dbUser) {
    return NextResponse.json(
      { error: "Could not create or load user record" },
      { status: 500 },
    );
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: dbUser.id },
    include: {
      review: true,
      reviewHistory: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const payload = {
    exportedAt: new Date().toISOString(),
    resumes: resumes.map((resume) => ({
      id: resume.id,
      fileName: resume.fileName,
      roleTarget: resume.roleTarget,
      targetLevel: resume.targetLevel,
      status: resume.status,
      createdAt: resume.createdAt.toISOString(),
      updatedAt: resume.updatedAt.toISOString(),
      latestReview: resume.review
        ? {
            score: resume.review.score,
            summaryJson: resume.review.summaryJson,
            missingKeywords: resume.review.missingKeywords,
            suggestionsJson: resume.review.suggestionsJson,
            model: resume.review.model,
            createdAt: resume.review.createdAt.toISOString(),
            updatedAt: resume.review.updatedAt.toISOString(),
          }
        : null,
      reviewHistory: resume.reviewHistory.map((item) => ({
        id: item.id,
        score: item.score,
        summaryJson: item.summaryJson,
        missingKeywords: item.missingKeywords,
        suggestionsJson: item.suggestionsJson,
        model: item.model,
        createdAt: item.createdAt.toISOString(),
      })),
    })),
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="resume-feedback-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
