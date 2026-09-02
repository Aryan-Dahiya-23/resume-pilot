import { StepCard } from "@/components/landing/step-card";

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
      <div>
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          How it works
        </div>
        <h2 className="mt-2 font-heading text-3xl text-foreground sm:text-4xl">
          Upload. Review. Improve.
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          The goal is momentum. Small improvements + consistent applications.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StepCard
          number="1"
          title="Upload your resume"
          description="Upload a PDF. We extract text and store your file securely."
        />
        <StepCard
          number="2"
          title="Get instant feedback"
          description="AI reviews structure, impact, and role match. You get a clear plan."
        />
        <StepCard
          number="3"
          title="Track your job hunt"
          description="Add jobs in 10 seconds. Move them through your pipeline."
        />
      </div>
    </section>
  );
}
