import Link from "next/link";
import { BrandLockup } from "@/components/brand/logo";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-card/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <BrandLockup subtitle="Build by you. Ship fast." />
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
