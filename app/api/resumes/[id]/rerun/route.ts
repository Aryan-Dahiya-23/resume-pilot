import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  claimResumeReview,
  getResumeByIdForUser,
  updateResumeStatus,
} from "@/lib/db/resumes";
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

  const isActive = resume.status === "PARSING" || resume.status === "REVIEWING";
  const recentlyQueued =
    resume.status === "UPLOADED" &&
    Date.now() - resume.updatedAt.getTime() < 10 * 60 * 1000;
  if (isActive || recentlyQueued) {
    return NextResponse.json({ error: "A review is already in progress. This page will update automatically." }, { status: 409 });
  }

  const claimed = await claimResumeReview({
    resumeId: resume.id,
    userId: dbUser.id,
    status: resume.status,
    updatedAt: resume.updatedAt,
  });
  if (!claimed.count) {
    return NextResponse.json({ error: "This resume changed. Refresh before trying again." }, { status: 409 });
  }

  try {
    await inngest.send({
      name: "resume/uploaded",
      data: {
        resumeId: resume.id,
        userId: dbUser.id,
      },
    });
  } catch {
    await updateResumeStatus(resume.id, "FAILED");
    return NextResponse.json({ error: "We could not queue your review. Your file is safe; please try again." }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
