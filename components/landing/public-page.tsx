import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PublicPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl border border-border bg-card p-6 sm:p-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          ResumePilot
        </Link>
        <div className="mt-14 text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">{eyebrow}</div>
        <h1 className="mt-4 text-4xl leading-[0.98] font-semibold tracking-[-0.045em] text-foreground sm:text-5xl">{title}</h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">{children}</div>
      </div>
    </main>
  );
}
