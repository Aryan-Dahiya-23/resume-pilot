import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCtaSection({ isSignedIn = false }: { isSignedIn?: boolean }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="rounded-xl bg-primary p-6 text-primary-foreground shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Built for focused job search
            </div>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl">Ready to improve faster?</h2>
            <p className="mt-2 max-w-xl text-sm text-primary-foreground/80">
              Upload your resume, get actionable feedback, and keep your applications organized in
              one dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
                {isSignedIn ? "Go to dashboard" : "Get started"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href={isSignedIn ? "/dashboard/resumes" : "/sign-in"}>
                {isSignedIn ? "Upload resume" : "Sign in"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
