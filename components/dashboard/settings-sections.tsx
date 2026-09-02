"use client";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useClerk } from "@clerk/nextjs";
import { AlertTriangle, Download, Loader2, Save, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SectionCard } from "@/components/layout/section-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/providers/toast-provider";
import { useCurrentDbUser } from "@/hooks/queries";
import { queryKeys } from "@/lib/react-query/query-keys";

export function SettingsHeader() {
  return (
    <PageHeader
      kicker="Settings"
      title="Account & data"
      description="Update your profile and export or delete workspace data."
    />
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
    <SectionCard title="Profile" icon={<Settings className="h-4 w-4" />}>
      <div className="text-sm text-muted-foreground">
        Update your profile details used across dashboard widgets.
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="profile-name">Name</Label>
          <Input
            id="profile-name"
            value={value}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="profile-email">Email</Label>
          <Input id="profile-email" value={currentUser?.email ?? ""} readOnly />
        </div>
      </div>
      <div className="mt-4">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </SectionCard>
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
    <SectionCard title="Data" icon={<Download className="h-4 w-4" />}>
      <div className="text-sm text-muted-foreground">
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
    </SectionCard>
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
      <SectionCard title="Danger zone" icon={<AlertTriangle className="h-4 w-4" />}>
        <div className="text-sm text-muted-foreground">
          Deleting account data will remove resumes, jobs, and feedback from your workspace.
        </div>
        <div className="mt-4">
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 className="h-4 w-4" />
            Delete account data
          </Button>
        </div>
      </SectionCard>

      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) setConfirmationText("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account data?</DialogTitle>
            <DialogDescription>
              Type <span className="font-medium text-foreground">DELETE</span> to confirm.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={confirmationText}
            onChange={(event) => setConfirmationText(event.target.value)}
            placeholder="DELETE"
          />
          <DialogFooter>
            <Button
              variant="outline"
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
