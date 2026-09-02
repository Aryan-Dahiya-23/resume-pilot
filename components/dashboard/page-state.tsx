"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DashboardPageLoading({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div className="grid min-h-[52vh] place-items-center">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin text-brand" />
        <span>{label}</span>
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
    <div className="surface-card border-l-2 border-l-destructive p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div>
          <div className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            {title}
          </div>
          <div className="mt-2 text-sm leading-6 text-muted-foreground">{message}</div>
          {onRetry ? (
            <div className="mt-4">
              <Button variant="secondary" onClick={onRetry}>
                Try again
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
