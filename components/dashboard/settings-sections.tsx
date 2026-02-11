"use client";

import { AlertTriangle, Download, Save, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCurrentDbUser } from "@/hooks/queries";

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
  const { data: currentUser } = useCurrentDbUser();

  return (
    <Card title="Profile" icon={<Settings className="h-4 w-4" />}>
      <div className="text-sm text-zinc-600">Basic settings. In a real app, you’ll show email, connected provider, etc.</div>
      <div className="mt-4 grid grid-cols-1 gap-3">
        <div>
          <div className="text-xs font-medium text-zinc-600">Name</div>
          <input
            value={currentUser?.name ?? ""}
            readOnly
            className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
        </div>
        <div>
          <div className="text-xs font-medium text-zinc-600">Email</div>
          <input
            value={currentUser?.email ?? ""}
            readOnly
            className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
        </div>
      </div>
      <div className="mt-4">
        <Button>
          <Save className="h-4 w-4" />
          Save changes
        </Button>
      </div>
    </Card>
  );
}

export function DataSettingsCard() {
  return (
    <Card title="Data" icon={<Download className="h-4 w-4" />}>
      <div className="text-sm text-zinc-600">
        Export your jobs and resume feedback. Useful if you want to move back to spreadsheets.
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="secondary" className="w-full">
          <Download className="h-4 w-4" />
          Export jobs CSV
        </Button>
        <Button variant="secondary" className="w-full">
          <Download className="h-4 w-4" />
          Export feedback JSON
        </Button>
      </div>
    </Card>
  );
}

export function DangerZoneSettingsCard() {
  return (
    <Card title="Danger zone" icon={<AlertTriangle className="h-4 w-4" />}>
      <div className="text-sm text-zinc-600">Deleting your account will remove resumes, jobs, and feedback.</div>
      <div className="mt-4">
        <Button variant="danger">
          <Trash2 className="h-4 w-4" />
          Delete account
        </Button>
      </div>
    </Card>
  );
}
