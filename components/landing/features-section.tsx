import { Briefcase, FileText, Wand2 } from "lucide-react";
import { FeatureCard } from "@/components/landing/feature-card";

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">The essentials</div>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-3xl">Tools that turn intent into progress.</h2>
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
