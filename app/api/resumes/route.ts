import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { listResumesByUserId } from "@/lib/db/resumes";
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

  const resumes = await listResumesByUserId(dbUser.id);
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
    { resumes: payload },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
