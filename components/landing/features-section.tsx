import { Briefcase, FileText, Wand2 } from "lucide-react";
import { FeatureCard } from "@/components/landing/feature-card";

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm text-zinc-500">Features</div>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-900">Everything you need — nothing you don’t</h2>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <FeatureCard
          icon={<FileText className="h-4 w-4" />}
          title="ATS-style resume review"
          description="Get a clear score, strengths, weaknesses, and what to fix next."
        />
        <FeatureCard
          icon={<Wand2 className="h-4 w-4" />}
          title="Bullet rewrites that actually help"
          description="Turn vague bullets into measurable, recruiter-friendly lines."
        />
        <FeatureCard
          icon={<Briefcase className="h-4 w-4" />}
          title="Job tracker like a pipeline"
          description="Saved → Applied → Interview → Offer. Track progress without Excel."
        />
      </div>
    </section>
  );
}
