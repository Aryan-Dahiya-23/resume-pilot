import { cn } from "@/lib/utils";

export function FeatureCard({
  icon,
  title,
  description,
  badge,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-1",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          {icon}
        </div>
        {badge ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {badge}
          </span>
        ) : null}
      </div>

      <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
