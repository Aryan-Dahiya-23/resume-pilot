"use client";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useClerk } from "@clerk/nextjs";
import {
  AlertTriangle,
  Download,
  Loader2,
  Save,
  UserRound,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/providers/toast-provider";
import { useCurrentDbUser } from "@/hooks/queries";
import { queryKeys } from "@/lib/react-query/query-keys";

export function SettingsHeader() {
  return (
    <PageHeader
      eyebrow="MAKE YOURSELF AT HOME"
      title="Settings"
      description="Your profile, your data, your workspace."
    />
  );
}

export function ProfileSettingsCard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: currentUser } = useCurrentDbUser();
  const [name, setName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const value = name ?? currentUser?.name ?? "";

  async function handleSave() {
    setIsSaving(true);
    try {
      await axios.patch(
        "/api/settings/profile",
        { name: value },
        { withCredentials: true },
      );
      await queryClient.invalidateQueries({
        queryKey: queryKeys.user.current(),
      });
      toast({ tone: "success", message: "Profile updated." });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          tone: "error",
          message:
            (error.response?.data as { error?: string } | undefined)?.error ??
            "Failed to update profile.",
        });
      } else {
        toast({ tone: "error", message: "Failed to update profile." });
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card title="Profile" icon={<UserRound className="h-4 w-4" />}>
      <div className="text-sm text-zinc-600">
        A few details to make this space feel like yours.
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3">
        <div>
          <label htmlFor="profile-name" className="field-label">
            Your name
          </label>
          <input
            id="profile-name"
            autoComplete="name"
            value={value}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
        </div>
        <div>
          <label htmlFor="profile-email" className="field-label">
            Email address
          </label>
          <input
            id="profile-email"
            value={currentUser?.email ?? ""}
            readOnly
            className="mt-1 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 outline-none"
          />
        </div>
      </div>
      <div className="mt-4">
        <Button onClick={handleSave} disabled={isSaving || !value.trim()}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </Card>
  );
}

export function DataSettingsCard() {
  const { toast } = useToast();
  const [isExportingJobs, setIsExportingJobs] = useState(false);
  const [isExportingFeedback, setIsExportingFeedback] = useState(false);

  async function downloadFile(url: string, fileName: string) {
    const response = await axios.get(url, {
      withCredentials: true,
      responseType: "blob",
    });
    const blobUrl = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  }

  async function handleExportJobs() {
    setIsExportingJobs(true);
    try {
      await downloadFile(
        "/api/settings/export/jobs",
        `jobs-${new Date().toISOString().slice(0, 10)}.csv`,
      );
      toast({ tone: "success", message: "Jobs exported." });
    } catch {
      toast({ tone: "error", message: "Could not export jobs." });
    } finally {
      setIsExportingJobs(false);
    }
  }

  async function handleExportFeedback() {
    setIsExportingFeedback(true);
    try {
      await downloadFile(
        "/api/settings/export/resume-feedback",
        `resume-feedback-${new Date().toISOString().slice(0, 10)}.json`,
      );
      toast({ tone: "success", message: "Feedback exported." });
    } catch {
      toast({ tone: "error", message: "Could not export feedback." });
    } finally {
      setIsExportingFeedback(false);
    }
  }

  return (
    <Card
      title="Take your progress with you"
      icon={<Download className="h-4 w-4" />}
    >
      <div className="text-sm text-zinc-600">
        Export your jobs and resume feedback for backups or offline analysis.
      </div>
      <div className="mt-4 flex flex-col gap-3">
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleExportJobs}
          disabled={isExportingJobs}
        >
          {isExportingJobs ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isExportingJobs ? "Exporting..." : "Export jobs CSV"}
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleExportFeedback}
          disabled={isExportingFeedback}
        >
          {isExportingFeedback ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isExportingFeedback ? "Exporting..." : "Export feedback JSON"}
        </Button>
      </div>
    </Card>
  );
}

export function DangerZoneSettingsCard() {
  const { signOut } = useClerk();
  const { toast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteAccountData() {
    setIsDeleting(true);
    try {
      await axios.delete("/api/settings/account", { withCredentials: true });
      await signOut({ redirectUrl: "/" });
    } catch {
      toast({ tone: "error", message: "Could not delete account data." });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Card title="A fresh start" icon={<AlertTriangle className="h-4 w-4" />}>
        <div className="text-sm text-zinc-600">
          Permanently remove all resumes, applications, and feedback. Export
          anything you want to keep before continuing.
        </div>
        <div className="mt-4">
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 className="h-4 w-4" />
            Delete workspace data
          </Button>
        </div>
      </Card>

      <Modal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setConfirmationText("");
        }}
        title="Delete your workspace data?"
        description="All resumes, applications, and feedback will be permanently removed. This cannot be undone."
        busy={isDeleting}
      >
        <label htmlFor="delete-confirmation" className="field-label">
          Type DELETE to confirm
        </label>
        <input
          id="delete-confirmation"
          className="field-input"
          autoComplete="off"
          value={confirmationText}
          disabled={isDeleting}
          onChange={(e) => setConfirmationText(e.target.value)}
        />
        <div className="form-footer">
          <Button
            variant="secondary"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setConfirmationText("");
            }}
            disabled={isDeleting}
          >
            Keep my workspace
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteAccountData}
            disabled={isDeleting || confirmationText !== "DELETE"}
          >
            {isDeleting ? "Deleting…" : "Delete all data"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
