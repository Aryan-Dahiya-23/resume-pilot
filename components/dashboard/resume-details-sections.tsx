import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  Save,
  Trash2,
  Wand2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import type { Resume, ResumeFeedback } from "@/lib/mock-data";

export function ResumeFeedbackHeader({ resume }: { resume: Resume }) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm text-zinc-500">Resume feedback</div>
        <h1 className="text-xl font-semibold text-zinc-900">{resume.fileName}</h1>
        <div className="mt-1 text-sm text-zinc-500">
          {resume.version} • Uploaded {resume.uploadedAt} • Target: {resume.roleTarget ?? "Not set"}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Link href="/dashboard/resumes">
          <Button variant="secondary">Back to resumes</Button>
        </Link>
        <Button>
          <Wand2 className="h-4 w-4" />
          Re-run review
        </Button>
      </div>
    </div>
  );
}

export function ResumeDetailsMain({ feedback }: { feedback: ResumeFeedback }) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-zinc-500">ATS score</div>
            <div className="mt-1 text-3xl font-semibold text-zinc-900">{feedback.score} / 100</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="success">Strong projects</Badge>
              <Badge variant="neutral">Needs metrics</Badge>
              <Badge variant="info">Good structure</Badge>
            </div>
          </div>
          <ProgressRing value={feedback.score} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
              <CheckCircle2 className="h-4 w-4" />
              Strengths
            </div>
            <ul className="mt-3 space-y-2">
              {feedback.summary.strengths.map((item) => (
                <li key={item} className="text-sm text-zinc-700">
                  • {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
              <AlertTriangle className="h-4 w-4" />
              Weaknesses
            </div>
            <ul className="mt-3 space-y-2">
              {feedback.summary.weaknesses.map((item) => (
                <li key={item} className="text-sm text-zinc-700">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-zinc-900">Missing keywords</div>
            <div className="text-sm text-zinc-500">Add these naturally into your experience + projects.</div>
          </div>
          <Button variant="secondary" className="px-3">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {feedback.missingKeywords.map((keyword) => (
            <Badge key={keyword} variant="neutral">
              {keyword}
            </Badge>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-zinc-900">Bullet rewrites (high impact)</div>
        <div className="mt-1 text-sm text-zinc-500">Replace weak bullets with measurable, role-aligned ones.</div>

        <div className="mt-4 space-y-4">
          {feedback.rewriteSuggestions.map((suggestion, index) => (
            <div key={index} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-xs font-medium text-zinc-500">BEFORE</div>
              <div className="mt-1 text-sm text-zinc-800">{suggestion.before}</div>

              <div className="mt-3 text-xs font-medium text-zinc-500">AFTER</div>
              <div className="mt-1 text-sm font-medium text-zinc-900">{suggestion.after}</div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="text-sm text-zinc-600">{suggestion.why}</div>
                <Button variant="secondary" className="px-3">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-zinc-900">ATS checks</div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {feedback.atsChecks.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-3"
            >
              <div className="text-sm font-medium text-zinc-900">{item.label}</div>
              {item.ok ? <Badge variant="success">OK</Badge> : <Badge variant="danger">Fix</Badge>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ResumeDetailsSidebar({ feedback }: { feedback: ResumeFeedback }) {
  return (
    <aside className="space-y-6">
      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-zinc-900">Target role</div>
        <div className="mt-2 text-sm text-zinc-600">Selecting a role makes keyword + feedback more accurate.</div>

        <div className="mt-4 space-y-2">
          <label className="text-xs font-medium text-zinc-600">Role</label>
          <select className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400">
            <option>Frontend Engineer</option>
            <option>Backend Engineer (Go)</option>
            <option>Fullstack Engineer</option>
            <option>Solana / Rust Developer</option>
          </select>

          <label className="mt-3 block text-xs font-medium text-zinc-600">Level</label>
          <select className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400">
            <option>Internship</option>
            <option>0–1 years</option>
            <option>1–3 years</option>
          </select>
        </div>

        <div className="mt-4">
          <Button variant="secondary" className="w-full">
            <Save className="h-4 w-4" />
            Save target
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-zinc-900">Recommended next actions</div>
        <div className="mt-3 space-y-2">
          {feedback.nextActions.map((item) => (
            <div key={item} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="text-sm font-medium text-zinc-900">Resume file</div>
        <div className="mt-2 text-sm text-zinc-600">Stored securely. You can download anytime.</div>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" className="w-full">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button variant="secondary" className="w-full">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </section>
    </aside>
  );
}
