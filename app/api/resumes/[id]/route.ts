import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  deleteResumeByIdForUser,
  getResumeByIdForUser,
  getResumeDetailsByIdForUser,
  updateResumeTargetByIdForUser,
} from "@/lib/db/resumes";
import { ensureCurrentDbUser } from "@/lib/db/users";
import { deleteResumeFileFromSupabaseStorage } from "@/lib/supabase-storage";

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toRewriteSuggestions(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const before = (item as { before?: unknown }).before;
      const after = (item as { after?: unknown }).after;
      const why = (item as { why?: unknown }).why;
      if (typeof before !== "string" || typeof after !== "string" || typeof why !== "string") {
        return null;
      }
      return { before, after, why };
    })
    .filter(Boolean);
}

function toFeedback(value: {
  score: number;
  summaryJson: unknown;
  missingKeywords: unknown;
  suggestionsJson: unknown;
  atsChecks: Array<{ label: string; ok: boolean }>;
}) {
  const summary =
    (value.summaryJson as {
      strengths?: unknown;
      weaknesses?: unknown;
      nextActions?: unknown;
    } | null) ?? null;

  return {
    score: value.score,
    strengths: toStringArray(summary?.strengths),
    weaknesses: toStringArray(summary?.weaknesses),
    nextActions: toStringArray(summary?.nextActions),
    missingKeywords: toStringArray(value.missingKeywords),
    rewriteSuggestions: toRewriteSuggestions(value.suggestionsJson),
    atsChecks: value.atsChecks,
  };
}

function extractStructuredSections(value: unknown) {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    experience: toStringArray(source.experience),
    projects: toStringArray(source.projects),
    skills: toStringArray(source.skills),
    education: toStringArray(source.education),
  };
}

function buildAtsChecks(input: {
  rawText: string;
  roleTarget: string | null;
  structuredJson: unknown;
}) {
  const raw = input.rawText || "";
  const sections = extractStructuredSections(input.structuredJson);
  const hasContact = /@|\+?\d[\d\s-]{7,}/.test(raw);
  const hasMetrics = /\b\d+%|\b\d+\+|\b\d+(k|m|x)\b/i.test(raw);
  const hasSkills = sections.skills.length > 0;
  const hasProjectsOrExperience =
    sections.projects.length > 0 || sections.experience.length > 0;
  const hasEducation = sections.education.length > 0;
  const hasRoleTarget = Boolean(input.roleTarget?.trim());

  return [
    { label: "Contact info present", ok: hasContact },
    { label: "Skills section present", ok: hasSkills },
    { label: "Projects / experience present", ok: hasProjectsOrExperience },
    { label: "Education section present", ok: hasEducation },
    { label: "Impact metrics present", ok: hasMetrics },
    { label: "Target role selected", ok: hasRoleTarget },
  ];
}

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
  const resume = await getResumeDetailsByIdForUser({
    resumeId: id,
    userId: dbUser.id,
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  const atsChecks = buildAtsChecks({
    rawText: resume.parse?.rawText ?? "",
    roleTarget: resume.roleTarget,
    structuredJson: resume.parse?.structuredJson,
  });

  const feedback = resume.review
    ? toFeedback({
        score: resume.review.score,
        summaryJson: resume.review.summaryJson,
        missingKeywords: resume.review.missingKeywords,
        suggestionsJson: resume.review.suggestionsJson,
        atsChecks,
      })
    : null;
  const reviewHistory = resume.reviewHistory.map((item) => ({
    id: item.id,
    model: item.model,
    createdAt: item.createdAt,
    ...toFeedback({
      score: item.score,
      summaryJson: item.summaryJson,
      missingKeywords: item.missingKeywords,
      suggestionsJson: item.suggestionsJson,
      atsChecks,
    }),
  }));

  return NextResponse.json(
    {
      resume: {
        id: resume.id,
        fileName: resume.fileName,
        roleTarget: resume.roleTarget,
        targetLevel: resume.targetLevel,
        status: resume.status,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
        mimeType: resume.mimeType,
        size: resume.size,
        storageKey: resume.storageKey,
        parse: resume.parse
          ? {
              parserVersion: resume.parse.parserVersion,
              rawText: resume.parse.rawText,
              structuredJson: resume.parse.structuredJson,
            }
          : null,
        feedback,
        reviewHistory,
      },
    },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
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
  const resume = await getResumeByIdForUser({
    resumeId: id,
    userId: dbUser.id,
  });

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  await deleteResumeFileFromSupabaseStorage({
    storageKey: resume.storageKey,
  });

  await deleteResumeByIdForUser({
    resumeId: id,
    userId: dbUser.id,
  });

  return NextResponse.json({ ok: true });
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
  const body = (await request.json()) as {
    roleTarget?: unknown;
    targetLevel?: unknown;
  };
  const roleTarget =
    typeof body.roleTarget === "string" ? body.roleTarget.trim() : "";
  const targetLevel =
    typeof body.targetLevel === "string" ? body.targetLevel.trim() : "";

  const updated = await updateResumeTargetByIdForUser({
    resumeId: id,
    userId: dbUser.id,
    roleTarget: roleTarget || null,
    targetLevel: targetLevel || null,
  });

  if (!updated.count) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
