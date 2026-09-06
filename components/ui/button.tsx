import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

// shadcn's composable button, themed to ResumePilot's visual system.
const buttonVariants = cva(
  "button disabled:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "button-primary",
        primary: "button-primary",
        secondary: "button-secondary",
        outline: "button-secondary",
        ghost: "button-ghost",
        destructive: "button-danger",
        danger: "button-danger",
        link: "button-ghost underline-offset-4 hover:underline",
      },
      size: {
        default: "",
        sm: "px-3 text-xs",
        lg: "button-lg",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;
export function buttonStyles(
  variant: ButtonVariant = "primary",
  className?: string,
) {
  return cn(buttonVariants({ variant }), className);
}
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      type={asChild ? type : (type ?? "button")}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
export { Button, buttonVariants };
