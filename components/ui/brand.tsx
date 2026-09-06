import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/components/ui/cn";

export function Brand({
  light = false,
  compact = false,
  href = "/",
  ariaLabel = "ResumePilot home",
}: {
  light?: boolean;
  compact?: boolean;
  href?: string;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
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
