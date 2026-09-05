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
    <section className="panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          {icon ? <div className="icon-tile">{icon}</div> : null}
          <div>
            <h2 className="section-title">{title}</h2>
          </div>
        </div>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
