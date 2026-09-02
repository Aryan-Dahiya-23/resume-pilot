export function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-t border-border pt-5">
      <div className="flex items-start gap-4">
        <div className="text-sm font-semibold text-brand">0{number}</div>
        <div>
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <div className="mt-1 text-sm leading-6 text-muted-foreground">{description}</div>
        </div>
      </div>
    </div>
  );
}
