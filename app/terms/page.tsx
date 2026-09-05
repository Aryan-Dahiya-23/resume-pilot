import type { Metadata } from "next";
import { PublicPageLayout } from "@/components/layout/public-page-layout";
export const metadata: Metadata = { title: "Terms" };
export default function TermsPage() {
  return (
    <PublicPageLayout
      eyebrow="USING RESUMEPILOT"
      title="A clear understanding."
    >
      <p>
        ResumePilot helps you review your resume and organize your job search.
        Review AI suggestions carefully and keep every statement true to your
        experience.
      </p>
      <div className="panel p-6">
        <h2 className="section-title mb-3">Full terms coming soon</h2>
        <p className="!mb-0 !text-sm">
          The complete terms of service have not been published. Resume feedback
          is guidance and does not guarantee interviews, job offers, or other
          outcomes.
        </p>
      </div>
    </PublicPageLayout>
  );
}
