"use client";
import { DashboardPageError } from "@/components/dashboard/page-state";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <DashboardPageError
      title="Your workspace hit a small pause."
      message="We couldn’t load this page. Give it another try."
      onRetry={reset}
    />
  );
}
