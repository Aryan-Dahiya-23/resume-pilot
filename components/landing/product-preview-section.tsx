import Link from "next/link";
import { ArrowRight, Calendar, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductPreviewSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
            <Sparkles className="h-4 w-4" />
            Resume review preview
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-xs text-zinc-500">Current score</div>
              <div className="mt-1 text-2xl font-semibold text-zinc-900">81</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-xs text-zinc-500">Last score</div>
              <div className="mt-1 text-2xl font-semibold text-zinc-900">72</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-xs text-zinc-500">Delta</div>
              <div className="mt-1 text-2xl font-semibold text-emerald-700">+9</div>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            Top suggestion: Add measurable impact to 2 experience bullets and include role-specific keywords.
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
            <FileText className="h-4 w-4" />
            Job pipeline preview
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm">
              <span className="font-medium text-zinc-900">Frontend Engineer · Stripe</span>
              <span className="rounded-full bg-white px-2 py-1 text-xs">Interview</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm">
              <span className="font-medium text-zinc-900">SWE · Notion</span>
              <span className="rounded-full bg-white px-2 py-1 text-xs">Applied</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm">
              <span className="font-medium text-zinc-900">Backend · Ramp</span>
              <span className="rounded-full bg-white px-2 py-1 text-xs">Saved</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Weekly target: 10 applications
            </span>
            <span className="font-medium text-zinc-900">6 / 10</span>
          </div>
          <div className="mt-4">
            <Link href="/sign-in">
              <Button>
                Try dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
