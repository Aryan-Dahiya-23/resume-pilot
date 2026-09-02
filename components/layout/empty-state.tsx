import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("shadow-none", className)}>
      <CardContent className="py-10 text-center">
        {icon ? (
          <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-foreground">
            {icon}
          </div>
        ) : null}
        <div className="mt-4 font-heading text-2xl text-foreground">{title}</div>
        {description ? (
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
        ) : null}
        {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
