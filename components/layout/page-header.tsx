import { cn } from "@/lib/utils";

export function PageHeader({
  kicker,
  title,
  description,
  actions,
  className,
}: {
  kicker?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {kicker ? (
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {kicker}
          </div>
        ) : null}
        <h1 className="font-heading text-3xl leading-tight text-foreground">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">{actions}</div>
      ) : null}
    </div>
  );
}
