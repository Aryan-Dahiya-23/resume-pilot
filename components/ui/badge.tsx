import { cn } from "@/components/ui/cn";

export type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info";

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "border-border bg-muted text-muted-foreground",
  info: "border-brand/20 bg-brand/8 text-brand",
  success: "border-emerald-500/15 bg-emerald-500/10 text-emerald-700",
  warning: "border-amber-500/15 bg-amber-500/10 text-amber-700",
  danger: "border-rose-500/15 bg-rose-500/10 text-rose-700",
};

export function Badge({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        variantClasses[variant],
      )}
    >
      {children}
    </span>
  );
}
