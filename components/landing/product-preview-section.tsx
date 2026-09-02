import Link from "next/link";
import { ArrowRight, Calendar, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProductPreviewSection({ isSignedIn = false }: { isSignedIn?: boolean }) {
  const jobs = [
    ["Frontend Engineer", "Stripe", "Interview"],
    ["Software Engineer", "Notion", "Applied"],
    ["Backend Engineer", "Ramp", "Saved"],
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card overflow-hidden">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="size-4 text-brand" />
              What a review gives you
            </div>
          </div>
          <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              ["81", "Current score"],
              ["72", "Previous score"],
              ["+9", "Change"],
            ].map(([value, label], index) => (
              <div key={label} className="p-5 sm:p-6">
                <div className={index === 2 ? "text-3xl font-semibold tracking-[-0.04em] text-emerald-700" : "text-3xl font-semibold tracking-[-0.04em] text-foreground"}>{value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-border bg-muted/25 px-5 py-4 text-sm leading-6 text-muted-foreground sm:px-6">
            <span className="font-semibold text-foreground">Highest-impact fix: </span>
            Add measurable scope and outcomes to two experience bullets.
          </div>
        </div>

        <div className="surface-card overflow-hidden">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <div className="text-sm font-semibold text-foreground">A pipeline you can act on</div>
          </div>
          <div className="divide-y divide-border/70">
            {jobs.map(([role, company, status]) => (
              <div key={company} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                <div className="min-w-0"><div className="truncate text-sm font-semibold text-foreground">{role}</div><div className="mt-1 text-xs text-muted-foreground">{company}</div></div>
                <span className="shrink-0 border border-border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">{status}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border bg-muted/25 px-5 py-4 text-sm text-muted-foreground sm:px-6">
            <span className="inline-flex items-center gap-2"><Calendar className="size-4 text-brand" />Weekly target</span>
            <span className="font-semibold text-foreground">6 / 10</span>
          </div>
          <div className="px-5 py-4 sm:px-6">
            <Button size="sm" asChild>
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>Open your workspace<ArrowRight className="size-3.5" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
