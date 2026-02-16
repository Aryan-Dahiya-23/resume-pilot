import { auth } from "@clerk/nextjs/server";
import type { JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  countJobsByUserId,
  countJobsByUserIdWithFilters,
  createJob,
  listJobsByUserIdWithFiltersPaginated,
} from "@/lib/db/jobs";
import { ensureCurrentDbUser } from "@/lib/db/users";
import { createJobSchema } from "@/lib/validators/jobs";

const ALLOWED_STATUS = new Set<JobStatus>([
  "Saved",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
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
  const pageRaw = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const limitRaw = Number.parseInt(searchParams.get("limit") ?? "10", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 50) : 10;

  const status =
    statusRaw && ALLOWED_STATUS.has(statusRaw as JobStatus)
      ? (statusRaw as JobStatus)
      : undefined;
  const dateRange =
    dateRangeRaw && ALLOWED_DATE_RANGE.has(dateRangeRaw)
      ? (dateRangeRaw as "today" | "7d" | "30d")
      : undefined;

  const [jobs, totalCount, filteredCount] = await Promise.all([
    listJobsByUserIdWithFiltersPaginated(
      dbUser.id,
      {
        query,
        status,
        dateRange,
      },
      {
        page,
        limit,
      },
    ),
    countJobsByUserId(dbUser.id),
    countJobsByUserIdWithFilters(dbUser.id, {
      query,
      status,
      dateRange,
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(filteredCount / limit));

  return NextResponse.json(
    { jobs, totalCount, filteredCount, page, limit, totalPages },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}

export async function POST(request: Request) {
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

  const body = await request.json();
  const parsed = createJobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const job = await createJob({
    userId: dbUser.id,
    company: parsed.data.company,
    role: parsed.data.role,
    status: parsed.data.status,
    notes: parsed.data.notes ?? null,
    followUp: parsed.data.followUp ?? null,
    contactName: parsed.data.contactName ?? null,
    contactEmail: parsed.data.contactEmail ?? null,
    interviewRounds: parsed.data.interviewRounds ?? [],
    location: parsed.data.location ?? null,
    link: parsed.data.link ?? null,
  });

  return NextResponse.json(
    { job },
    {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
