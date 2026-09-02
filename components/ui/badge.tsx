import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        neutral:
          "bg-slate-100 text-slate-700 border border-slate-200/80",
        info:
          "bg-sky-50 text-sky-700 border border-sky-200/80",
        success:
          "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
        warning:
          "bg-amber-50 text-amber-700 border border-amber-200/80",
        danger:
          "bg-rose-50 text-rose-700 border border-rose-200/80",
        brand:
          "bg-indigo-50 text-indigo-700 border border-indigo-200/80",
        outline:
          "border border-slate-200 text-slate-700 bg-white",
      },
      dot: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "neutral",
      dot: false,
    },
  },
);

const dotColors: Record<string, string> = {
  neutral: "bg-slate-400",
  info: "bg-sky-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  brand: "bg-indigo-500",
  outline: "bg-slate-400",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  withDot?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  withDot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, className }))} {...props}>
      {withDot ? (
        <span
          className={cn("size-1.5 rounded-full shrink-0", dotColors[variant ?? "neutral"])}
        />
      ) : null}
      {children}
    </div>
  );
}
