import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Download,
  Filter,
  Lightbulb,
  Pencil,
  Search,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Resume } from "@/lib/mock-data";

export function ResumesHeader() {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm text-zinc-500">Resumes</div>
        <h1 className="text-xl font-semibold text-zinc-900">
          All resume versions
        </h1>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button>
          <Upload className="h-4 w-4" />
          Upload new
        </Button>
      </div>
    </div>
  );
}

export function ResumesTableSection({
  query,
  onQueryChange,
  rows,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  rows: Resume[];
}) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search versions, file name, target role..."
            className="w-full rounded-2xl border border-zinc-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-zinc-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" className="px-3">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="secondary" className="px-3">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200">
        <div className="grid grid-cols-[110px_1fr_120px_140px] gap-0 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-600">
          <div>Version</div>
          <div>File</div>
          <div>Score</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-zinc-200">
          {rows.map((resume) => (
            <div
              key={resume.id}
              className="grid grid-cols-[110px_1fr_120px_140px] items-center gap-0 px-4 py-3"
            >
              <div className="text-sm font-medium text-zinc-900">
                {resume.version}
                <div className="mt-0.5 text-xs text-zinc-500">
                  {resume.uploadedAt}
                </div>
              </div>

              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-zinc-900">
                  {resume.fileName}
                </div>
                <div className="truncate text-sm text-zinc-500">
                  Target: {resume.roleTarget ?? "Not set"}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  {resume.score}
                </div>
                <div className="text-xs text-zinc-500">ATS</div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/dashboard/resumes/${resume.id}`}
                  className="rounded-xl border border-zinc-200 bg-white p-2 hover:bg-zinc-50"
                  title="View feedback"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <button
                  className="rounded-xl border border-zinc-200 bg-white p-2 hover:bg-zinc-50"
                  title="Rename / edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  className="rounded-xl border border-zinc-200 bg-white p-2 hover:bg-zinc-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ResumeScoreGuideCard() {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-zinc-900">
        How the score works
      </div>
      <div className="mt-2 text-sm text-zinc-600">
        Your ATS score is computed from structure + clarity + role match. Upload
        a new version after edits to track improvement.
      </div>

      <div className="mt-4 space-y-3">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
            <CheckCircle2 className="h-4 w-4" />
            Structure
          </div>
          <div className="mt-1 text-sm text-zinc-600">
            One-column layout, consistent headings, ATS-friendly formatting.
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
            <Lightbulb className="h-4 w-4" />
            Impact
          </div>
          <div className="mt-1 text-sm text-zinc-600">
            Metrics, outcomes, scale, ownership.
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
            <Wand2 className="h-4 w-4" />
            Role match
          </div>
          <div className="mt-1 text-sm text-zinc-600">
            Keywords + phrasing aligned with the role you target.
          </div>
        </div>
      </div>
    </section>
  );
}
