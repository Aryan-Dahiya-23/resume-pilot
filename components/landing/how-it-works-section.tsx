import { StepCard } from "@/components/landing/step-card";

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
      <div>
        <div className="text-sm text-zinc-500">How it works</div>
        <h2 className="mt-1 text-2xl font-semibold text-zinc-900">Upload. Review. Improve.</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
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
