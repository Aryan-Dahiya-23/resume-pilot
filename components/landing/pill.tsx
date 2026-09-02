export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-2xs">
      <span className="size-1.5 rounded-full bg-indigo-500 animate-pulse" />
      {children}
    </span>
  );
}
