import Link from "next/link";
import { ArrowLeft, Compass, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicShell({
  eyebrow = "Legal & Governance",
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/70 ambient-glow">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Compass className="size-4.5" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              ResumePilot
            </span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="gap-1.5 text-xs">
              <ArrowLeft className="size-3.5" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-16">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-12 shadow-xs">
          <div className="border-b border-slate-100 pb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              {eyebrow}
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                {subtitle}
              </p>
            ) : null}
          </div>

          <div className="mt-8 prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
