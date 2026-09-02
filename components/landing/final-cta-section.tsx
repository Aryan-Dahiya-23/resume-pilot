import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCtaSection({ isSignedIn = false }: { isSignedIn?: boolean }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-8 sm:p-14 shadow-xl text-white">
        {/* Ambient Decorative Blur */}
        <div className="absolute -top-24 -right-24 size-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">
              <Sparkles className="size-3.5" />
              Start For Free • Instant Setup
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Take the Guesswork Out of Your Resume Today.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Join thousands of engineers and professionals improving their interview callback ratios with ResumePilot&apos;s intelligent audits.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row shrink-0">
            <Button
              size="lg"
              asChild
              className="bg-white text-slate-950 hover:bg-slate-100 shadow-md"
            >
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                {isSignedIn ? "Go to Dashboard" : "Audit Resume Free"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-slate-700 text-white hover:bg-slate-800"
            >
              <Link href={isSignedIn ? "/dashboard/resumes" : "/sign-in"}>
                {isSignedIn ? "Upload Document" : "Sign In"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
