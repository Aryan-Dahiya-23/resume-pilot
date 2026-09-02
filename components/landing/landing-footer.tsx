import Link from "next/link";
import { Compass } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs shadow-indigo-500/20">
            <Compass className="size-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 leading-tight">
              ResumePilot
            </div>
            <div className="text-xs text-slate-400">
              Intelligent Career Copilot • DeepSeek Powered
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500">
          <Link className="hover:text-slate-900 transition-colors" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="hover:text-slate-900 transition-colors" href="/terms">
            Terms of Service
          </Link>
          <Link className="hover:text-slate-900 transition-colors" href="/contact">
            Contact Support
          </Link>
          <span className="text-slate-400">
            © {new Date().getFullYear()} ResumePilot Inc. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
