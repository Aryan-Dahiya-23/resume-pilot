import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  icon,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const hasHeader = Boolean(title || description || icon || action);

  return (
    <Card className={cn("shadow-none", className)}>
      {hasHeader ? (
        <CardHeader className="border-b">
          <div className="flex items-start gap-3">
            {icon ? (
              <div className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
                {icon}
              </div>
            ) : null}
            <div className="min-w-0">
              {title ? <CardTitle>{title}</CardTitle> : null}
              {description ? <CardDescription>{description}</CardDescription> : null}
            </div>
          </div>
          {action ? <CardAction>{action}</CardAction> : null}
        </CardHeader>
      ) : null}
      <CardContent className={hasHeader ? undefined : "pt-0"}>{children}</CardContent>
    </Card>
  );
}
