import { Sparkles } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-zinc-900 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="font-medium text-zinc-900">ResumePilot</div>
            <div className="text-xs text-zinc-500">Build by you. Ship fast.</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <a className="hover:underline" href="#">
            Privacy
          </a>
          <a className="hover:underline" href="#">
            Terms
          </a>
          <a className="hover:underline" href="#">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
