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
    <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          {icon ? (
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-zinc-900 text-white">{icon}</div>
          ) : null}
          <div>
            <div className="text-sm font-medium text-zinc-900">{title}</div>
          </div>
        </div>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
