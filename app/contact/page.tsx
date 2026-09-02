import { Mail, MessageSquare } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <PublicShell
      eyebrow="Get in Touch"
      title="Contact Support & Feedback"
      subtitle="Have questions, feature suggestions, or need help with your resume audit?"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 not-prose">
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
            <Mail className="size-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Email Support</h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Directly reach our product engineering team. We typically respond within 24 hours.
          </p>
          <div className="mt-4">
            <a
              href="mailto:support@resumepilot.app"
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              support@resumepilot.app
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 mb-4">
            <MessageSquare className="size-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Feature Requests</h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Vote on upcoming capabilities such as LinkedIn profile imports and cover letter generation.
          </p>
          <div className="mt-4">
            <Button variant="secondary" size="xs" asChild>
              <a href="https://github.com/Aryan-Dahiya-23/resume-pilot/issues" target="_blank" rel="noreferrer">
                Submit on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
