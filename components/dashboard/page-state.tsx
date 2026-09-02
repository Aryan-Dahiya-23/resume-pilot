"use client";

import { AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardPageLoading({
  label = "Loading workspace...",
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3">
      <div className="relative flex size-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50/50 shadow-xs">
        <Loader2 className="size-6 animate-spin text-emerald-600" />
      </div>
      <span className="text-sm font-medium text-slate-500">{label}</span>
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
    <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-6 shadow-xs">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-rose-100 p-2.5 text-rose-600 shrink-0">
          <AlertCircle className="size-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-rose-900">{title}</h3>
          <p className="mt-1 text-sm text-rose-700 leading-relaxed">{message}</p>
          {onRetry ? (
            <div className="mt-4">
              <Button
                variant="danger"
                size="sm"
                onClick={onRetry}
                className="gap-1.5"
              >
                <RotateCcw className="size-3.5" />
                Try again
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
