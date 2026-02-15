import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getResumeByIdForUser } from "@/lib/db/resumes";
import { ensureCurrentDbUser } from "@/lib/db/users";
import { createSignedResumeFileUrl } from "@/lib/supabase-storage";

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
  const resume = await getResumeByIdForUser({
    resumeId: id,
    userId: dbUser.id,
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const url = await createSignedResumeFileUrl({
    storageKey: resume.storageKey,
    expiresIn: 120,
  });

  return NextResponse.json({ url });
}
