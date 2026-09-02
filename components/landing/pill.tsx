export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}
