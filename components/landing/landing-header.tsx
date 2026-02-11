import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-900">
              ResumePilot
            </div>
            <div className="text-xs text-zinc-500">AI Resume + Job Tracker</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Pricing
          </Button>
          <Link href="/sign-in">
            <Button variant="secondary">Sign in</Button>
          </Link>
          <Button>Get started</Button>
        </div>
      </div>
    </header>
  );
}
