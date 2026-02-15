"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

export function DashboardPageLoading({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div className="relative min-h-[60vh] w-full">
      <div className="absolute left-1/2 top-[56%] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-3 text-zinc-700">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}

export function DashboardPageError({
  title = "Something went wrong",
  message = "Please refresh and try again.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl bg-rose-100 p-2 text-rose-700">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold text-rose-800">{title}</div>
          <div className="mt-1 text-sm text-rose-700">{message}</div>
          {onRetry ? (
            <div className="mt-4">
              <button
                className="rounded-2xl bg-rose-700 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
                onClick={onRetry}
              >
                Try again
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
