import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { listJobsByUserId } from "@/lib/db/jobs";
import { ensureCurrentDbUser } from "@/lib/db/users";

function csvEscape(value: unknown) {
  const raw = value == null ? "" : String(value);
  return `"${raw.replaceAll('"', '""')}"`;
}

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

  const jobs = await listJobsByUserId(dbUser.id);
  const header = [
    "id",
    "company",
    "role",
    "status",
    "location",
    "link",
    "followUp",
    "contactName",
    "contactEmail",
    "createdAt",
    "updatedAt",
  ];
  const rows = jobs.map((job) => [
    job.id,
    job.company,
    job.role,
    job.status,
    job.location,
    job.link,
    job.followUp,
    job.contactName,
    job.contactEmail,
    job.createdAt.toISOString(),
    job.updatedAt.toISOString(),
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="jobs-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
