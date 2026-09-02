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
    <div className="surface-card p-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-brand">{icon}</div>
        <div>
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <div className="mt-1 text-sm leading-6 text-muted-foreground">{description}</div>
        </div>
      </div>
    </div>
  );
}
