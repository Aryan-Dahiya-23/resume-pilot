import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <div className="font-semibold text-foreground">ResumePilot</div>
          <div className="mt-1 text-xs">A focused workspace for your job search.</div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link className="hover:text-foreground" href="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-foreground" href="/terms">
            Terms
          </Link>
          <Link className="hover:text-foreground" href="/contact">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
