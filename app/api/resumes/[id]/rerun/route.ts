import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getResumeByIdForUser, updateResumeStatus } from "@/lib/db/resumes";
import { ensureCurrentDbUser } from "@/lib/db/users";
import { inngest } from "@/lib/inngest/client";

export async function POST(
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
  const resume = await getResumeByIdForUser({
    resumeId: id,
    userId: dbUser.id,
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  await updateResumeStatus(resume.id, "UPLOADED");

  await inngest.send({
    name: "resume/uploaded",
    data: {
      resumeId: resume.id,
      userId: dbUser.id,
    },
  });

  return NextResponse.json({ ok: true });
}
