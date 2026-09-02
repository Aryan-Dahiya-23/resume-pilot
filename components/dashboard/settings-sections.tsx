"use client";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useClerk } from "@clerk/nextjs";
import { AlertTriangle, Download, Loader2, Save, Trash2, UserRound } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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

const fieldClassName =
  "mt-2 h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15";
const labelClassName =
  "text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase";

export function SettingsHeader() {
  return (
    <header>
      <div className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
        Preferences
      </div>
      <h1 className="text-4xl leading-[0.98] font-semibold tracking-[-0.045em] text-foreground sm:text-5xl">
        Account and data.
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
        Update your identity, keep a copy of your work, and manage the account.
      </p>
    </header>
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
      await axios.patch("/api/settings/profile", { name: value }, { withCredentials: true });
      await queryClient.invalidateQueries({ queryKey: queryKeys.user.current() });
      toast({ tone: "success", message: "Profile updated." });
    } catch (error) {
      toast({
        tone: "error",
        message:
          axios.isAxiosError(error) &&
          (error.response?.data as { error?: string } | undefined)?.error
            ? (error.response?.data as { error: string }).error
            : "Could not update your profile.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <UserRound className="mt-0.5 size-5 text-brand" />
        <div>
          <div className="text-[11px] font-semibold tracking-[0.1em] text-brand uppercase">
            Profile
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground">
            Your identity.
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            This name appears across your workspace and account controls.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4">
        <label className={labelClassName}>
          Name
          <input value={value} onChange={(event) => setName(event.target.value)} className={fieldClassName} />
        </label>
        <label className={labelClassName}>
          Email
          <input
            value={currentUser?.email ?? ""}
            readOnly
            className={`${fieldClassName} cursor-not-allowed bg-muted/45 text-muted-foreground focus:border-input focus:ring-0`}
          />
        </label>
      </div>
      <Button className="mt-5" onClick={handleSave} disabled={isSaving}>
        {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        {isSaving ? "Saving…" : "Save changes"}
      </Button>
    </section>
  );
}

export function DataSettingsCard() {
  const { toast } = useToast();
  const [isExportingJobs, setIsExportingJobs] = useState(false);
  const [isExportingFeedback, setIsExportingFeedback] = useState(false);

  async function downloadFile(url: string, fileName: string) {
    const response = await axios.get(url, { withCredentials: true, responseType: "blob" });
    const blobUrl = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  }

  async function handleExport(kind: "jobs" | "feedback") {
    const setPending = kind === "jobs" ? setIsExportingJobs : setIsExportingFeedback;
    setPending(true);
    try {
      await downloadFile(
        kind === "jobs" ? "/api/settings/export/jobs" : "/api/settings/export/resume-feedback",
        `${kind === "jobs" ? "jobs" : "resume-feedback"}-${new Date().toISOString().slice(0, 10)}.${kind === "jobs" ? "csv" : "json"}`,
      );
      toast({ tone: "success", message: `${kind === "jobs" ? "Jobs" : "Feedback"} exported.` });
    } catch {
      toast({ tone: "error", message: `Could not export ${kind === "jobs" ? "jobs" : "feedback"}.` });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <Download className="mt-0.5 size-5 text-brand" />
        <div>
          <div className="text-[11px] font-semibold tracking-[0.1em] text-brand uppercase">
            Your data
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground">
            Keep a copy.
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Export the two records that matter: your job pipeline and review feedback.
          </p>
        </div>
      </div>
      <div className="mt-6 divide-y divide-border border-y border-border">
        <ExportRow
          title="Job pipeline"
          copy="A CSV that works in spreadsheets and other trackers."
          label={isExportingJobs ? "Preparing…" : "Export CSV"}
          pending={isExportingJobs}
          onClick={() => handleExport("jobs")}
        />
        <ExportRow
          title="Resume feedback"
          copy="A JSON archive of every review and recommendation."
          label={isExportingFeedback ? "Preparing…" : "Export JSON"}
          pending={isExportingFeedback}
          onClick={() => handleExport("feedback")}
        />
      </div>
    </section>
  );
}

function ExportRow({
  title,
  copy,
  label,
  pending,
  onClick,
}: {
  title: string;
  copy: string;
  label: string;
  pending: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{copy}</div>
      </div>
      <Button variant="secondary" size="sm" onClick={onClick} disabled={pending}>
        {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
        {label}
      </Button>
    </div>
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
      <section className="surface-card border-l-2 border-l-destructive p-5 sm:p-6 xl:col-span-2">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 size-5 text-destructive" />
          <div>
            <div className="text-[11px] font-semibold tracking-[0.1em] text-destructive uppercase">
              Danger zone
            </div>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground">
              Delete account data.
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
              This permanently removes your resumes, jobs, and review feedback.
            </p>
          </div>
        </div>
        <Button variant="ghost" className="mt-5 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setIsDeleteModalOpen(true)}>
          <Trash2 className="size-4" />
          Delete account data
        </Button>
      </section>

      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isDeleting) {
            setIsDeleteModalOpen(false);
            setConfirmationText("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={!isDeleting}>
          <DialogHeader>
            <DialogTitle>Delete account data?</DialogTitle>
            <DialogDescription>
              This cannot be undone. Type DELETE to confirm the removal of all workspace data.
            </DialogDescription>
          </DialogHeader>
          <input
            value={confirmationText}
            onChange={(event) => setConfirmationText(event.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/15"
            placeholder="DELETE"
            aria-label="Type DELETE to confirm"
          />
          <DialogFooter>
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
              {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              {isDeleting ? "Deleting…" : "Delete account data"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
