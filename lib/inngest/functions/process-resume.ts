import { inngest } from "@/lib/inngest/client";
import {
  getResumeById,
  saveCompletedResumeReview,
  updateResumeStatus,
  upsertResumeParse,
} from "@/lib/db/resumes";
import { reviewResumeWithDeepSeek } from "@/lib/ai/review-resume";
import { parseResumeFile } from "@/lib/resume-parser";
import { downloadResumeFileFromSupabaseStorage } from "@/lib/supabase-storage";

export const processResume = inngest.createFunction(
  {
    id: "process-resume",
    triggers: [{ event: "resume/uploaded" }],
    retries: 3,
    concurrency: { limit: 1, key: "event.data.resumeId" },
    onFailure: async ({ event }) => {
      const resumeId = event.data.event.data.resumeId;
      if (typeof resumeId === "string") {
        await updateResumeStatus(resumeId, "FAILED");
      }
    },
  },
  async ({ event, step, runId }) => {
    if (event.name !== "resume/uploaded") {
      return { ok: false, reason: "unexpected-event" };
    }

    const { resumeId } = event.data as { resumeId: string; userId: string };
    const resume = await step.run("load resume", () => getResumeById(resumeId));
    if (!resume) return { ok: false, reason: "resume-not-found" };

    await step.run("set status parsing", () => updateResumeStatus(resumeId, "PARSING"));

    const parsed = await step.run("parse resume file (real)", async () => {
      const fileBuffer = await downloadResumeFileFromSupabaseStorage({ storageKey: resume.storageKey });
      const parsedResume = await parseResumeFile({
        mimeType: resume.mimeType,
        fileName: resume.fileName,
        buffer: fileBuffer,
      });
      await upsertResumeParse({
        resumeId,
        rawText: parsedResume.rawText,
        structuredJson: parsedResume.structured,
        parserVersion: parsedResume.parserVersion,
      });
      return parsedResume;
    });

    await step.run("set status reviewing", () => updateResumeStatus(resumeId, "REVIEWING"));

    const review = await step.run("review resume with ai (deepseek)", () =>
      reviewResumeWithDeepSeek({
        roleTarget: resume.roleTarget,
        targetLevel: resume.targetLevel,
        rawText: parsed.rawText,
        structuredJson: parsed.structured,
      }),
    );

    await step.run("save completed review", () => saveCompletedResumeReview(resumeId, runId, review));
    return { ok: true };
  },
);
