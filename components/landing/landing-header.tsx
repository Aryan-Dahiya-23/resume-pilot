import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingHeader({ isSignedIn = false }: { isSignedIn?: boolean }) {
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-end gap-1">
          <span className="text-lg font-semibold tracking-[-0.04em] text-foreground">ResumePilot</span>
          <span className="mb-0.5 size-1 rounded-full bg-brand" />
        </Link>

        <div className="flex items-center gap-2">
          {!isSignedIn ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          ) : null}
          <Button size="sm" asChild>
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
              {isSignedIn ? "Dashboard" : "Get started"}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
