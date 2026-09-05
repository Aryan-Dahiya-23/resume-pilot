import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/components/ui/cn";

export function Brand({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="ResumePilot home"
      className={cn("brand", light && "brand-light")}
    >
      <span className="brand-mark">
        <ArrowUpRight size={23} strokeWidth={2.5} />
      </span>
      {!compact && (
        <span>
          resume<span className="font-normal">pilot</span>
          <span className="brand-period">.</span>
        </span>
      )}
    </Link>
  );
}
