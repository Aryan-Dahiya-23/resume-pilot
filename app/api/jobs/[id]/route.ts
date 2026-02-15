import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  deleteJobByIdForUser,
  getJobByIdForUser,
  updateJobByIdForUser,
} from "@/lib/db/jobs";
import { ensureCurrentDbUser } from "@/lib/db/users";
import { updateJobSchema } from "@/lib/validators/jobs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;
  const job = await getJobByIdForUser({
    jobId: id,
    userId: dbUser.id,
  });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(
    { job },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;
  const body = await request.json();
  const parsed = updateJobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 400 },
    );
  }

  const updated = await updateJobByIdForUser({
    jobId: id,
    userId: dbUser.id,
    company: parsed.data.company,
    role: parsed.data.role,
    status: parsed.data.status,
    notes: parsed.data.notes,
    followUp: parsed.data.followUp,
    contactName: parsed.data.contactName,
    contactEmail: parsed.data.contactEmail,
    interviewRounds:
      parsed.data.interviewRounds === null
        ? []
        : parsed.data.interviewRounds,
    location: parsed.data.location,
    link: parsed.data.link,
  });

  if (!updated.count) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;
  const deleted = await deleteJobByIdForUser({
    jobId: id,
    userId: dbUser.id,
  });

  if (!deleted.count) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
