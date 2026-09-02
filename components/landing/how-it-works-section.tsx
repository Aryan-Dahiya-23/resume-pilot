import { StepCard } from "@/components/landing/step-card";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="max-w-xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Seamless Workflow
        </div>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Three Simple Steps to Higher Callback Rates
        </h2>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed sm:text-base">
          Momentum compounds when your feedback loop is immediate and your application pipeline is transparent.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StepCard
          number="1"
          title="Upload Resume PDF or DOCX"
          description="Drop your existing resume. Our text extraction engine analyzes sections, skills, work history, and formatting structure."
        />
        <StepCard
          number="2"
          title="Review DeepSeek Audit"
          description="Receive an ATS readiness score, missing role-specific keywords, and actionable bullet-level rewrite suggestions."
        />
        <StepCard
          number="3"
          title="Manage Your Pipeline"
          description="Track every application from Saved to Offer. Never drop the ball on interview follow-ups or recruiter screens."
        />
      </div>
    </section>
  );
}
