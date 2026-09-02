import { PublicShell } from "@/components/layout/public-shell";

export default function TermsPage() {
  return (
    <PublicShell
      eyebrow="Terms of Service"
      title="User Terms & Conditions"
      subtitle="Last updated: September 2026 • Agreement for Using ResumePilot"
    >
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
        <p>
          By creating an account or accessing the ResumePilot web application, you agree to comply with these terms, privacy policies, and applicable employment laws.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">2. Permitted Use</h2>
        <p>
          You agree to only upload resumes, CVs, and professional work history belonging to you or for which you hold authorized permission to evaluate. Automated scraping or reverse engineering of the AI scoring engine is prohibited.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">3. Disclaimer of Guarantees</h2>
        <p>
          While ResumePilot provides high-precision AI recommendations based on modern ATS benchmarks, hiring outcomes ultimately depend on employer discretion and individual job requirements.
        </p>
      </section>
    </PublicShell>
  );
}
