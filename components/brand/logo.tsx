import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-9 place-items-center rounded-lg bg-primary font-heading text-sm text-primary-foreground",
        className,
      )}
    >
      RP
    </span>
  );
}

export function BrandLockup({
  href = "/",
  subtitle = "AI resume + job tracker",
  className,
}: {
  href?: string;
  subtitle?: string | null;
  className?: string;
}) {
  const content = (
    <>
      <BrandMark />
      <span className="min-w-0">
        <span className="block font-heading text-lg leading-none text-foreground">
          ResumePilot
        </span>
        {subtitle ? (
          <span className="mt-1 block text-xs text-muted-foreground">{subtitle}</span>
        ) : null}
      </span>
    </>
  );

  if (!href) {
    return <span className={cn("flex items-center gap-2.5", className)}>{content}</span>;
  }

  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)}>
      {content}
    </Link>
  );
}
