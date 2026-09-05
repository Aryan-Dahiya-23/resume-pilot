import type { Metadata } from "next";
import { PublicPageLayout } from "@/components/layout/public-page-layout";
export const metadata: Metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <PublicPageLayout
      eyebrow="YOUR INFORMATION"
      title="Privacy, in your hands."
    >
      <p>
        You can manage your resume files, application records, and feedback in
        your workspace. Settings includes options to export your data or delete
        it.
      </p>
      <div className="panel p-6">
        <h2 className="section-title mb-3">Full policy coming soon</h2>
        <p className="!mb-0 !text-sm">
          ResumePilot’s full privacy policy has not been published. This page is
          not a substitute for a complete policy covering data processing,
          providers, retention, and your rights.
        </p>
      </div>
    </PublicPageLayout>
  );
}
