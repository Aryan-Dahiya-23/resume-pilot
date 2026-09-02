export function Card({
  title,
  icon,
  right,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          {icon ? <div className="text-brand">{icon}</div> : null}
          <div>
            <div className="text-sm font-semibold text-foreground">{title}</div>
          </div>
        </div>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
