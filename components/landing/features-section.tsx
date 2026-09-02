import {
  BarChart3,
  Briefcase,
  CheckCircle,
  FileText,
  Layers,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import { FeatureCard } from "@/components/landing/feature-card";

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600">
          <Sparkles className="size-3.5" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Everything You Need to Win Interviews
        </h2>
        <p className="mt-3 text-sm text-slate-500 sm:text-base leading-relaxed">
          Modern recruiting systems reject over 70% of resumes before a human recruiter ever sees them. ResumePilot ensures you pass every screen.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={<FileText className="size-5" />}
          title="DeepSeek ATS Audit"
          description="Instant score breakdown across quantifiable impact, structure, readability, and recruiter scanning ease."
          badge="AI Powered"
        />
        <FeatureCard
          icon={<Wand2 className="size-5" />}
          title="Action-Verb Rewrites"
          description="Automated bullet point rewrites transforming generic duties into measurable accomplishments with clear rationale."
          badge="Instant Diffs"
        />
        <FeatureCard
          icon={<Target className="size-5" />}
          title="Role Keyword Matcher"
          description="Identify missing high-value competencies for your specific seniority and target engineering domain."
          badge="Tailored"
        />
        <FeatureCard
          icon={<Briefcase className="size-5" />}
          title="Opportunity Pipeline"
          description="Organize saved, applied, and active interview rounds in a unified command center without spreadsheets."
          badge="Zero Chaos"
        />
      </div>
    </section>
  );
}
