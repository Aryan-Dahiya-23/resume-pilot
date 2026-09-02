import { PublicShell } from "@/components/layout/public-shell";

export default function PrivacyPage() {
  return (
    <PublicShell
      eyebrow="Privacy Policy"
      title="Your Data & Career Privacy"
      subtitle="Last updated: September 2026 • ResumePilot Commitment to Confidentiality"
    >
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
        <p>
          ResumePilot collects document content that you explicitly upload (such as PDF or Word resumes), along with role targets, experience levels, and job application tracking entries you log.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">2. How AI Audits Work</h2>
        <p>
          Uploaded documents are processed in secure memory to extract textual content for evaluation by our DeepSeek AI model. Your resume data is never used to train public foundation models or shared with third-party recruiters without your explicit instruction.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">3. Data Retention & Deletion</h2>
        <p>
          You maintain full ownership of your data. You may download your original files or permanently purge all resume records and job tracking history anytime via the Danger Zone in your Account Settings.
        </p>
      </section>
    </PublicShell>
  );
}
