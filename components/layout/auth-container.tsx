import Link from "next/link";
import { ArrowLeft, Compass, Sparkles } from "lucide-react";

export function AuthContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col justify-center hero-mesh bg-slate-50/80 px-4 py-12 sm:px-6 lg:px-8">
      {/* Back to Home Link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xs shadow-indigo-500/20">
            <Compass className="size-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            ResumePilot
          </span>
        </Link>
      </div>

      <div className="flex justify-center">{children}</div>
    </div>
  );
}
