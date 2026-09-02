import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, FileText, Shield, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/landing/pill";

export function HeroSection({ isSignedIn = false }: { isSignedIn?: boolean }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill>ATS-style scoring</Pill>
            <Pill>Bullet rewrites</Pill>
            <Pill>Job pipeline</Pill>
            <Pill>Resume versions</Pill>
          </div>

          <h1 className="mt-6 max-w-xl font-heading text-5xl leading-[1.05] text-foreground sm:text-6xl">
            Improve your resume.
            <br />
            Track the hunt.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            A focused workspace that reviews your resume with AI and keeps every application in
            one pipeline — no spreadsheets, no chaos.
          </p>

          <div className="mt-7 flex flex-col gap-2 sm:flex-row">
            <Button asChild size="lg">
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                {isSignedIn ? "Go to dashboard" : "Get started"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={isSignedIn ? "/dashboard/resumes" : "/sign-in"}>
                {isSignedIn ? "Upload resume" : "View product"}
              </Link>
            </Button>
          </div>

          <div className="mt-7 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Upload PDF and get feedback in seconds
            </div>
            <span className="hidden sm:inline">·</span>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Your resume stays private
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-foreground/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Latest resume
              </div>
              <div className="mt-1 font-heading text-3xl text-foreground">v3 — 78 ATS</div>
              <div className="mt-1 text-sm text-success-foreground">+7 from last version</div>
            </div>
            <div className="rounded-lg bg-muted px-4 py-3">
              <div className="text-xs text-muted-foreground">Jobs tracked</div>
              <div className="mt-1 font-heading text-2xl text-foreground">18</div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3">
            <div className="rounded-lg bg-muted/70 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Wand2 className="h-4 w-4 text-primary" />
                Top improvement
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Rewrite experience bullets with measurable impact.
              </div>
            </div>

            <div className="rounded-lg bg-muted/70 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <BarChart3 className="h-4 w-4 text-primary" />
                Pipeline
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-card px-3 py-1 text-xs font-medium text-foreground ring-1 ring-foreground/10">
                  Applied: 9
                </span>
                <span className="rounded-full bg-card px-3 py-1 text-xs font-medium text-foreground ring-1 ring-foreground/10">
                  Interview: 3
                </span>
                <span className="rounded-full bg-card px-3 py-1 text-xs font-medium text-foreground ring-1 ring-foreground/10">
                  Offer: 1
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-muted/70 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                Resume versions
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Track your improvement from v1 → v2 → v3.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
