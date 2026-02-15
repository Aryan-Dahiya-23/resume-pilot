import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
              <Sparkles className="h-3.5 w-3.5" />
              Built for focused job search
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-zinc-900 sm:text-3xl">
              Ready to improve faster?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-600">
              Upload your resume, get actionable feedback, and keep your applications organized in one dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/sign-in">
              <Button className="px-5 py-2.5">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" className="px-5 py-2.5">
                View demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
