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
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-900 text-white">
          <span className="text-sm font-semibold">{number}</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-900">{title}</div>
          <div className="mt-1 text-sm text-zinc-600">{description}</div>
        </div>
      </div>
    </div>
  );
}
