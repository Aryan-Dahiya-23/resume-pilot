"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardPageLoading({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div className="relative min-h-[60vh] w-full">
      <div className="absolute left-1/2 top-[56%] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-3 text-muted-foreground">
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
    <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-destructive/15 p-2 text-destructive">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-semibold text-destructive">{title}</div>
          <div className="mt-1 text-sm text-destructive/80">{message}</div>
          {onRetry ? (
            <div className="mt-4">
              <Button variant="danger" onClick={onRetry}>
                Try again
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
