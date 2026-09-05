"use client";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  DashboardPageError,
  DashboardPageLoading,
} from "@/components/dashboard/page-state";
import {
  ResumeDetailsMain,
  ResumeDetailsSidebar,
  ResumeFeedbackHeader,
} from "@/components/dashboard/resume-details-sections";
import { useResumeDetails } from "@/hooks/queries";
import { useToast } from "@/components/providers/toast-provider";
import type {
  ResumeReviewFeedback,
  ResumeReviewVersion,
} from "@/lib/api/resumes";
import type { Resume, ResumeFeedback } from "@/lib/mock-data";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { queryKeys } from "@/lib/react-query/query-keys";

type ReviewHistoryItem = {
  id: string;
  model: string;
  createdAt: string;
  versionLabel: string;
  feedback: ResumeFeedback;
};

function toLegacyFeedback(review: ResumeReviewFeedback): ResumeFeedback {
  return {
    score: review.score,
    summary: {
      strengths: review.strengths,
      weaknesses: review.weaknesses,
    },
    missingKeywords: review.missingKeywords,
    rewriteSuggestions: review.rewriteSuggestions,
    atsChecks: review.atsChecks,
    nextActions: review.nextActions,
  };
}

function toHistoryItem(
  review: ResumeReviewVersion,
  versionLabel: string,
): ReviewHistoryItem {
  return {
    id: review.id,
    model: review.model,
    createdAt: review.createdAt,
    versionLabel,
    feedback: toLegacyFeedback(review),
  };
}

const emptyFeedback: ResumeFeedback = {
  score: 0,
  summary: { strengths: [], weaknesses: [] },
  missingKeywords: [],
  rewriteSuggestions: [],
  atsChecks: [],
  nextActions: [],
};

