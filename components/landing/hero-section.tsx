"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileCheck2,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn } from "@/lib/utils";

const SAMPLE_PROFILES = [
  {
    id: "backend",
    role: "Staff Backend Engineer",
    fileName: "Staff_Backend_Platform.pdf",
    score: 92,
    percentile: "Top 4% of applicants",
    delta: "+16 pts",
    original: "Responsible for backend APIs and making database queries faster.",
    optimizedAction: "Architected distributed Redis cluster and partitioned PostgreSQL schemas",
    optimizedMetric: "slashing p99 query latency from 820ms to 48ms under 45k QPS.",
    missingKeywords: ["Distributed Systems", "Kafka", "PostgreSQL Sharding", "gRPC"],
    pipeline: "18 Applied • 5 Interviews • 28% Callback",
  },
  {
    id: "frontend",
    role: "Senior Frontend Architect",
    fileName: "Senior_Frontend_Architect.pdf",
    score: 88,
    percentile: "Top 7% of applicants",
    delta: "+12 pts",
    original: "Worked on React app components and improved our page load speeds.",
    optimizedAction: "Re-engineered core React rendering pipeline with code splitting and edge CDN hydration",
    optimizedMetric: "reducing Largest Contentful Paint (LCP) by 54% across 1.4M active users.",
    missingKeywords: ["Next.js App Router", "Web Vitals", "Turbopack", "Design Systems"],
    pipeline: "14 Applied • 4 Interviews • 29% Callback",
  },
];

export function HeroSection({ isSignedIn = false }: { isSignedIn?: boolean }) {
  const [activeProfileId, setActiveProfileId] = useState<"backend" | "frontend">("backend");
  const profile = SAMPLE_PROFILES.find((p) => p.id === activeProfileId) ?? SAMPLE_PROFILES[0];

  return (
    <section className="relative overflow-hidden dot-pattern py-12 sm:py-20 lg:py-24 border-b border-slate-200/70">
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-emerald-500/8 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left Column: Authoritative Editorial Copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Resume Intelligence & ATS Optimization</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.08]">
              Engineered for ATS. <br />
              <span className="text-slate-400 font-bold">Built for senior hiring teams.</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm sm:text-base text-slate-600 leading-relaxed">
              Applicant tracking filters reject over 70% of resumes before human review. ResumePilot audits your document against modern enterprise filters, sharpens bullet points with quantifiable impact, and organizes your full opportunity pipeline.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button size="lg" asChild className="shadow-sm shadow-emerald-600/20 w-full sm:w-auto">
                <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                  {isSignedIn ? "Go to Dashboard" : "Audit Your Resume Free"}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto">
                <Link href={isSignedIn ? "/dashboard/resumes" : "/sign-in"}>
                  {isSignedIn ? "Upload Document" : "Sign In to Workspace"}
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Zero Hallucination Scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span>Strict Privacy: No Public Training</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-teal-600 shrink-0" />
                <span>Full Application CRM Included</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live ATS Inspector */}
          <div className="relative w-full">
            {/* Soft border ring */}
            <div className="relative rounded-3xl border border-slate-200/90 bg-white/95 p-5 sm:p-7 shadow-xl backdrop-blur-md card-elevation">
              {/* Profile Switcher Pills */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                  {SAMPLE_PROFILES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveProfileId(p.id as "backend" | "frontend")}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                        activeProfileId === p.id
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-500 hover:text-slate-800",
                      )}
                    >
                      {p.id === "backend" ? "Backend Eng" : "Frontend Arch"}
                    </button>
                  ))}
                </div>

                <Badge variant="success" withDot>
                  {profile.delta} vs baseline
                </Badge>
              </div>

              {/* Document Meta */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                    <FileCheck2 className="size-4" />
                  </span>
                  <span className="truncate text-xs sm:text-sm font-bold text-slate-900">
                    {profile.fileName}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium shrink-0">
                  Target: {profile.role}
                </span>
              </div>

              {/* ATS Scorecard Bar */}
              <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    ATS Readiness Rating
                  </div>
                  <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                    {profile.score} <span className="text-sm font-normal text-slate-400">/ 100</span>
                  </div>
                  <div className="text-xs text-emerald-700 font-medium mt-0.5">
                    {profile.percentile}
                  </div>
                </div>
                <ProgressRing value={profile.score} size={80} strokeWidth={8} />
              </div>

              {/* Editorial Diff Studio Preview */}
              <div className="mt-4 space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Zap className="size-3.5 text-emerald-600" />
                  <span>High-Impact Bullet Transformation</span>
                </div>

                {/* Original Weak Bullet */}
                <div className="rounded-xl border border-rose-100 bg-rose-50/35 p-3 text-xs leading-relaxed text-slate-600">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold tracking-wider text-rose-700 uppercase">
                      Before (Low ATS Impact)
                    </span>
                  </div>
                  <p className="line-through decoration-rose-300 text-slate-500">
                    &quot;{profile.original}&quot;
                  </p>
                </div>

                {/* Optimized Strong Bullet */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-xs leading-relaxed text-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase">
                      After (Quantified Metric Alignment)
                    </span>
                  </div>
                  <p>
                    &quot;<span className="diff-strong">{profile.optimizedAction}</span>,{" "}
                    <span className="diff-strong">{profile.optimizedMetric}</span>&quot;
                  </p>
                </div>
              </div>

              {/* Missing High-Value Keywords */}
              <div className="mt-4 border-t border-slate-100 pt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">
                  Key Skills Injected:
                </span>
                {profile.missingKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 border border-slate-200/60"
                  >
                    + {kw}
                  </span>
                ))}
              </div>

              {/* Pipeline conversion telemetry */}
              <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-emerald-600 shrink-0" />
                  <span>{profile.pipeline}</span>
                </div>
                <span className="font-bold text-emerald-700">Interview Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
