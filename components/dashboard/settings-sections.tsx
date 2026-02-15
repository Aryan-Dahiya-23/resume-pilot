"use client";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useClerk } from "@clerk/nextjs";
import { AlertTriangle, Download, Loader2, Save, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/providers/toast-provider";
import { useCurrentDbUser } from "@/hooks/queries";
import { queryKeys } from "@/lib/react-query/query-keys";

export function SettingsHeader() {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm text-zinc-500">Settings</div>
        <h1 className="text-xl font-semibold text-zinc-900">Account & data</h1>
      </div>
    </div>
  );
}

export function ProfileSettingsCard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: currentUser } = useCurrentDbUser();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const value = name || currentUser?.name || "";

  async function handleSave() {
    setIsSaving(true);
    try {
      await axios.patch(
        "/api/settings/profile",
        { name: value },
        { withCredentials: true },
      );
      await queryClient.invalidateQueries({ queryKey: queryKeys.user.current() });
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
    <Card title="Profile" icon={<Settings className="h-4 w-4" />}>
      <div className="text-sm text-zinc-600">
        Update your profile details used across dashboard widgets.
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3">
        <div>
          <div className="text-xs font-medium text-zinc-600">Name</div>
          <input
            value={value}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
        </div>
        <div>
          <div className="text-xs font-medium text-zinc-600">Email</div>
          <input
            value={currentUser?.email ?? ""}
            readOnly
            className="mt-1 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 outline-none"
          />
        </div>
      </div>
      <div className="mt-4">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
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
    <Card title="Data" icon={<Download className="h-4 w-4" />}>
      <div className="text-sm text-zinc-600">
        Export your jobs and resume feedback for backups or offline analysis.
      </div>
      <div className="mt-4 flex gap-2">
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
      <Card title="Danger zone" icon={<AlertTriangle className="h-4 w-4" />}>
        <div className="text-sm text-zinc-600">
          Deleting account data will remove resumes, jobs, and feedback from your workspace.
        </div>
        <div className="mt-4">
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 className="h-4 w-4" />
            Delete account data
          </Button>
        </div>
      </Card>

      {isDeleteModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl">
            <div className="text-base font-semibold text-zinc-900">
              Delete account data?
            </div>
            <div className="mt-2 text-sm text-zinc-600">
              Type <span className="font-medium text-zinc-900">DELETE</span> to confirm.
            </div>
            <input
              value={confirmationText}
              onChange={(event) => setConfirmationText(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setConfirmationText("");
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteAccountData}
                disabled={isDeleting || confirmationText !== "DELETE"}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isDeleting ? "Deleting..." : "Confirm delete"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

    </>
  );
}
