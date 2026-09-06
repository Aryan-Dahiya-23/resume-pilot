"use client";

import { ArrowRight, RefreshCw, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardPageLoading({
  label = "Getting your workspace ready…",
}: {
  label?: string;
}) {
  return (
    <div role="status" aria-label={label} className="space-y-7">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="space-y-3">
        <div className="skeleton h-3 w-28" />
        <div className="skeleton h-8 w-64 max-w-full" />
        <div className="skeleton h-3 w-80 max-w-full" />
      </div>
      <div aria-hidden="true" className="metric-grid">
        {[1, 2, 3, 4].map((n) => (
          <div className="panel space-y-4 p-6" key={n}>
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-8 w-12" />
            <div className="skeleton h-2 w-24" />
          </div>
        ))}
      </div>
      <div className="overview-grid" aria-hidden="true">
        {[1, 2].map((n) => (
          <div className="panel space-y-6 p-6" key={n}>
            <div className="skeleton h-4 w-40" />
            <div className="skeleton h-40 w-full" />
            <div className="skeleton h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardPageError({
  title = "A small pause in your progress.",
  message = "We couldn’t load this part of your workspace. Please try again.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="panel empty-state">
      <div className="icon-tile">
        <Sprout size={25} />
      </div>
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && (
        <Button onClick={onRetry}>
          <RefreshCw size={15} />
          Try again
        </Button>
      )}
      <div className="mt-5">
        <a href="/dashboard" className="text-link">
          Back to overview
          <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
