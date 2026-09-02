import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Pill } from "@/components/landing/pill";

export function HeroSection({ isSignedIn = false }: { isSignedIn?: boolean }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16">
        <div>
          <div className="flex flex-wrap gap-2">
            <Pill>Resume feedback</Pill>
            <Pill>Version history</Pill>
            <Pill>Job pipeline</Pill>
          </div>
          <div className="mt-7 text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">
            Career workspace
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl leading-[0.98] font-semibold tracking-[-0.05em] text-foreground sm:text-6xl">
            Bring more clarity to your job search.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Review your resume, make the next edit count, and keep every opportunity moving without an awkward spreadsheet.
          </p>
          <div className="mt-7 flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                {isSignedIn ? "Go to dashboard" : "Start your workspace"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={isSignedIn ? "/dashboard/resumes" : "/sign-in"}>
                {isSignedIn ? "Review a resume" : "Sign in"}
              </Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-5">
            <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-700" />Prioritized feedback</span>
            <span className="flex items-center gap-2"><Shield className="size-4 text-brand" />Private by default</span>
          </div>
        </div>

        <div className="surface-card overflow-hidden">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="size-4 text-brand" />
              Resume review
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex items-end justify-between gap-5 border-b border-border pb-5">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">ATS readiness</div>
                <div className="mt-2 text-5xl font-semibold tracking-[-0.05em] text-foreground">78</div>
                <div className="mt-1 text-sm text-emerald-700">+7 from last version</div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div className="font-semibold text-foreground">Frontend Engineer</div>
                <div className="mt-1">Latest review</div>
              </div>
            </div>
            <div className="divide-y divide-border">
              <div className="flex gap-3 py-4">
                <span className="text-xs font-semibold text-brand">01</span>
                <div><div className="text-sm font-semibold text-foreground">Add measurable outcomes</div><p className="mt-1 text-sm leading-5 text-muted-foreground">Strengthen two experience bullets with scope and impact.</p></div>
              </div>
              <div className="flex gap-3 py-4">
                <span className="text-xs font-semibold text-brand">02</span>
                <div><div className="text-sm font-semibold text-foreground">Review role language</div><p className="mt-1 text-sm leading-5 text-muted-foreground">Bring the strongest relevant keywords into your experience.</p></div>
              </div>
              <div className="flex gap-3 pt-4">
                <span className="text-xs font-semibold text-brand">03</span>
                <div><div className="text-sm font-semibold text-foreground">Move the next application</div><p className="mt-1 text-sm leading-5 text-muted-foreground">Keep a deliberate next step on every opportunity.</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
