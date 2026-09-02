import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCtaSection({ isSignedIn = false }: { isSignedIn?: boolean }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
      <div className="border-t-2 border-t-brand bg-card p-6 ring-1 ring-border sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.14em] text-brand uppercase">A more focused search</div>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-3xl">
              Put your next best move in reach.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Upload your resume, get actionable feedback, and keep your applications organized in one dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                {isSignedIn ? "Go to dashboard" : "Get started"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={isSignedIn ? "/dashboard/resumes" : "/sign-in"}>
                {isSignedIn ? "Review a resume" : "Sign in"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
