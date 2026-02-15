import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, FileText, Shield, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/landing/pill";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill>ATS-style scoring</Pill>
            <Pill>Bullet rewrites</Pill>
            <Pill>Job pipeline</Pill>
            <Pill>Resume versions</Pill>
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Improve your resume.
            <br />
            Track your job hunt.
            <br />
            Stay consistent.
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
            A simple dashboard that reviews your resume with AI and helps you track job applications like a pipeline
            no spreadsheets, no chaos.
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link href="/sign-in">
              <Button className="px-5 py-2.5">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" className="px-5 py-2.5">
                View demo
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-2 text-sm text-zinc-600 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Upload PDF and get feedback in seconds
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Your resume stays private
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-zinc-500">Latest resume</div>
              <div className="mt-1 text-lg font-semibold text-zinc-900">v3 — 78 ATS</div>
              <div className="mt-1 text-sm text-zinc-600">+7 from last version</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
              <div className="text-xs text-zinc-500">Jobs tracked</div>
              <div className="mt-1 text-2xl font-semibold text-zinc-900">18</div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                <Wand2 className="h-4 w-4" />
                Top improvement
              </div>
              <div className="mt-2 text-sm text-zinc-700">Rewrite experience bullets with measurable impact.</div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                <BarChart3 className="h-4 w-4" />
                Pipeline
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm">Applied: 9</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm">Interview: 3</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm">Offer: 1</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                <FileText className="h-4 w-4" />
                Resume versions
              </div>
              <div className="mt-2 text-sm text-zinc-700">Track your improvement from v1 → v2 → v3.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
