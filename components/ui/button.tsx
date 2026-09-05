import { cn } from "@/components/ui/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export function buttonStyles(
  variant: ButtonVariant = "primary",
  className?: string,
) {
  return cn("button", `button-${variant}`, className);
}

export function Button({
  children,
  variant = "primary",
  className,
  type = "button",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: ButtonVariant;
}) {
  return (
    <button type={type} className={buttonStyles(variant, className)} {...rest}>
      {children}
    </button>
  );
}
