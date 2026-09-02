import Link from "next/link";
import { ArrowRight, Calendar, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductPreviewSection({ isSignedIn = false }: { isSignedIn?: boolean }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-foreground/10">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Resume review preview
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-muted/70 p-4">
              <div className="text-xs text-muted-foreground">Current score</div>
              <div className="mt-1 font-heading text-3xl text-foreground">81</div>
            </div>
            <div className="rounded-lg bg-muted/70 p-4">
              <div className="text-xs text-muted-foreground">Last score</div>
              <div className="mt-1 font-heading text-3xl text-foreground">72</div>
            </div>
            <div className="rounded-lg bg-muted/70 p-4">
              <div className="text-xs text-muted-foreground">Delta</div>
              <div className="mt-1 font-heading text-3xl text-success-foreground">+9</div>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-muted/70 p-4 text-sm text-muted-foreground">
            Top suggestion: Add measurable impact to 2 experience bullets and include
            role-specific keywords.
          </div>
        </div>

        <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-foreground/10">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FileText className="h-4 w-4 text-primary" />
            Job pipeline preview
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-muted/70 px-3 py-2 text-sm">
              <span className="font-medium text-foreground">Frontend Engineer · Stripe</span>
              <span className="rounded-full bg-card px-2 py-1 text-xs ring-1 ring-foreground/10">
                Interview
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/70 px-3 py-2 text-sm">
              <span className="font-medium text-foreground">SWE · Notion</span>
              <span className="rounded-full bg-card px-2 py-1 text-xs ring-1 ring-foreground/10">
                Applied
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/70 px-3 py-2 text-sm">
              <span className="font-medium text-foreground">Backend · Ramp</span>
              <span className="rounded-full bg-card px-2 py-1 text-xs ring-1 ring-foreground/10">
                Saved
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/70 px-3 py-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Weekly target: 10 applications
            </span>
            <span className="font-medium text-foreground">6 / 10</span>
          </div>
          <div className="mt-4">
            <Button asChild>
              <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
                Try dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
