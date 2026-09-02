import { Briefcase, FileText, Wand2 } from "lucide-react";
import { FeatureCard } from "@/components/landing/feature-card";

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
      <div>
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Features
        </div>
        <h2 className="mt-2 font-heading text-3xl text-foreground sm:text-4xl">
          Everything you need — nothing you don’t
        </h2>
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
