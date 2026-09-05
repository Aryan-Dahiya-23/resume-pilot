import Link from "next/link";
import type { Metadata } from "next";
import { PublicPageLayout } from "@/components/layout/public-page-layout";
import { buttonStyles } from "@/components/ui/button";
export const metadata: Metadata = { title: "A little help" };
export default function ContactPage() {
  return (
    <PublicPageLayout
      eyebrow="A LITTLE HELP ALONG THE WAY"
      title="Let’s keep you moving."
    >
      <p>
        Here are a few answers to help you get the most from your workspace.
      </p>
      <div className="mb-8 divide-y divide-zinc-200 border-y border-zinc-200">
        {[
          {
            q: "Which resume files can I upload?",
            a: "You can upload PDF and DOCX files up to 5 MB. If a file isn’t accepted, check its format and size, then try again.",
          },
          {
            q: "My review is still processing. What should I do?",
            a: "The resume details page updates automatically while your review is processing. If the review fails, use “Review again” or upload another version.",
          },
          {
            q: "What does my resume score mean?",
            a: "Your score is an AI estimate of resume readiness. Use the specific suggestions to improve clarity and relevance; the score doesn’t predict whether an employer will interview you.",
          },
          {
            q: "Can I export or delete my data?",
            a: "Yes. Go to Settings to export your jobs or resume feedback. You can delete individual resumes and jobs, or remove your workspace data from Settings.",
          },
        ].map((item) => (
          <details key={item.q} className="py-5">
            <summary className="text-sm font-medium">{item.q}</summary>
            <p className="!mb-0 mt-3 !text-sm">{item.a}</p>
          </details>
        ))}
      </div>
      <Link href="/dashboard" className={buttonStyles()}>
        Open my workspace
      </Link>
      <p className="mt-8 !text-xs">
        Direct support contact details have not been published yet.
      </p>
    </PublicPageLayout>
  );
}
