import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHeader({ isSignedIn = false }: { isSignedIn?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs shadow-emerald-600/20">
            <Compass className="size-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900">
              ResumePilot
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="#features" className="hover:text-slate-900 transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-slate-900 transition-colors">
            How It Works
          </Link>
          <Link href="#preview" className="hover:text-slate-900 transition-colors">
            Interactive Demo
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {isSignedIn ? (
            <Button asChild size="sm" className="shadow-xs shadow-emerald-600/20">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="shadow-xs shadow-emerald-600/20">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
