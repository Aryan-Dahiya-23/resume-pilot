import { inngest } from "@/lib/inngest/client";
import {
  createResumeReviewHistory,
  getResumeById,
  updateResumeStatus,
  upsertResumeParse,
  upsertResumeReview,
} from "@/lib/db/resumes";
import { reviewResumeWithGemini } from "@/lib/ai/review-resume";
import { parseResumeFile } from "@/lib/resume-parser";
import { downloadResumeFileFromSupabaseStorage } from "@/lib/supabase-storage";

type ResumeUploadedEvent = {
  name: "resume/uploaded";
  data: {
    resumeId: string;
    userId: string;
  };
};

export const processResume = inngest.createFunction(
  { id: "process-resume" },
  { event: "resume/uploaded" },
  async ({ event, step }) => {
    const typedEvent = event as ResumeUploadedEvent;
    const resumeId = typedEvent.data.resumeId;

    const resume = await step.run("load resume", async () => {
      return getResumeById(resumeId);
    });

    if (!resume) {
      return { ok: false, reason: "resume-not-found" };
    }

    await step.run("set status parsing", async () => {
      await updateResumeStatus(resumeId, "PARSING");
    });

    const parsed = await step.run("parse resume file (real)", async () => {
      try {
        const fileBuffer = await downloadResumeFileFromSupabaseStorage({
          storageKey: resume.storageKey,
        });

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
      } catch (error) {
        await updateResumeStatus(resumeId, "FAILED");
        throw error;
      }
    });

    await step.run("set status reviewing", async () => {
      await updateResumeStatus(resumeId, "REVIEWING");
    });

    await step.run("review resume with ai (gemini)", async () => {
      try {
        const review = await reviewResumeWithGemini({
          roleTarget: resume.roleTarget,
          targetLevel: resume.targetLevel,
          rawText: parsed.rawText,
          structuredJson: parsed.structured,
        });

        await createResumeReviewHistory({
          resumeId,
          score: review.score,
          summaryJson: {
            strengths: review.strengths,
            weaknesses: review.weaknesses,
            nextActions: review.nextActions,
          },
          missingKeywords: review.missingKeywords,
          suggestionsJson: review.rewriteSuggestions,
          model: review.model,
        });

        await upsertResumeReview({
          resumeId,
          score: review.score,
          summaryJson: {
            strengths: review.strengths,
            weaknesses: review.weaknesses,
            nextActions: review.nextActions,
          },
          missingKeywords: review.missingKeywords,
          suggestionsJson: review.rewriteSuggestions,
          model: review.model,
        });
      } catch (error) {
        await updateResumeStatus(resumeId, "FAILED");
        throw error;
      }
    });

    await step.run("set status ready", async () => {
      await updateResumeStatus(resumeId, "READY");
    });

    return { ok: true };
  },
);
