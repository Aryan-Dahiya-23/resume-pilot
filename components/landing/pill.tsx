export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
      {children}
    </span>
  );
}
