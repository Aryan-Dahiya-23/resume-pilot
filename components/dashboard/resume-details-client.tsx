"use client";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DashboardPageError,
  DashboardPageLoading,
} from "@/components/dashboard/page-state";
import {
  ResumeDetailsMain,
  ResumeDetailsSidebar,
  ResumeFeedbackHeader,
} from "@/components/dashboard/resume-details-sections";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [roleTarget, setRoleTarget] = useState<string | null>(null);
  const [targetLevel, setTargetLevel] = useState<string | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const { toast } = useToast();

  const baseFeedback = detailsQuery.data?.feedback
    ? toLegacyFeedback(detailsQuery.data.feedback)
    : emptyFeedback;
  const reviewHistory = (detailsQuery.data?.reviewHistory ?? []).map(
    (item, index, source) => toHistoryItem(item, `v${source.length - index}`),
  );

  const selectedReview =
    reviewHistory.find((item) => item.id === selectedReviewId) ?? reviewHistory[0] ?? null;
  const selectedFeedback = selectedReview?.feedback ?? baseFeedback;
  const selectedRoleTarget =
    roleTarget ?? detailsQuery.data?.roleTarget ?? "Frontend Engineer";
  const selectedTargetLevel =
    targetLevel ?? detailsQuery.data?.targetLevel ?? "Internship";
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
        { roleTarget: selectedRoleTarget, targetLevel: selectedTargetLevel },
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
    <div className="space-y-6 sm:space-y-8">
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
          roleTarget={selectedRoleTarget}
          targetLevel={selectedTargetLevel}
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

      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isDeleting) setIsDeleteModalOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={!isDeleting}>
          <DialogHeader>
            <DialogTitle>Delete this resume?</DialogTitle>
            <DialogDescription>
              This permanently removes the resume, parse data, and every review
              run associated with it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete resume"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
