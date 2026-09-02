import Link from "next/link";
import { BrandLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export function LandingHeader({ isSignedIn = false }: { isSignedIn?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <BrandLockup subtitle={null} />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href={isSignedIn ? "/dashboard/resumes" : "/sign-in"}>
              {isSignedIn ? "Resumes" : "Sign in"}
            </Link>
          </Button>
          <Button asChild>
            <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
              {isSignedIn ? "Go to dashboard" : "Get started"}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
