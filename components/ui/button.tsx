import { cn } from "@/components/ui/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm transition";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800",
  secondary: "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
  ghost: "text-zinc-900 hover:bg-zinc-100 shadow-none",
  danger: "bg-rose-600 text-white hover:bg-rose-500",
};

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
    <button type={type} className={cn(base, variantClasses[variant], className)} {...rest}>
      {children}
    </button>
  );
}
