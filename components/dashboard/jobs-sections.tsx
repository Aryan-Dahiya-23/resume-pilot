import Link from "next/link";
import { Download, Filter, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statusVariant, type Job, type JobStatus } from "@/lib/mock-data";

export function JobsHeader() {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm text-zinc-500">Jobs</div>
        <h1 className="text-xl font-semibold text-zinc-900">Job application tracker</h1>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button>
          <Plus className="h-4 w-4" />
          Add job
        </Button>
        <Button variant="secondary">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}

export function JobsTableSection({
  query,
  onQueryChange,
  status,
  onStatusChange,
  rows,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  status: JobStatus | "All";
  onStatusChange: (value: JobStatus | "All") => void;
  rows: Job[];
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[360px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search company, role, location..."
              className="w-full rounded-2xl border border-zinc-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-zinc-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">Status</span>
            <select
              value={status}
              onChange={(event) => onStatusChange(event.target.value as JobStatus | "All")}
              className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
            >
              <option>All</option>
              <option>Saved</option>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" className="px-3">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200">
        <div className="grid grid-cols-[1.2fr_1.4fr_160px_140px_80px] bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-600">
          <div>Company</div>
          <div>Role</div>
          <div>Status</div>
          <div>Date</div>
          <div className="text-right">...</div>
        </div>
        <div className="divide-y divide-zinc-200">
          {rows.map((job) => (
            <div key={job.id} className="grid grid-cols-[1.2fr_1.4fr_160px_140px_80px] items-center px-4 py-3">
              <Link href={`/dashboard/jobs/${job.id}`} className="truncate text-left text-sm font-medium text-zinc-900 hover:underline">
                {job.company}
              </Link>
              <div className="truncate text-sm text-zinc-700">{job.role}</div>
              <div>
                <Badge variant={statusVariant(job.status)}>{job.status}</Badge>
              </div>
              <div className="text-sm text-zinc-600">{job.when}</div>
              <div className="flex items-center justify-end gap-2">
                <button className="rounded-xl border border-zinc-200 bg-white p-2 hover:bg-zinc-50" title="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button className="rounded-xl border border-zinc-200 bg-white p-2 hover:bg-zinc-50" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-sm text-zinc-600">Pro tip: treat your job hunt like a pipeline. Track status changes.</div>
    </section>
  );
}
