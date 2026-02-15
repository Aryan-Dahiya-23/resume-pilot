import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createJob, listJobsByUserId } from "@/lib/db/jobs";
import { ensureCurrentDbUser } from "@/lib/db/users";
import { createJobSchema } from "@/lib/validators/jobs";

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
  return NextResponse.json(
    { jobs },
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