export function ResumeDetailsClient({ resumeId }: { resumeId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const detailsQuery = useResumeDetails(resumeId);
  const [isRerunning, setIsRerunning] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleDraft, setRoleTarget] = useState<string | null>(null);
  const [levelDraft, setTargetLevel] = useState<string | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const { toast } = useToast();

  const roleTarget =
    roleDraft ?? detailsQuery.data?.roleTarget ?? "Frontend Engineer";
  const targetLevel =
    levelDraft ?? detailsQuery.data?.targetLevel ?? "Internship";

  const baseFeedback = useMemo(
    () =>
      detailsQuery.data?.feedback
        ? toLegacyFeedback(detailsQuery.data.feedback)
        : emptyFeedback,
    [detailsQuery.data],
  );

  const reviewHistory = useMemo(() => {
    const source = detailsQuery.data?.reviewHistory ?? [];
    return source.map((item, index) =>
      toHistoryItem(item, `v${source.length - index}`),
    );
  }, [detailsQuery.data?.reviewHistory]);

  const selectedReview =
    reviewHistory.find((item) => item.id === selectedReviewId) ??
    reviewHistory[0] ??
    null;
  const selectedFeedback = selectedReview?.feedback ?? baseFeedback;
  const selectedResume: Resume = {
    id: detailsQuery.data?.id ?? "",
    version: selectedReview?.versionLabel ?? "v1",
    uploadedAt: detailsQuery.data?.createdAt
      ? new Date(detailsQuery.data.createdAt).toLocaleDateString()
      : "Unknown",
    score: selectedFeedback.score,
    roleTarget: detailsQuery.data?.roleTarget ?? undefined,
    targetLevel: detailsQuery.data?.targetLevel ?? undefined,
    fileName: detailsQuery.data?.fileName ?? "Resume",
  };

  const latestScoreDelta =
    reviewHistory.length >= 2
      ? reviewHistory[0].feedback.score - reviewHistory[1].feedback.score
      : null;

  const versionOptions = reviewHistory.map((item) => ({
    id: item.id,
    label: `${item.versionLabel} (${new Date(item.createdAt).toLocaleDateString()})`,
  }));
  const reviewHistoryRows = reviewHistory.map((item) => ({
    id: item.id,
    versionLabel: item.versionLabel,
    createdAt: item.createdAt,
    model: item.model,
    score: item.feedback.score,
  }));

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast({ tone: "success", message: "Copied to clipboard." });
    } catch {
      toast({ tone: "error", message: "Could not copy." });
    }
  }

  async function handleRerunReview() {
    setIsRerunning(true);
    try {
      await axios.post(
        `/api/resumes/${resumeId}/rerun`,
        {},
        { withCredentials: true },
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.resumes.list() }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.resumes.detail(resumeId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.overview(),
        }),
      ]);
      setSelectedReviewId(null);
      toast({ tone: "success", message: "Review has been re-queued." });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast({
          tone: "error",
          message:
            (err.response?.data as { error?: string } | undefined)?.error ??
            "Could not re-run review.",
        });
      } else {
        toast({ tone: "error", message: "Could not re-run review." });
      }
    } finally {
      setIsRerunning(false);
    }
  }

  async function handleDownload() {
    setIsDownloading(true);
    try {
      const response = await axios.get<{ url: string }>(
        `/api/resumes/${resumeId}/download`,
        { withCredentials: true },
      );
      window.open(response.data.url, "_blank", "noopener,noreferrer");
      toast({ tone: "success", message: "Download link opened." });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast({
          tone: "error",
          message:
            (err.response?.data as { error?: string } | undefined)?.error ??
            "Could not prepare download link.",
        });
      } else {
        toast({ tone: "error", message: "Could not prepare download link." });
      }
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/resumes/${resumeId}`, { withCredentials: true });
      setIsDeleteModalOpen(false);
      router.push("/dashboard/resumes");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.resumes.list() }),
        queryClient.removeQueries({
          queryKey: queryKeys.resumes.detail(resumeId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.overview(),
        }),
      ]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast({
          tone: "error",
          message:
            (err.response?.data as { error?: string } | undefined)?.error ??
            "Could not delete resume.",
        });
      } else {
        toast({ tone: "error", message: "Could not delete resume." });
      }
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSaveTargetRole() {
    setIsSavingRole(true);
    try {
      await axios.patch(
        `/api/resumes/${resumeId}`,
        { roleTarget, targetLevel },
        { withCredentials: true },
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.resumes.list() }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.resumes.detail(resumeId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.dashboard.overview(),
        }),
      ]);
      toast({ tone: "success", message: "Target preferences saved." });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast({
          tone: "error",
          message:
            (err.response?.data as { error?: string } | undefined)?.error ??
            "Could not save target role.",
        });
      } else {
        toast({ tone: "error", message: "Could not save target role." });
      }
    } finally {
      setIsSavingRole(false);
    }
  }

  if (detailsQuery.isLoading) {
    return <DashboardPageLoading label="Loading resume details..." />;
  }

  if (detailsQuery.isError || !detailsQuery.data) {
    return (
      <DashboardPageError
        title="Could not load this resume"
        message="We could not fetch resume details right now."
        onRetry={() => {
          void detailsQuery.refetch();
        }}
      />
    );
  }

  return (
    <>
      <ResumeFeedbackHeader
        resume={selectedResume}
        onRerunReview={handleRerunReview}
        isRerunning={
          isRerunning ||
          ["PARSING", "REVIEWING"].includes(
            detailsQuery.data.status,
          )
        }
        scoreDelta={latestScoreDelta}
        versionOptions={versionOptions}
        selectedVersionId={selectedReview?.id}
        onSelectVersion={setSelectedReviewId}
      />

      {detailsQuery.data.status !== "READY" && (
        <section role="status" className="panel flex items-start gap-4 p-6">
          {detailsQuery.data.status === "FAILED" ? (
            <AlertCircle className="shrink-0 text-amber-600" size={22} />
          ) : (
            <Loader2
              className="shrink-0 animate-spin text-[#7c9d59]"
              size={22}
            />
          )}
          <div>
            <h2 className="text-base font-medium">
              {detailsQuery.data.status === "FAILED"
                ? "This review needs another try."
                : "Your story is getting a fresh look."}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {detailsQuery.data.status === "FAILED"
                ? "We couldn’t finish processing this file. Try reviewing it again, or upload another version."
                : "We’re reading your resume and preparing specific suggestions. This page updates automatically."}
            </p>
            {detailsQuery.data.status !== "FAILED" && (
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  Uploaded
                </span>
                <span>
                  {detailsQuery.data.status === "REVIEWING"
                    ? "✓ Resume read"
                    : "Reading your file"}
                </span>
                <span>
                  {detailsQuery.data.status === "REVIEWING"
                    ? "Preparing feedback…"
                    : "Then: your AI review"}
                </span>
              </div>
            )}
          </div>
        </section>
      )}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        {detailsQuery.data.feedback || reviewHistory.length > 0 ? (
          <>
            <ResumeDetailsMain
              feedback={selectedFeedback}
              reviewHistory={reviewHistoryRows}
              selectedReviewId={selectedReview?.id}
              onSelectReview={setSelectedReviewId}
              onCopyKeywords={() =>
                copyToClipboard(selectedFeedback.missingKeywords.join(", "))
              }
              onCopySuggestion={(item) => copyToClipboard(item.after)}
            />
          </>
        ) : (
          <section className="panel empty-state">
            <h2>Your feedback will appear here.</h2>
            <p>
              We’ll show your score, suggestions, and next steps once the review
              is complete.
            </p>
          </section>
        )}
        <ResumeDetailsSidebar
          feedback={selectedFeedback}
          roleTarget={roleTarget}
          targetLevel={targetLevel}
          onRoleTargetChange={setRoleTarget}
          onTargetLevelChange={setTargetLevel}
          onSaveTargetRole={handleSaveTargetRole}
          isSavingRole={isSavingRole}
          onDownload={handleDownload}
          onDelete={() => setIsDeleteModalOpen(true)}
          isDownloading={isDownloading}
          isDeleting={isDeleting}
        />
      </div>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete this resume?"
        description="This permanently removes the original file and all its reviews."
        busy={isDeleting}
      >
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Keep resume
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete resume"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
