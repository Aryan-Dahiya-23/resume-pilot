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
    <div className="relative rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs">
      <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 font-mono text-sm font-bold text-white shadow-xs shadow-indigo-500/20">
        0{number}
      </div>
      <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
