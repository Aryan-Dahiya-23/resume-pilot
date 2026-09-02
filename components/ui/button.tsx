import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-150 outline-none select-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-600/25 border border-emerald-500/40 hover:shadow-md hover:shadow-emerald-600/30 focus-visible:ring-2 focus-visible:ring-emerald-500/40",
        secondary:
          "bg-white text-slate-800 border border-slate-200/90 shadow-2xs hover:bg-slate-50/90 hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-300 active:bg-slate-100",
        outline:
          "border border-slate-200/90 bg-transparent text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-300",
        ghost:
          "bg-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-300",
        danger:
          "bg-rose-600 text-white shadow-xs hover:bg-rose-700 border border-rose-500/40 focus-visible:ring-2 focus-visible:ring-rose-400",
        subtle:
          "bg-emerald-50/80 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100/70 focus-visible:ring-2 focus-visible:ring-emerald-400",
        dark:
          "bg-slate-900 hover:bg-slate-800 text-white shadow-xs border border-slate-800 hover:shadow-md focus-visible:ring-2 focus-visible:ring-slate-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 px-2.5 text-xs rounded-lg",
        sm: "h-8 px-3 text-xs rounded-lg",
        lg: "h-11 px-6 text-base rounded-xl font-semibold",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-xs": "size-7 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
