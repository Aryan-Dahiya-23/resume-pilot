"use client";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useClerk } from "@clerk/nextjs";
import {
  AlertTriangle,
  Database,
  Download,
  FileSpreadsheet,
  Loader2,
  Lock,
  Save,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/providers/toast-provider";
import { useCurrentDbUser } from "@/hooks/queries";
import { queryKeys } from "@/lib/react-query/query-keys";

export function SettingsHeader() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Preferences & Governance
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Account & Data Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal profile, export your career data, or configure workspace retention.
        </p>
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
      toast({ tone: "success", message: "Profile updated successfully." });
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
    <Card className="rounded-3xl border-slate-200/90 shadow-xs">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="size-4 text-indigo-600" />
          <CardTitle className="text-base">Profile Information</CardTitle>
        </div>
        <CardDescription>
          Display name used in workspace headers and review summaries.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Full Name
            </label>
            <Input
              value={value}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Email Address
            </label>
            <Input
              value={currentUser?.email ?? ""}
              readOnly
              className="mt-1 bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Managed through your authentication provider.
            </span>
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
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
      toast({ tone: "success", message: "Jobs exported successfully." });
    } catch {
      toast({ tone: "error", message: "Failed to export jobs." });
    } finally {
      setIsExportingJobs(false);
    }
  }

  async function handleExportFeedback() {
    setIsExportingFeedback(true);
    try {
      await downloadFile(
        "/api/settings/export/feedback",
        `feedback-${new Date().toISOString().slice(0, 10)}.json`,
      );
      toast({ tone: "success", message: "Feedback exported successfully." });
    } catch {
      toast({ tone: "error", message: "Failed to export feedback." });
    } finally {
      setIsExportingFeedback(false);
    }
  }

  return (
    <Card className="rounded-3xl border-slate-200/90 shadow-xs">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="size-4 text-indigo-600" />
          <CardTitle className="text-base">Data Export & Portability</CardTitle>
        </div>
        <CardDescription>
          Download your full records anytime in standard open formats.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white shadow-2xs text-indigo-600">
              <FileSpreadsheet className="size-4.5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Application Pipeline (.CSV)
              </div>
              <div className="text-xs text-slate-500">
                Includes all job statuses, companies, roles, and interview rounds.
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportJobs}
            disabled={isExportingJobs}
          >
            <Download className="size-3.5" />
            {isExportingJobs ? "Exporting..." : "Export CSV"}
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white shadow-2xs text-indigo-600">
              <Database className="size-4.5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">
                AI Audit History (.JSON)
              </div>
              <div className="text-xs text-slate-500">
                Complete raw DeepSeek scoring reports, ATS checks, and rewrite history.
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportFeedback}
            disabled={isExportingFeedback}
          >
            <Download className="size-3.5" />
            {isExportingFeedback ? "Exporting..." : "Export JSON"}
          </Button>
        </div>
      </CardContent>
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
      <Card className="rounded-3xl border-rose-200/80 bg-rose-50/30 shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="size-4" />
            <CardTitle className="text-base text-rose-900">Danger Zone</CardTitle>
          </div>
          <CardDescription className="text-rose-700/80">
            Irreversible account actions and data purging.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-rose-700 leading-relaxed">
            Deleting your account data permanently removes all uploaded resumes, extracted text, AI audit history, and application pipeline jobs.
          </p>
          <div className="mt-4">
            <Button variant="danger" size="sm" onClick={() => setIsDeleteModalOpen(true)}>
              <Trash2 className="size-3.5" />
              Purge Account Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-900">Purge Account Data?</DialogTitle>
            <DialogDescription>
              This action cannot be reversed. To confirm, type{" "}
              <span className="font-bold text-slate-900 font-mono">DELETE</span> below.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            <Input
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE to confirm"
            />
          </div>
          <DialogFooter className="mt-4">
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
              {isDeleting ? "Purging..." : "Confirm Purge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
