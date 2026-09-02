export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-foreground/10">
      <div className="flex items-start gap-3">
        <div className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
          {icon}
        </div>
        <div>
          <div className="font-heading text-xl text-foreground">{title}</div>
          <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</div>
        </div>
      </div>
    </div>
  );
}
