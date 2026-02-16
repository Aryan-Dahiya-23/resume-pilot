import { auth } from "@clerk/nextjs/server";
import type { ResumeStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { countResumesByUserId, listResumesByUserIdWithFilters } from "@/lib/db/resumes";
import { ensureCurrentDbUser } from "@/lib/db/users";

const ALLOWED_STATUS = new Set<ResumeStatus>([
  "UPLOADED",
  "PARSING",
  "REVIEWING",
  "READY",
  "FAILED",
]);
const ALLOWED_DATE_RANGE = new Set(["today", "7d", "30d"]);

export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const statusRaw = searchParams.get("status");
  const dateRangeRaw = searchParams.get("dateRange");

  const status =
    statusRaw && ALLOWED_STATUS.has(statusRaw as ResumeStatus)
      ? (statusRaw as ResumeStatus)
      : undefined;
  const dateRange =
    dateRangeRaw && ALLOWED_DATE_RANGE.has(dateRangeRaw)
      ? (dateRangeRaw as "today" | "7d" | "30d")
      : undefined;

  const [resumes, totalCount] = await Promise.all([
    listResumesByUserIdWithFilters(dbUser.id, {
      query,
      status,
      dateRange,
    }),
    countResumesByUserId(dbUser.id),
  ]);

  const payload = resumes.map((resume) => ({
    id: resume.id,
    fileName: resume.fileName,
    roleTarget: resume.roleTarget,
    targetLevel: resume.targetLevel,
    status: resume.status,
    createdAt: resume.createdAt,
    score: resume.review?.score ?? null,
  }));

  return NextResponse.json(
    { resumes: payload, totalCount },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
