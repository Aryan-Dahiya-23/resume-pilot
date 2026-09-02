import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileCheck2,
  Shield,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill } from "@/components/landing/pill";
import { ProgressRing } from "@/components/ui/progress-ring";

export function HeroSection({ isSignedIn = false }: { isSignedIn?: boolean }) {
  return (
    <section className="relative overflow-hidden hero-mesh py-12 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left Column: Copy & CTAs */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Pill>AI Resume Audit v2.0</Pill>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-2xs">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Neural AI Powered
              </span>
            </div>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]">
              Precision Resume Intelligence.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                Accelerated Career Velocity.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm sm:text-base text-slate-600 leading-relaxed">
              Audit your resume against modern corporate applicant tracking systems, optimize bullet points with quantifiable metrics, and manage every opportunity in a unified pipeline.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button size="lg" asChild className="shadow-md shadow-emerald-600/25 w-full sm:w-auto">
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

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Instant 30-Second AI Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-teal-600 shrink-0" />
                <span>Strict Privacy: No Model Training</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Hero Mockup Card */}
          <div className="relative w-full overflow-hidden sm:overflow-visible">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 opacity-20 blur-xl" />

            <div className="relative rounded-3xl border border-slate-200/90 bg-white/95 p-5 sm:p-7 shadow-xl backdrop-blur-md">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4 sm:pb-5">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                      <FileCheck2 className="size-4" />
                    </span>
                    <span className="truncate text-xs sm:text-sm font-bold text-slate-900">
                      Senior_Frontend_Resume.pdf
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Version 3 • Target: Senior Frontend Engineer
                  </div>
                </div>

                <Badge variant="success" withDot>
                  +12 pts vs v2
                </Badge>
              </div>

              {/* Scorecard Hero Strip */}
              <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div>
                  <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    ATS Readiness Rating
                  </div>
                  <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                    84 <span className="text-sm sm:text-base font-normal text-slate-400">/ 100</span>
                  </div>
                  <div className="text-xs text-emerald-700 font-medium mt-0.5">
                    Top 8% of candidate resumes
                  </div>
                </div>
                <ProgressRing value={84} size={85} strokeWidth={8} />
              </div>

              {/* Bullet Rewrite Preview */}
              <div className="mt-5 space-y-2.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Wand2 className="size-3.5 text-emerald-600" />
                  <span>Neural Resume Optimization</span>
                </div>

                <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-2.5 text-xs text-slate-600 font-mono">
                  <span className="font-bold text-rose-700 block text-[10px]">ORIGINAL</span>
                  &quot;Responsible for frontend updates and making pages faster.&quot;
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-2.5 text-xs text-slate-800 font-mono">
                  <span className="font-bold text-emerald-700 block text-[10px]">AI OPTIMIZED</span>
                  &quot;Architected modular React micro-frontends, reducing LCP by 42% across 1.2M monthly users.&quot;
                </div>
              </div>

              {/* Mini Pipeline Indicator */}
              <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <BarChart3 className="size-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Pipeline: 14 Applications • 4 Interviews</span>
                </div>
                <span className="font-bold text-emerald-700 shrink-0">28% Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
