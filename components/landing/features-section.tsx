import {
  Briefcase,
  CheckCircle2,
  FileCheck2,
  Layers,
  Sparkles,
  Target,
  TrendingUp,
  Wand2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <span>Engineered For Career Growth</span>
        </div>
        <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Everything You Need to Command Recruiter Attention
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          Over 70% of resumes are dropped by automated parsers before a human hiring manager ever looks. ResumePilot ensures your accomplishments are quantified, keyword-rich, and organized.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Bento Tile 1: 4-Pillar ATS Engine (Span 2 on lg) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs card-elevation flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <FileCheck2 className="size-5" />
              </div>
              <Badge variant="success" withDot>
                Enterprise ATS Calibrated
              </Badge>
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Multi-Dimensional ATS Parser Audit
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl">
              Emulates filtering rules across Workday, Greenhouse, and Lever. Pinpoints structural parsing hurdles, missing section headers, and unreadable table layouts.
            </p>

            {/* 4-Pillar Progress Breakdown */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Quantifiable Impact & ROI</span>
                  <span className="text-emerald-700 tabular-nums">94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Keyword & Competency Density</span>
                  <span className="text-emerald-700 tabular-nums">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Column Parsing Safety</span>
                  <span className="text-emerald-700 tabular-nums">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Recruiter Scanning Cadence</span>
                  <span className="text-emerald-700 tabular-nums">91%</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400 font-medium">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Tested against 450+ standard software engineering job templates</span>
          </div>
        </div>

        {/* Bento Tile 2: Action-Verb Diff Studio */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs card-elevation flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Wand2 className="size-5" />
              </div>
              <Badge variant="brand">Word-Level Diffs</Badge>
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Action-Verb Transformations
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Turns passive job responsibilities into outcome-driven accomplishments that demonstrate tangible business value.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-3 text-xs text-slate-600">
                <span className="font-bold text-rose-700 text-[10px] block mb-1">PASSIVE PHRASING:</span>
                &quot;Assisted in improving web performance.&quot;
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-xs text-slate-900">
                <span className="font-bold text-emerald-700 text-[10px] block mb-1">MEASURABLE REWRITE:</span>
                &quot;Optimized bundle splitting and assets, cutting LCP by 42% across 800k monthly visits.&quot;
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-xs text-slate-400 font-medium">
            Includes instant clipboard copy and rationales.
          </div>
        </div>

        {/* Bento Tile 3: Role Keyword Ingestion */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs card-elevation flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                <Target className="size-5" />
              </div>
              <Badge variant="neutral">Seniority Aware</Badge>
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Role Keyword Matcher
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Dynamically benchmarks your resume against senior and staff engineering skill expectations.
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {[
                { name: "Distributed Systems", matched: true },
                { name: "PostgreSQL Partitioning", matched: true },
                { name: "Zero-Downtime Deploys", matched: true },
                { name: "gRPC & Protocol Buffers", matched: false },
                { name: "Kubernetes Orchestration", matched: false },
              ].map((skill) => (
                <span
                  key={skill.name}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium border ${
                    skill.matched
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200/70"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <span className={`size-1.5 rounded-full ${skill.matched ? "bg-emerald-500" : "bg-slate-400"}`} />
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-xs text-slate-400 font-medium">
            Automatically surfaces missing skills for target roles.
          </div>
        </div>

        {/* Bento Tile 4: Unified Opportunity Pipeline (Span 2 on lg) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs card-elevation flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Briefcase className="size-5" />
              </div>
              <Badge variant="brand">Integrated CRM</Badge>
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Unified Opportunity CRM & Velocity Tracking
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl">
              Leave messy spreadsheets behind. Track job postings from initial bookmark to interview rounds, recruiter notes, salary targets, and final offer letters.
            </p>

            {/* Pipeline Stage Progression Mini Bar */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center">
                <div className="text-xs font-bold text-slate-900">Saved</div>
                <div className="text-[11px] text-slate-500 mt-0.5">8 Opportunities</div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-center">
                <div className="text-xs font-bold text-slate-900">Applied</div>
                <div className="text-[11px] text-slate-500 mt-0.5">14 Submissions</div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3 text-center">
                <div className="text-xs font-bold text-emerald-800">Interviewing</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">4 Active Loops</div>
              </div>
              <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-3 text-center">
                <div className="text-xs font-bold text-teal-800">Offer</div>
                <div className="text-[11px] text-teal-700 mt-0.5">1 Received</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <TrendingUp className="size-4 text-emerald-600" />
              Average 28.5% interview conversion rate
            </span>
            <span className="font-bold text-emerald-700">Real-Time Sync</span>
          </div>
        </div>
      </div>
    </section>
  );
}
