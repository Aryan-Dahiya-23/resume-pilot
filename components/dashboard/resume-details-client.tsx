"use client";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
import type { ResumeReviewFeedback, ResumeReviewVersion } from "@/lib/api/resumes";
import type { Resume, ResumeFeedback } from "@/lib/mock-data";
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
  const [roleTarget, setRoleTarget] = useState("Frontend Engineer");
  const [targetLevel, setTargetLevel] = useState("Internship");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!detailsQuery.data) return;
    setRoleTarget(detailsQuery.data.roleTarget ?? "Frontend Engineer");
    setTargetLevel(detailsQuery.data.targetLevel ?? "Internship");
  }, [
    detailsQuery.data?.id,
    detailsQuery.data?.roleTarget,
    detailsQuery.data?.targetLevel,
  ]);

  const baseFeedback = useMemo(
    () =>
      detailsQuery.data?.feedback ? toLegacyFeedback(detailsQuery.data.feedback) : emptyFeedback,
    [detailsQuery.data?.feedback],
  );

  const reviewHistory = useMemo(() => {
    const source = detailsQuery.data?.reviewHistory ?? [];
    return source.map((item, index) => toHistoryItem(item, `v${source.length - index}`));
  }, [detailsQuery.data?.reviewHistory]);

  useEffect(() => {
    if (!reviewHistory.length) {
      setSelectedReviewId(null);
      return;
    }
    setSelectedReviewId((current) => {
      if (current && reviewHistory.some((item) => item.id === current)) return current;
      return reviewHistory[0].id;
    });
  }, [reviewHistory]);

  const selectedReview =
    reviewHistory.find((item) => item.id === selectedReviewId) ?? reviewHistory[0] ?? null;
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
      await axios.post(`/api/resumes/${resumeId}/rerun`, {}, { withCredentials: true });
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
        queryClient.removeQueries({ queryKey: queryKeys.resumes.detail(resumeId) }),
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
        isRerunning={isRerunning}
        scoreDelta={latestScoreDelta}
        versionOptions={versionOptions}
        selectedVersionId={selectedReviewId ?? undefined}
        onSelectVersion={setSelectedReviewId}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <ResumeDetailsMain
          feedback={selectedFeedback}
          reviewHistory={reviewHistoryRows}
          selectedReviewId={selectedReviewId}
          onSelectReview={setSelectedReviewId}
          onCopyKeywords={() => copyToClipboard(selectedFeedback.missingKeywords.join(", "))}
          onCopySuggestion={(item) =>
            copyToClipboard(`Before: ${item.before}\nAfter: ${item.after}\nWhy: ${item.why}`)
          }
        />
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

      {isDeleteModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl">
            <div className="text-base font-semibold text-zinc-900">Delete Resume?</div>
            <div className="mt-2 text-sm text-zinc-600">
              This will permanently remove the resume, parse data, and review.
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-60"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
