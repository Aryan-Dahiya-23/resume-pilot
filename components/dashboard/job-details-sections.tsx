import Link from "next/link";
import { Calendar, Copy, ExternalLink, Pencil, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusVariant, type Job, type JobDetail } from "@/lib/mock-data";

export function JobDetailsHeader({ job }: { job: Job }) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm text-zinc-500">Job details</div>
        <h1 className="text-xl font-semibold text-zinc-900">
          {job.company} — {job.role}
        </h1>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <Badge variant={statusVariant(job.status)}>{job.status}</Badge>
          <span>•</span>
          <span>{job.location ?? "—"}</span>
          <span>•</span>
          <span>{job.when}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link href="/dashboard/jobs">
          <Button variant="secondary">Back to jobs</Button>
        </Link>
        {job.link ? (
          <a href={job.link} target="_blank" rel="noreferrer">
            <Button variant="secondary">
              <ExternalLink className="h-4 w-4" />
              Open listing
            </Button>
          </a>
        ) : null}
        <Button>
          <Pencil className="h-4 w-4" />
          Edit job
        </Button>
      </div>
    </div>
  );
}

export function JobDetailsMain({ details }: { details: JobDetail }) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-zinc-900">Notes</div>
        <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
          {details.notes || "No notes yet."}
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="secondary" className="px-3">
            <Pencil className="h-4 w-4" />
            Edit notes
          </Button>
          <Button variant="secondary" className="px-3">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-zinc-900">Interview rounds</div>
        <div className="mt-3 space-y-2">
          {details.rounds?.length ? (
            details.rounds.map((round) => (
              <div
                key={round.name}
                className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-3"
              >
                <div className="text-sm font-medium text-zinc-900">{round.name}</div>
                <Badge variant={round.status === "Done" ? "success" : round.status === "Upcoming" ? "info" : "neutral"}>
                  {round.status}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-sm text-zinc-600">No rounds added.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export function JobDetailsSidebar({ details }: { details: JobDetail }) {
  return (
    <aside className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-zinc-900">Status</div>
        <div className="mt-3">
          <select className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400">
            <option>Saved</option>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>
        <div className="mt-3">
          <Button className="w-full">
            <Save className="h-4 w-4" />
            Update status
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-zinc-900">Follow-up</div>
        <div className="mt-2 text-sm text-zinc-600">Set a reminder so you don’t lose momentum.</div>
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
          {details.followUp || "Not set"}
        </div>
        <div className="mt-3">
          <Button variant="secondary" className="w-full">
            <Calendar className="h-4 w-4" />
            Set follow-up
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-zinc-900">Contact</div>
        <div className="mt-3 space-y-2 text-sm text-zinc-700">
          <div>
            <div className="text-xs text-zinc-500">Name</div>
            <div className="font-medium text-zinc-900">{details.contact?.name || "—"}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">Email</div>
            <div className="font-medium text-zinc-900">{details.contact?.email || "—"}</div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-zinc-900">Danger zone</div>
        <div className="mt-3">
          <Button variant="danger" className="w-full">
            <Trash2 className="h-4 w-4" />
            Delete job
          </Button>
        </div>
      </section>
    </aside>
  );
}
