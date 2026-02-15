import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createResume } from "@/lib/db/resumes";
import { ensureCurrentDbUser } from "@/lib/db/users";
import { inngest } from "@/lib/inngest/client";
import { uploadResumeFileToSupabaseStorage } from "@/lib/supabase-storage";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

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

  const formData = await request.formData();
  const file = formData.get("file");
  const roleTargetRaw = formData.get("roleTarget");
  const targetLevelRaw = formData.get("targetLevel");
  const roleTarget = typeof roleTargetRaw === "string" ? roleTargetRaw.trim() : "";
  const targetLevel = typeof targetLevelRaw === "string" ? targetLevelRaw.trim() : "";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only PDF and DOCX files are supported" },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File is too large. Maximum size is 5MB." },
      { status: 400 },
    );
  }

  const { storageKey, bucket } = await uploadResumeFileToSupabaseStorage({
    userId: dbUser.id,
    file,
  });

  const resume = await createResume({
    userId: dbUser.id,
    fileName: file.name,
    storageKey,
    mimeType: file.type,
    size: file.size,
    roleTarget: roleTarget || undefined,
    targetLevel: targetLevel || undefined,
    status: "UPLOADED",
  });

  let processingQueued = true;
  try {
    await inngest.send({
      name: "resume/uploaded",
      data: {
        resumeId: resume.id,
        userId: dbUser.id,
      },
    });
  } catch {
    processingQueued = false;
  }

  return NextResponse.json(
    {
      resume: {
        id: resume.id,
        fileName: resume.fileName,
        roleTarget: resume.roleTarget,
        targetLevel: resume.targetLevel,
        status: resume.status,
        size: resume.size,
        mimeType: resume.mimeType,
        storageKey: resume.storageKey,
        bucket,
        createdAt: resume.createdAt,
      },
      processingQueued,
    },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
